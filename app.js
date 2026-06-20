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
      <button class="primary-button" type="button" data-hide-critter="${escapeHtml(critter.id)}">✓ Mark as obtained</button>
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
  const critter = getCritterById(critterId);
  if (!critter) return;

  state.hidden[critter.id] = {
    key: critter.id,
    critterId: critter.id,
    obtainedAt: state.hidden[critter.id]?.obtainedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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

function hiddenKey(critterId) {
  return critterId;
}

function isHiddenForActiveDate(critterId) {
  return Boolean(state.hidden[critterId]);
}

function getHiddenRecords() {
  return Object.values(state.hidden)
    .filter((record) => getCritterById(record.critterId))
    .sort((a, b) => {
      const aDate = a.updatedAt || a.obtainedAt || "";
      const bDate = b.updatedAt || b.obtainedAt || "";
      return bDate.localeCompare(aDate);
    });
}

function getHiddenRecordsForActiveDay() {
  return getHiddenRecords();
}

function loadHidden() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    const now = Date.now();
    const maxAge = STORAGE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

    if (parsed?.lastLoadedAt) {
      const lastLoadedAt = Date.parse(parsed.lastLoadedAt);
      if (!lastLoadedAt || now - lastLoadedAt > maxAge) return {};
      return normaliseHiddenRecords(parsed.records || {});
    }

    return normaliseHiddenRecords(parsed || {});
  } catch (error) {
    return {};
  }
}

function saveHidden() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 2,
      lastLoadedAt: new Date().toISOString(),
      records: state.hidden,
    })
  );
}

function cleanHidden() {
  const cleaned = normaliseHiddenRecords(state.hidden);
  const changed = JSON.stringify(cleaned) !== JSON.stringify(state.hidden);

  state.hidden = cleaned;
  saveHidden();

  return changed;
}

function normaliseHiddenRecords(records) {
  const cleaned = {};

  Object.entries(records || {}).forEach(([key, record]) => {
    if (!record || typeof record !== "object") return;

    const critterId = record.critterId || String(key).split("::").pop();
    if (!critterId || !getCritterById(critterId)) return;

    cleaned[critterId] = {
      key: critterId,
      critterId,
      obtainedAt: record.obtainedAt || record.hiddenAt || new Date().toISOString(),
      updatedAt: record.updatedAt || record.hiddenAt || record.obtainedAt || new Date().toISOString(),
    };
  });

  return cleaned;
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
