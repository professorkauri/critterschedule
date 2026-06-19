const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const DAY_LABELS = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};
const DAY_SHORT_LABELS = {
  sunday: "Sun",
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
};
const AREA_ICONS = {
  "Dreamlight Valley": "tree",
  "Eternity Isle": "island",
  "Storybook Vale": "book",
  "Wishblossom Mountains": "flower",
};
const LOCATION_ICONS = {
  "Peaceful Meadow": "meadow",
  "Dazzle Beach": "wave",
  "Forest of Valor": "tree",
  "Glade of Trust": "leaf",
  "Sunlit Plateau": "sun",
  "Frosted Heights": "snow",
  "Forgotten Lands": "moon",
  "The Plaza": "sparkle",
  "The Docks": "anchor",
  "The Courtyard": "arch",
  "The Overlook": "mountain",
  "The Ruins": "ruins",
  "The Plains": "sun",
  "The Wastes": "desert",
  "The Oasis": "water",
  "The Borderlands": "mountain",
  "The Grasslands": "leaf",
  "The Grove": "tree",
  "The Lagoon": "water",
  "The Promenade": "sparkle",
  "The Bind": "book",
  "The Library of Lore": "book",
  "The Wild Woods": "tree",
  "The Fallen Fortress": "castle",
  "The Beanstalk Marshes": "leaf",
  "Teapot Falls": "water",
  "The Elysian Fields": "flower",
  "The Fiery Plains": "sun",
  "Mount Olympus": "mountain",
  "The Statue's Shadow": "statue",
  "Silver Summit": "mountain",
  "Wishing Way": "sparkle",
  "Delver Dale": "mountain",
  "Wishblossom Ranch": "flower",
  "Ranch Highlands": "mountain",
  "Paisley Park": "flower",
  "Haute Plateau": "mountain",
  "Runway River": "water",
  "Modish Marsh": "leaf",
  "Hunny Falls": "water",
  "Pixie Flats": "sparkle",
  "Sundae Shores": "wave",
  "Hundred-Acre Fields": "meadow",
};
const DEFAULT_ICON = "sparkle";
const DEFAULT_SLOT_COLOUR = "#386c54";
const AREA_ORDER = ["Dreamlight Valley", "Eternity Isle", "Storybook Vale", "Wishblossom Mountains"];
const STORAGE_KEY = "ddlvCritterScheduleHiddenV1";
const STORAGE_MAX_AGE_DAYS = 30;

const state = {
  todayKey: getTodayKey(),
  activeDay: getTodayKey(),
  hidden: loadHidden(),
};

const els = {
  dayTabs: document.getElementById("dayTabs"),
  daySummary: document.getElementById("daySummary"),
  areaJump: document.getElementById("areaJump"),
  scheduleScroll: document.getElementById("scheduleScroll"),
  scheduleGrid: document.getElementById("scheduleGrid"),
  hiddenCount: document.getElementById("hiddenCount"),
  openHiddenButton: document.getElementById("openHiddenButton"),
  critterModal: document.getElementById("critterModal"),
  critterModalTitle: document.getElementById("critterModalTitle"),
  critterModalBody: document.getElementById("critterModalBody"),
  hiddenModal: document.getElementById("hiddenModal"),
  hiddenModalBody: document.getElementById("hiddenModalBody"),
};

init();

function init() {
  cleanHidden();
  renderDayTabs();
  renderSchedule();
  updateHiddenButton();

  els.openHiddenButton.addEventListener("click", openHiddenModal);
  els.scheduleScroll.addEventListener("scroll", () => {
    syncScheduleOverlays();
    updateStickyCritterCards();
  });
  
  window.addEventListener("scroll", updateStickyCritterCards, { passive: true });
  window.addEventListener("resize", updateStickyCritterCards);
  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleKeydown);

  setInterval(() => {
    const nextToday = getTodayKey();
    if (nextToday !== state.todayKey) {
      state.todayKey = nextToday;
      state.activeDay = nextToday;
      cleanHidden();
      renderDayTabs();
      renderSchedule();
      updateHiddenButton();
      return;
    }
    updateCurrentTimeLine();
  }, 60 * 1000);
}

function renderDayTabs() {
  const orderedDays = orderDaysFromToday();
  els.dayTabs.innerHTML = orderedDays.map((day) => `
    <button class="day-tab${day === state.activeDay ? " active" : ""}" type="button" data-day="${day}">
      <span class="day-name">${DAY_SHORT_LABELS[day]}</span>
      ${day === state.todayKey ? `<span class="today-label">Today</span>` : ""}
    </button>
  `).join("");
}

function renderSchedule() {
  const visibleCritters = getVisibleCrittersForDay(state.activeDay);
  const groups = groupCrittersForSchedule(visibleCritters);
  const columnCount = countScheduleLanes(groups);
  const gridColumns = `var(--time-col) repeat(${Math.max(columnCount, 1)}, var(--critter-col))`;
  els.scheduleGrid.style.gridTemplateColumns = gridColumns;

  renderSummary(visibleCritters, groups);
  renderAreaJump(groups);

  let html = `<div class="time-spacer"></div>`;

  if (!visibleCritters.length) {
    els.scheduleGrid.innerHTML = `
      ${html}
      <div class="empty-state" style="grid-column: 2; grid-row: 1 / 4;">
        ✦ No remaining critters for ${DAY_LABELS[state.activeDay]}. ✦<br />
        Check Obtained Critters if you marked one by accident.
      </div>
    `;
    renderScheduleOverlays();
    updateStickyCritterCards();
    return;
  }

  let col = 2;
  html += renderHeaders(groups, col);

  col = 2;
  groups.forEach((areaGroup) => {
    areaGroup.locations.forEach((locationGroup) => {
      locationGroup.lanes.forEach((lane) => {
        html += renderLane(lane, col);
        col += 1;
      });
    });
  });

  els.scheduleGrid.innerHTML = html;
  renderScheduleOverlays();
}

function renderHeaders(groups, startCol) {
  let html = "";
  let col = startCol;

  groups.forEach((areaGroup) => {
    const span = countLanesInAreaGroup(areaGroup);
    const firstCritter = areaGroup.locations?.[0]?.lanes?.[0]?.critters?.[0];

    html += `
      <div class="area-header" id="area-${slugify(areaGroup.area)}" style="grid-column: ${col} / span ${span};">
        ${renderHeaderIcon(firstCritter?.areaIcon || areaIconPath(areaGroup.area))}
        <span class="header-label">${escapeHtml(areaGroup.area)}</span>
      </div>
    `;

    areaGroup.locations.forEach((locationGroup) => {
      const locationSpan = locationGroup.lanes.length;
      const firstLocationCritter = locationGroup.lanes?.[0]?.critters?.[0];

      html += `
        <div class="location-header" style="grid-column: ${col} / span ${locationSpan};">
          ${renderHeaderIcon(firstLocationCritter?.locationIcon || locationIconPath(locationGroup.location))}
          <span class="header-label">${escapeHtml(locationGroup.location)}</span>
        </div>
      `;

      col += locationSpan;
    });
  });

  return html;
}

function renderLane(lane, col) {
  const slotHtml = lane.critters.map((critter) => {
    const slots = parseScheduleSlots(critter.schedule[state.activeDay]);

    return slots.map((slot) => {
      const top = minutesToPercent(slot.start);
      const height = minutesToPercent(slot.end - slot.start);

      return `
        <div class="critter-slot" style="top:${top}%; height:${height}%;">
          <button class="critter-card" type="button" data-critter-id="${escapeHtml(critter.id)}">
            <img class="critter-img" src="${escapeHtml(critter.image)}" alt="${escapeHtml(critter.name)}" loading="lazy" />
            <span class="critter-name">${escapeHtml(critter.name)}</span>
            <span class="critter-meta">
              <span class="method">${escapeHtml(critter.approachMethod)}</span>
              <span class="food">${renderFoodImage(critter)}${escapeHtml(critter.favouriteFood)}</span>
            </span>
          </button>
        </div>
      `;
    }).join("");
  }).join("");

  return `<div class="column-lane" style="grid-column:${col};">${slotHtml}</div>`;
}

function updateStickyCritterCards() {
  const stickyTop = 12;

  els.scheduleGrid.querySelectorAll(".critter-slot").forEach((slot) => {
    const card = slot.querySelector(".critter-card");
    if (!card) return;

    const slotRect = slot.getBoundingClientRect();
    const cardHeight = card.offsetHeight;
    const maxY = Math.max(0, slot.offsetHeight - cardHeight);

    const rawY = stickyTop - slotRect.top;
    const y = Math.min(Math.max(rawY, 0), maxY);

    card.style.setProperty("--sticky-y", `${y}px`);
  });
}

function renderTimeLabels() {
  const labels = [];
  for (let hour = 0; hour <= 24; hour += 2) {
    labels.push(`<div class="time-label" style="top:${(hour / 24) * 100}%">${formatHour(hour)}</div>`);
  }
  return labels.join("");
}

function renderScheduleOverlays() {
  els.scheduleScroll.querySelector(".time-axis")?.remove();
  els.scheduleScroll.querySelector(".current-line")?.remove();

  els.scheduleScroll.insertAdjacentHTML(
    "afterbegin",
    `<div class="time-axis" id="timeAxis">${renderTimeLabels()}</div>`
  );

  if (state.activeDay === state.todayKey) {
    els.scheduleScroll.insertAdjacentHTML(
      "afterbegin",
      `<div class="current-line" id="currentLine"><span class="current-line-label" id="currentLineLabel"></span></div>`
    );
  }

  updateCurrentTimeLine();
  syncScheduleOverlays();
}

function renderCurrentTimeLine() {
  return "";
}

function updateCurrentTimeLine() {
  const line = document.getElementById("currentLine");
  const label = document.getElementById("currentLineLabel");
  if (!line || !label) return;

  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();

  const styles = getComputedStyle(document.documentElement);
  const hourHeight = parseFloat(styles.getPropertyValue("--hour-height")) || 40;
  const dayHeight = hourHeight * 24;

  const scheduleBottomOffset =
    parseFloat(getComputedStyle(els.scheduleScroll).paddingBottom) || 0;

  const bottom = scheduleBottomOffset + dayHeight * (1 - minutes / 1440);

  line.style.top = "";
  line.style.bottom = `${bottom}px`;

  label.textContent = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  syncScheduleOverlays();
}

function syncScheduleOverlays() {
  const scrollLeft = els.scheduleScroll.scrollLeft;
  const axis = document.getElementById("timeAxis");
  const line = document.getElementById("currentLine");
  const label = document.getElementById("currentLineLabel");

  els.scheduleScroll.style.setProperty("--schedule-width", `${els.scheduleGrid.scrollWidth}px`);

  if (axis) {
    axis.style.transform = `translateX(${scrollLeft}px)`;
  }

  if (label) {
    label.style.transform = `translate(${scrollLeft}px, -11px)`;
  }

  if (line) {
    line.style.width = `${Math.max(0, els.scheduleGrid.scrollWidth - getTimeColumnWidth())}px`;
  }
}

function getTimeColumnWidth() {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--time-col")) || 78;
}

function renderSummary(visibleCritters, groups) {
  const total = visibleCritters.length;
  const areaCount = groups.length;
  const hiddenTodayCount = getHiddenRecordsForActiveDay().length;
  els.daySummary.innerHTML = `
    <strong>${DAY_LABELS[state.activeDay]}</strong> · ${total} remaining critter${total === 1 ? "" : "s"}
    ${hiddenTodayCount ? ` · ${hiddenTodayCount} obtained` : ""}
  `;
}

function renderAreaJump(groups) {
  els.areaJump.innerHTML = groups.map((group) => {
    const areaIcon = group.critters?.[0]?.areaIcon || areaIconPath(group.area);

    return `
      <button class="area-pill" type="button" data-area-jump="${slugify(group.area)}">
        ${renderHeaderIcon(areaIcon)}
        <span class="area-pill-label">${escapeHtml(group.area)}</span>
      </button>
    `;
  }).join("");
}

function openCritterModal(critterId) {
  const critter = getCritterById(critterId);
  if (!critter) return;

  const scheduleText = critter.schedule[state.activeDay] || "n/a";
  els.critterModalTitle.textContent = critter.name;
  els.critterModalBody.innerHTML = `
    <div class="critter-detail">
      <div class="detail-image-wrap">
        <img class="detail-image" src="${escapeHtml(critter.image)}" alt="${escapeHtml(critter.name)}" />
      </div>
      <div class="detail-list">
        <div class="detail-row"><span class="detail-label">Area</span><span class="detail-value">${escapeHtml(critter.area)}</span></div>
        <div class="detail-row"><span class="detail-label">Location</span><span class="detail-value">${escapeHtml(critter.location)}</span></div>
        <div class="detail-row"><span class="detail-label">Favourite Food</span><span class="detail-value detail-food">${renderFoodImage(critter)}${escapeHtml(critter.favouriteFood)}</span></div>
        <div class="detail-row"><span class="detail-label">Approach Method</span><span class="detail-value">${escapeHtml(critter.approachMethod)}</span></div>
        <div class="detail-row"><span class="detail-label">${DAY_LABELS[state.activeDay]} Schedule</span><span class="detail-value">${escapeHtml(scheduleText)}</span></div>
      </div>
    </div>
    <div class="modal-actions">
      <button class="primary-button" type="button" data-hide-critter="${escapeHtml(critter.id)}">✓ Mark as collected for today</button>
      <button class="ghost-button" type="button" data-close-modal>Cancel</button>
    </div>
  `;
  openModal(els.critterModal);
}

function openHiddenModal() {
  const records = getHiddenRecords();
  if (!records.length) {
    els.hiddenModalBody.innerHTML = `<p class="empty-state">No obtained critters yet.</p>`;
  } else {
    els.hiddenModalBody.innerHTML = `
      <div class="hidden-list">
        ${records.map((record) => renderHiddenRow(record)).join("")}
      </div>
    `;
  }
  openModal(els.hiddenModal);
}

function renderHiddenRow(record) {
  const critter = getCritterById(record.critterId);
  if (!critter) return "";
  const dateLabel = record.date === todayDateKey() ? "Today" : record.date;
  return `
    <div class="hidden-row">
      <img src="${escapeHtml(critter.image)}" alt="${escapeHtml(critter.name)}" loading="lazy" />
      <div>
        <div class="hidden-name">${escapeHtml(critter.name)}</div>
        <div class="hidden-meta">${escapeHtml(dateLabel)} · ${escapeHtml(critter.location)} · ${escapeHtml(critter.favouriteFood)} · ${escapeHtml(critter.approachMethod)}</div>
      </div>
      <button class="ghost-button" type="button" data-unhide-record="${escapeHtml(record.key)}">Unhide</button>
    </div>
  `;
}

function handleDocumentClick(event) {
  const dayButton = event.target.closest("[data-day]");
  if (dayButton) {
    state.activeDay = dayButton.dataset.day;
    renderDayTabs();
    renderSchedule();
    return;
  }

  const critterButton = event.target.closest("[data-critter-id]");
  if (critterButton) {
    openCritterModal(critterButton.dataset.critterId);
    return;
  }

  const hideButton = event.target.closest("[data-hide-critter]");
  if (hideButton) {
    hideCritter(hideButton.dataset.hideCritter);
    closeAllModals();
    renderSchedule();
    updateHiddenButton();
    return;
  }

  const unhideButton = event.target.closest("[data-unhide-record]");
  if (unhideButton) {
    unhideRecord(unhideButton.dataset.unhideRecord);
    openHiddenModal();
    renderSchedule();
    updateHiddenButton();
    return;
  }

  const areaJump = event.target.closest("[data-area-jump]");
  if (areaJump) {
    document.getElementById(`area-${areaJump.dataset.areaJump}`)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    return;
  }

  if (event.target.matches("[data-close-modal]") || event.target.classList.contains("modal-backdrop")) {
    closeAllModals();
  }
}

function handleKeydown(event) {
  if (event.key === "Escape") closeAllModals();
}

function hideCritter(critterId) {
  const key = hiddenKey(critterId, todayDateKey());
  state.hidden[key] = {
    key,
    critterId,
    date: todayDateKey(),
    hiddenAt: new Date().toISOString(),
  };
  saveHidden();
}

function unhideRecord(key) {
  delete state.hidden[key];
  saveHidden();
}

function updateHiddenButton() {
  els.hiddenCount.textContent = getHiddenRecords().length;
}

function getVisibleCrittersForDay(day) {
  return (window.DDLV_CRITTERS || [])
    .filter((critter) => isAvailable(critter, day))
    .filter((critter) => !isHiddenForActiveDate(critter.id))
    .sort(sortCritters);
}

function groupCrittersForSchedule(critters) {
  const groupsByArea = new Map();

  critters.forEach((critter) => {
    if (!groupsByArea.has(critter.area)) groupsByArea.set(critter.area, new Map());

    const locations = groupsByArea.get(critter.area);
    if (!locations.has(critter.location)) locations.set(critter.location, []);

    locations.get(critter.location).push(critter);
  });

  return Array.from(groupsByArea.entries())
    .sort(([areaA], [areaB]) => areaSortValue(areaA) - areaSortValue(areaB) || areaA.localeCompare(areaB))
    .map(([area, locations]) => ({
      area,
      locations: Array.from(locations.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([location, locationCritters]) => {
          const sortedCritters = locationCritters.sort(sortCrittersInLocation);

          return {
            location,
            critters: sortedCritters,
            lanes: packCrittersIntoLanes(sortedCritters),
          };
        }),
    }))
    .filter((group) => countCrittersInAreaGroup(group) > 0);
}

function packCrittersIntoLanes(critters) {
  const lanes = [];

  critters.forEach((critter) => {
    const critterSlots = getCritterComparableSlots(critter);

    let matchingLane = lanes.find((lane) => {
      return lane.slots.every((existingSlot) => {
        return critterSlots.every((newSlot) => !scheduleSlotsOverlap(existingSlot, newSlot));
      });
    });

    if (!matchingLane) {
      matchingLane = {
        critters: [],
        slots: [],
      };
      lanes.push(matchingLane);
    }

    matchingLane.critters.push(critter);
    matchingLane.slots.push(...critterSlots);
    matchingLane.slots.sort((a, b) => a.start - b.start || a.end - b.end);
  });

  return lanes;
}

function getCritterComparableSlots(critter) {
  return parseScheduleSlots(critter.schedule?.[state.activeDay]).map((slot) => ({
    start: slot.start,
    end: slot.end,
  }));
}

function scheduleSlotsOverlap(a, b) {
  return a.start < b.end && b.start < a.end;
}

function countScheduleLanes(groups) {
  return groups.reduce((total, areaGroup) => total + countLanesInAreaGroup(areaGroup), 0);
}

function countLanesInAreaGroup(areaGroup) {
  return areaGroup.locations.reduce((total, locationGroup) => total + locationGroup.lanes.length, 0);
}

function sortCritters(a, b) {
  return areaSortValue(a.area) - areaSortValue(b.area)
    || a.location.localeCompare(b.location)
    || firstStartMinute(a, state.activeDay) - firstStartMinute(b, state.activeDay)
    || a.name.localeCompare(b.name);
}

function sortCrittersInLocation(a, b) {
  return firstStartMinute(a, state.activeDay) - firstStartMinute(b, state.activeDay) || a.name.localeCompare(b.name);
}

function countCrittersInAreaGroup(group) {
  return group.locations.reduce((total, locationGroup) => total + locationGroup.critters.length, 0);
}

function isAvailable(critter, day) {
  return parseScheduleSlots(critter.schedule?.[day]).length > 0;
}

function firstStartMinute(critter, day) {
  const slots = parseScheduleSlots(critter.schedule?.[day]);
  return slots[0]?.start ?? 99999;
}

function parseScheduleSlots(value) {
  if (!value || String(value).toLowerCase().includes("n/a")) return [];
  const clean = String(value).replace(/\[[^\]]*\]/g, "").trim();
  if (/^all day$/i.test(clean)) return [{ start: 0, end: 1440 }];

  return clean.split(/\s+and\s+/i).map((part) => parseSchedulePart(part.trim())).filter(Boolean);
}

function parseSchedulePart(part) {
  const compactMatch = part.match(/^(\d{1,2})\s*-\s*(\d{1,2})\s*(AM|PM)$/i);

  if (compactMatch) {
    const period = compactMatch[3].toUpperCase();

    let start = toMinutes(`${compactMatch[1]} ${period}`);
    let end = toMinutes(`${compactMatch[2]} ${period}`);

    if (end <= start) {
      end += 720;
    }

    return { start, end };
  }

  const match = part.match(
    /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\s+to\s+(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i
  );

  if (!match) return null;

  let start = toMinutes(
    `${match[1]}:${match[2] || "00"} ${match[3]}`
  );

  let end = toMinutes(
    `${match[4]}:${match[5] || "00"} ${match[6]}`
  );

  if (
    match[4] === "12" &&
    match[6].toUpperCase() === "AM"
  ) {
    end = 1440;
  }

  return { start, end };
}

function toMinutes(timeText) {
  const match = String(timeText).match(
    /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i
  );

  if (!match) return 0;

  let hour = Number(match[1]);
  const minute = Number(match[2] || 0);
  const period = match[3].toUpperCase();

  if (period === "AM" && hour === 12) hour = 0;
  if (period === "PM" && hour !== 12) hour += 12;

  return (hour * 60) + minute;
}

function minutesToPercent(minutes) {
  return (minutes / 1440) * 100;
}

function formatHour(hour) {
  if (hour === 0 || hour === 24) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}




function renderFoodImage(critter) {
  if (!critter?.favouriteFoodImage) return "";
  return `<img class="food-img" src="${escapeHtml(critter.favouriteFoodImage)}" alt="" loading="lazy" onerror="this.style.display='none';" />`;
}

function getScheduleAssetFilename(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .toLowerCase();
}

function areaIconPath(areaName) {
  return `assets/areas/${getScheduleAssetFilename(areaName)}.png`;
}

function locationIconPath(locationName) {
  return `assets/locations/${getScheduleAssetFilename(locationName)}.png`;
}

function renderHeaderIcon(iconName) {
  if (iconName && /\.(png|jpe?g|webp|gif|svg)$/i.test(iconName)) {
    return `<span class="header-icon image-icon"><img src="${escapeHtml(iconName)}" alt="" loading="lazy" onerror="this.closest('.header-icon').style.display='none';" /></span>`;
  }

  const icons = {
    sparkle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l1.7 5.7L19 10l-5.3 2.3L12 18l-1.7-5.7L5 10l5.3-2.3L12 2zm6.5 12l.8 2.7L22 18l-2.7 1.3-.8 2.7-.8-2.7L15 18l2.7-1.3.8-2.7zM5.5 14l.7 2.2 2.3.8-2.3.8-.7 2.2-.7-2.2-2.3-.8 2.3-.8.7-2.2z"/></svg>',
    tree: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c3 2.4 5 5.1 5 7.2 0 1.5-.8 2.7-2 3.4 2.1.8 3.5 2.4 3.5 4.1 0 2.2-2.4 4-5.5 4.3V24h-2v-3c-3.1-.3-5.5-2.1-5.5-4.3 0-1.7 1.4-3.3 3.5-4.1-1.2-.7-2-1.9-2-3.4C7 7.1 9 4.4 12 2z"/></svg>',
    island: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3c2.5.2 4.6 1.4 6.3 3.6-2.4-.6-4.4-.5-6 .5 2.6.3 4.7 1.5 6.3 3.7-2.8-.7-5-.4-6.8.9-.5 2.4-1.5 5-3 7.7h8.5L22 22H2l3.8-2.6h2.1c1.8-3.2 2.9-6.4 3.4-9.5-1.8-.6-3.8-.3-6 .9C6.4 8.4 8.3 6.9 11 6.4 9.7 5.2 8 4.5 5.8 4.2 8.3 3 10.7 2.6 13 3z"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4.5C6.7 4 9 4.5 11 6v14c-2-1.3-4.3-1.8-7-1.3V4.5zm9 1.5c2-1.5 4.3-2 7-1.5v14.2c-2.7-.5-5-.1-7 1.3V6zm-1 15.5c-2.4-1.7-5.2-2.3-8.5-1.7V21c3.4-.6 6.2 0 8.5 2 2.3-2 5.1-2.6 8.5-2v-1.2c-3.3-.6-6.1 0-8.5 1.7z"/></svg>',
    flower: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.2C13.2 5.1 15.1 3.8 17 5c1.7 1.1 1.6 3.1-.4 5.1 3.2-.4 5.2.6 5.4 2.6.2 2-1.5 3.1-4.4 2.9 2.1 2.3 2.4 4.4.8 5.6-1.7 1.2-3.5.1-4.8-2.7-1.3 2.8-3.1 3.9-4.8 2.7-1.6-1.2-1.3-3.3.8-5.6-2.9.2-4.6-.9-4.4-2.9.2-2 2.2-3 5.4-2.6C5.6 8.1 5.5 6.1 7.2 5c1.9-1.2 3.8.1 4.8 3.2zM12 11a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"/></svg>',
    wave: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 15c3-3.4 6-3.4 9 0 2 2.2 4 2.2 6 0 1.5-1.7 3.2-2.6 5-2.6v2.3c-1.1 0-2.1.6-3.1 1.8-2.8 3.1-5.6 3.1-8.4 0-2.2-2.4-4.3-2.4-6.5 0L2 15zm0 4c3-3.4 6-3.4 9 0 2 2.2 4 2.2 6 0 1.5-1.7 3.2-2.6 5-2.6v2.3c-1.1 0-2.1.6-3.1 1.8-2.8 3.1-5.6 3.1-8.4 0-2.2-2.4-4.3-2.4-6.5 0L2 19z"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3c-7.6.5-13 3-16.2 7.5-2.5 3.5-2.3 7 .4 9.5 3.4-6.2 7.8-10 13.1-11.5-4.9 2.8-8.6 6.9-11 12.2 3.5 1.3 7.2-.3 9.8-4.2C19.7 12.5 21 8 21 3z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5a7 7 0 100 14 7 7 0 000-14zm0-4l1.2 3h-2.4L12 1zm0 22l-1.2-3h2.4L12 23zM1 12l3-1.2v2.4L1 12zm22 0l-3 1.2v-2.4l3 1.2zM4.2 4.2l3 1.3-1.7 1.7-1.3-3zm15.6 15.6l-3-1.3 1.7-1.7 1.3 3zm0-15.6l-1.3 3-1.7-1.7 3-1.3zM4.2 19.8l1.3-3 1.7 1.7-3 1.3z"/></svg>',
    snow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 2h2v6.1l4.3-4.3 1.4 1.4L14.4 9.5H21v2h-6.6l4.3 4.3-1.4 1.4L13 12.9V21h-2v-8.1l-4.3 4.3-1.4-1.4 4.3-4.3H3v-2h6.6L5.3 5.2l1.4-1.4L11 8.1V2z"/></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.6 2.8A8.8 8.8 0 1021.2 14 7 7 0 1115.6 2.8z"/></svg>',
    anchor: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a3 3 0 110 6 3 3 0 010-6zm-1 7h2v3h4v2h-4v5.6c2.2-.4 4-1.9 4.8-4.1l-2.3.8-.7-1.9 5.2-1.9 1.8 5.2-1.9.7-.7-2c-1.3 3.2-4.2 5.3-7.2 5.3s-5.9-2.1-7.2-5.3l-.7 2-1.9-.7 1.8-5.2 5.2 1.9-.7 1.9-2.3-.8c.8 2.2 2.6 3.7 4.8 4.1V14H7v-2h4V9z"/></svg>',
    mountain: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 20L9 5l4 7 2-3 7 11H2zm7.2-10.5L5.4 18h8.1l-2.1-3.7-1.2 1.4-1.6-1.2 1.8-2.1-1.2-2.9z"/></svg>',
    water: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c4 4.7 6 8.4 6 11.2a6 6 0 11-12 0C6 10.4 8 6.7 12 2zm-3.5 11.6a3.5 3.5 0 005.9 2.6c-2.4.3-4.2-.8-5.4-3.3-.3.2-.5.4-.5.7z"/></svg>',
    meadow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20h18v2H3v-2zm2-2c.7-3.7 2.2-6.5 4.5-8.4-.4 2.7-.1 5.5.8 8.4H5zm7 0c.4-4.5 1.9-8.5 4.4-12-.2 4.1.6 8.1 2.4 12H12z"/></svg>',
    arch: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V10a8 8 0 1116 0v11h-5v-9a3 3 0 10-6 0v9H4zm2-2h1v-7a5 5 0 0110 0v7h1v-9a6 6 0 00-12 0v9z"/></svg>',
    ruins: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v3H4V5zm1 5h3v9h2v-9h4v9h2v-9h3v9h2v2H3v-2h2v-9z"/></svg>',
    desert: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18c3-2 6-2 9 0 2.3 1.5 4.7 1.5 7 0v3H4v-3zm3-3V8a3 3 0 116 0v2h2a2 2 0 100-4V4a4 4 0 110 8h-2v3h-2V8a1 1 0 10-2 0v7H7z"/></svg>',
    castle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V8l2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2v13h-5v-5a3 3 0 00-6 0v5H4zm3-9h3v3H7v-3zm7 0h3v3h-3v-3z"/></svg>',
    statue: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2h4l1 4-2 2v6h3l2 7H6l2-7h3V8L9 6l1-4z"/></svg>',
  };

  return `<span class="header-icon">${icons[iconName] || icons[DEFAULT_ICON]}</span>`;
}

function cssEscape(value) {
  if (window.CSS?.escape) return CSS.escape(value);
  return String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
}

function getCritterById(id) {
  return (window.DDLV_CRITTERS || []).find((critter) => critter.id === id);
}

function getTodayKey() {
  return DAYS[new Date().getDay()];
}

function orderDaysFromToday() {
  const todayIndex = DAYS.indexOf(state.todayKey);
  return [...DAYS.slice(todayIndex), ...DAYS.slice(0, todayIndex)];
}


function todayDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
}

function hiddenKey(critterId, date) {
  return `${date}::${critterId}`;
}

function isHiddenForActiveDate(critterId) {
  return Boolean(state.hidden[hiddenKey(critterId, todayDateKey())]);
}

function getHiddenRecords() {
  return Object.values(state.hidden).sort((a, b) => b.hiddenAt.localeCompare(a.hiddenAt));
}

function getHiddenRecordsForActiveDay() {
  return getHiddenRecords().filter((record) => record.date === todayDateKey());
}

function loadHidden() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

function saveHidden() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.hidden));
}

function cleanHidden() {
  const now = Date.now();
  const maxAge = STORAGE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  let changed = false;

  Object.entries(state.hidden).forEach(([key, record]) => {
    const hiddenAt = Date.parse(record.hiddenAt || "");
    if (!hiddenAt || now - hiddenAt > maxAge) {
      delete state.hidden[key];
      changed = true;
    }
  });

  if (changed) saveHidden();
}

function openModal(modal) {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeAllModals() {
  [els.critterModal, els.hiddenModal].forEach((modal) => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });
}

function areaSortValue(area) {
  const index = AREA_ORDER.indexOf(area);
  return index === -1 ? 999 : index;
}

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
