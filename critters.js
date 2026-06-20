/*
  Edit this file directly to update critter data.

  schedule keys: sunday, monday, tuesday, wednesday, thursday, friday, saturday
  schedule values:
    "n/a"
    "All day"
    "12 AM to 12 PM"
    "12 PM to 12 AM"
    "7-8 AM and 7-8 PM"

  area controls the large group header.
  location controls the location header.
*/

const ASSET_BASE = "assets/";
const assetFile = (fileName) => String(fileName || "").trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "").toLowerCase();
const critterImg = (fileName) => `${ASSET_BASE}critters/${assetFile(fileName)}`;
const foodImg = (foodName) => `${ASSET_BASE}foods/${assetFile(getFoodImageFile(foodName))}`;
const areaIcon = (areaName) => `${ASSET_BASE}areas/${assetFile(areaName)}.png`;
const locationIcon = (locationName) => `${ASSET_BASE}locations/${assetFile(locationName)}.png`;
const all = "All day";
const na = "n/a";
const am = "12 AM to 12 PM";
const pm = "12 PM to 12 AM";

window.DDLV_CRITTERS = [
  // Dreamlight Valley
  c("black-squirrel", "Black Squirrel", "Black Squirrel.png", "Dreamlight Valley", "Plaza", "Peanut", "Approach", { sunday: am, monday: na, tuesday: all, wednesday: na, thursday: all, friday: all, saturday: na }),
  c("classic-squirrel", "Classic Squirrel", "Classic Squirrel.png", "Dreamlight Valley", "Plaza", "Peanut", "Approach", { sunday: pm, monday: all, tuesday: na, wednesday: na, thursday: all, friday: na, saturday: all }),
  c("gray-squirrel", "Gray Squirrel", "Gray Squirrel.png", "Dreamlight Valley", "Plaza", "Peanut", "Approach", { sunday: pm, monday: na, tuesday: all, wednesday: all, thursday: na, friday: na, saturday: all }),
  c("red-squirrel", "Red Squirrel", "Red Squirrel.png", "Dreamlight Valley", "Plaza", "Peanut", "Approach", { sunday: am, monday: all, tuesday: na, wednesday: all, thursday: na, friday: all, saturday: na }),
  c("white-squirrel", "White Squirrel", "White Squirrel.png", "Dreamlight Valley", "Plaza", "Peanut", "Approach", { sunday: all, monday: na, tuesday: na, wednesday: na, thursday: na, friday: na, saturday: na }),

  c("black-rabbit", "Black Rabbit", "Black Rabbit.png", "Dreamlight Valley", "Peaceful Meadow", "Carrot", "Tag", { sunday: am, monday: all, tuesday: na, wednesday: all, thursday: na, friday: all, saturday: na }),
  c("brown-rabbit", "Brown Rabbit", "Brown Rabbit.png", "Dreamlight Valley", "Peaceful Meadow", "Carrot", "Tag", { sunday: pm, monday: na, tuesday: all, wednesday: all, thursday: na, friday: na, saturday: all }),
  c("calico-rabbit", "Calico Rabbit", "Calico Rabbit.png", "Dreamlight Valley", "Peaceful Meadow", "Carrot", "Tag", { sunday: na, monday: na, tuesday: na, wednesday: na, thursday: all, friday: na, saturday: na }),
  c("classic-rabbit", "Classic Rabbit", "Classic Rabbit.png", "Dreamlight Valley", "Peaceful Meadow", "Carrot", "Tag", { sunday: pm, monday: all, tuesday: na, wednesday: na, thursday: all, friday: na, saturday: all }),
  c("white-rabbit", "White Rabbit", "White Rabbit.png", "Dreamlight Valley", "Peaceful Meadow", "Carrot", "Tag", { sunday: am, monday: na, tuesday: all, wednesday: na, thursday: all, friday: all, saturday: na }),

  c("black-sea-turtle", "Black Sea Turtle", "Black Sea Turtle.png", "Dreamlight Valley", "Dazzle Beach", "Seaweed", "Patience", { sunday: na, monday: all, tuesday: na, wednesday: na, thursday: na, friday: na, saturday: na }),
  c("brown-sea-turtle", "Brown Sea Turtle", "Brown Sea Turtle.png", "Dreamlight Valley", "Dazzle Beach", "Seaweed", "Patience", { sunday: am, monday: all, tuesday: na, wednesday: all, thursday: na, friday: all, saturday: na }),
  c("classic-sea-turtle", "Classic Sea Turtle", "Classic Sea Turtle.png", "Dreamlight Valley", "Dazzle Beach", "Seaweed", "Patience", { sunday: pm, monday: all, tuesday: na, wednesday: na, thursday: all, friday: na, saturday: all }),
  c("purple-sea-turtle", "Purple Sea Turtle", "Purple Sea Turtle.png", "Dreamlight Valley", "Dazzle Beach", "Seaweed", "Patience", { sunday: am, monday: na, tuesday: all, wednesday: na, thursday: all, friday: all, saturday: na }),
  c("white-sea-turtle", "White Sea Turtle", "White Sea Turtle.png", "Dreamlight Valley", "Dazzle Beach", "Seaweed", "Patience", { sunday: pm, monday: na, tuesday: all, wednesday: all, thursday: na, friday: na, saturday: all }),

  c("black-raccoon", "Black Raccoon", "Black Raccoon.png", "Dreamlight Valley", "Forest of Valor", "Blueberry", "RLGL", { sunday: pm, monday: na, tuesday: all, wednesday: all, thursday: na, friday: na, saturday: all }),
  c("blue-raccoon", "Blue Raccoon", "Blue Raccoon.png", "Dreamlight Valley", "Forest of Valor", "Blueberry", "RLGL", { sunday: na, monday: na, tuesday: na, wednesday: all, thursday: na, friday: na, saturday: na }),
  c("classic-raccoon", "Classic Raccoon", "Classic Raccoon.png", "Dreamlight Valley", "Forest of Valor", "Blueberry", "RLGL", { sunday: pm, monday: all, tuesday: na, wednesday: na, thursday: all, friday: na, saturday: all }),
  c("red-raccoon", "Red Raccoon", "Red Raccoon.png", "Dreamlight Valley", "Forest of Valor", "Blueberry", "RLGL", { sunday: am, monday: all, tuesday: na, wednesday: all, thursday: na, friday: all, saturday: na }),
  c("white-raccoon", "White Raccoon", "White Raccoon.png", "Dreamlight Valley", "Forest of Valor", "Blueberry", "RLGL", { sunday: am, monday: na, tuesday: all, wednesday: na, thursday: all, friday: all, saturday: na }),

  c("blue-crocodile", "Blue Crocodile", "Blue Crocodile.png", "Dreamlight Valley", "Glade of Trust", "Lobster", "RLGL", { sunday: am, monday: all, tuesday: na, wednesday: all, thursday: na, friday: all, saturday: na }),
  c("classic-crocodile", "Classic Crocodile", "Classic Crocodile.png", "Dreamlight Valley", "Glade of Trust", "Lobster", "RLGL", { sunday: pm, monday: all, tuesday: na, wednesday: na, thursday: all, friday: na, saturday: all }),
  c("golden-crocodile", "Golden Crocodile", "Golden Crocodile.png", "Dreamlight Valley", "Glade of Trust", "Lobster", "RLGL", { sunday: am, monday: na, tuesday: all, wednesday: na, thursday: all, friday: all, saturday: na }),
  c("pink-crocodile", "Pink Crocodile", "Pink Crocodile.png", "Dreamlight Valley", "Glade of Trust", "Lobster", "RLGL", { sunday: na, monday: na, tuesday: na, wednesday: na, thursday: na, friday: na, saturday: all }),
  c("red-crocodile", "Red Crocodile", "Red Crocodile.png", "Dreamlight Valley", "Glade of Trust", "Lobster", "RLGL", { sunday: pm, monday: na, tuesday: all, wednesday: all, thursday: na, friday: na, saturday: all }),
  c("white-crocodile", "White Crocodile", "White Crocodile.png", "Dreamlight Valley", "Glade of Trust", "Lobster", "RLGL", { sunday: all, monday: na, tuesday: na, wednesday: na, thursday: na, friday: na, saturday: na }),

  c("emerald-sunbird", "Emerald Sunbird", "Emerald Sunbird.png", "Dreamlight Valley", "Sunlit Plateau", "Green and Yellow Flowers", "Approach", { sunday: pm, monday: na, tuesday: all, wednesday: all, thursday: na, friday: na, saturday: all }),
  c("golden-sunbird", "Golden Sunbird", "Golden Sunbird.png", "Dreamlight Valley", "Sunlit Plateau", "Orange and Yellow Flowers", "Approach", { sunday: am, monday: na, tuesday: all, wednesday: na, thursday: all, friday: all, saturday: na }),
  c("orchid-sunbird", "Orchid Sunbird", "Orchid Sunbird.png", "Dreamlight Valley", "Sunlit Plateau", "Pink and Purple Flowers", "Approach", { sunday: na, monday: na, tuesday: na, wednesday: na, thursday: na, friday: all, saturday: na }),
  c("red-sunbird", "Red Sunbird", "Red Sunbird.png", "Dreamlight Valley", "Sunlit Plateau", "Blue and Red Flowers", "Approach", { sunday: pm, monday: all, tuesday: na, wednesday: na, thursday: all, friday: na, saturday: all }),
  c("turquoise-sunbird", "Turquoise Sunbird", "Turquoise Sunbird.png", "Dreamlight Valley", "Sunlit Plateau", "Green and Pink Flowers", "Approach", { sunday: am, monday: all, tuesday: na, wednesday: all, thursday: na, friday: all, saturday: na }),

  c("black-fox", "Black Fox", "Black Fox.png", "Dreamlight Valley", "Frosted Heights", "White Sturgeon", "Tag", { sunday: pm, monday: na, tuesday: all, wednesday: all, thursday: na, friday: na, saturday: all }),
  c("blue-fox", "Blue Fox", "Blue Fox.png", "Dreamlight Valley", "Frosted Heights", "White Sturgeon", "Tag", { sunday: am, monday: na, tuesday: all, wednesday: na, thursday: all, friday: all, saturday: na }),
  c("classic-fox", "Classic Fox", "Classic Fox.png", "Dreamlight Valley", "Frosted Heights", "White Sturgeon", "Tag", { sunday: am, monday: all, tuesday: na, wednesday: all, thursday: na, friday: all, saturday: na }),
  c("red-fox", "Red Fox", "Red Fox.png", "Dreamlight Valley", "Frosted Heights", "White Sturgeon", "Tag", { sunday: na, monday: na, tuesday: na, wednesday: na, thursday: na, friday: na, saturday: all }),
  c("white-fox", "White Fox", "White Fox.png", "Dreamlight Valley", "Frosted Heights", "White Sturgeon", "Tag", { sunday: pm, monday: all, tuesday: na, wednesday: na, thursday: all, friday: na, saturday: all }),

  c("blue-raven", "Blue Raven", "Blue Raven.png", "Dreamlight Valley", "Forgotten Lands", "5-Star Meal", "Patience", { sunday: am, monday: na, tuesday: all, wednesday: na, thursday: all, friday: all, saturday: na }),
  c("brown-raven", "Brown Raven", "Brown Raven.png", "Dreamlight Valley", "Forgotten Lands", "5-Star Meal", "Patience", { sunday: na, monday: na, tuesday: all, wednesday: na, thursday: na, friday: na, saturday: na }),
  c("classic-raven", "Classic Raven", "Classic Raven.png", "Dreamlight Valley", "Forgotten Lands", "5-Star Meal", "Patience", { sunday: pm, monday: all, tuesday: na, wednesday: na, thursday: all, friday: na, saturday: all }),
  c("red-raven", "Red Raven", "Red Raven.png", "Dreamlight Valley", "Forgotten Lands", "5-Star Meal", "Patience", { sunday: am, monday: all, tuesday: na, wednesday: all, thursday: na, friday: all, saturday: na }),
  c("white-raven", "White Raven", "White Raven.png", "Dreamlight Valley", "Forgotten Lands", "5-Star Meal", "Patience", { sunday: pm, monday: na, tuesday: all, wednesday: all, thursday: na, friday: na, saturday: all }),

  // Eternity Isle
  c("classic-capybara", "Classic Capybara", "Classic Capybara.png", "Eternity Isle", "The Grasslands", "Cabbage", "Approach", { sunday: all, monday: all, tuesday: all, wednesday: all, thursday: all, friday: all, saturday: all }),
  c("blue-striped-capybara", "Blue Striped Capybara", "Blue Striped Capybara.png", "Eternity Isle", "The Grove", "Cabbage", "Approach", { sunday: na, monday: am, tuesday: am, wednesday: am, thursday: all, friday: na, saturday: all }),
  c("toon-capybara", "Toon Capybara", "Toon Capybara.png", "Eternity Isle", "The Grove", "Cabbage", "Approach", { sunday: all, monday: all, tuesday: all, wednesday: all, thursday: all, friday: all, saturday: all }),
  c("gray-spotted-capybara", "Gray Spotted Capybara", "Gray Spotted Capybara.png", "Eternity Isle", "The Lagoon", "Cabbage", "Approach", { sunday: all, monday: pm, tuesday: pm, wednesday: pm, thursday: na, friday: all, saturday: na }),
  c("red-white-capybara", "Red and White Striped Capybara", "Red and White Striped Capybara.png", "Eternity Isle", "The Lagoon", "Cabbage", "Approach", { sunday: na, monday: na, tuesday: na, wednesday: na, thursday: na, friday: na, saturday: all }),
  c("black-white-capybara", "Black and White Capybara", "Black and White Capybara.png", "Eternity Isle", "The Promenade", "Cabbage", "Approach", { sunday: pm, monday: na, tuesday: all, wednesday: na, thursday: all, friday: pm, saturday: pm }),

  c("classic-cobra", "Classic Cobra", "Classic Cobra.png", "Eternity Isle", "The Plains", "Egg", "RLGL", { sunday: all, monday: all, tuesday: all, wednesday: all, thursday: all, friday: all, saturday: all }),
  c("pink-spotted-cobra", "Pink Spotted Cobra", "Pink Spotted Cobra.png", "Eternity Isle", "The Oasis", "Egg", "RLGL", { sunday: am, monday: all, tuesday: na, wednesday: am, thursday: am, friday: all, saturday: na }),
  c("green-white-cobra", "Green and White Striped Cobra", "Green and White Striped Cobra.png", "Eternity Isle", "The Borderlands", "Egg", "RLGL", { sunday: na, monday: na, tuesday: na, wednesday: na, thursday: all, friday: na, saturday: na }),
  c("yellow-purple-cobra", "Yellow and Purple Striped Cobra", "Yellow and Purple Striped Cobra.png", "Eternity Isle", "The Borderlands", "Egg", "RLGL", { sunday: pm, monday: na, tuesday: all, wednesday: pm, thursday: pm, friday: na, saturday: all }),
  c("blue-red-cobra", "Blue and Red Striped Cobra", "Blue and Red Striped Cobra.png", "Eternity Isle", "The Wastes", "Egg", "RLGL", { sunday: all, monday: pm, tuesday: pm, wednesday: na, thursday: all, friday: na, saturday: pm }),
  c("toon-cobra", "Toon Cobra", "Toon Cobra.png", "Eternity Isle", "The Wastes", "Egg", "RLGL", { sunday: all, monday: all, tuesday: all, wednesday: all, thursday: all, friday: all, saturday: all }),

  c("classic-monkey", "Classic Monkey", "Classic Monkey.png", "Eternity Isle", "The Docks", "5-Star Dessert", "Tag", { sunday: all, monday: all, tuesday: all, wednesday: all, thursday: all, friday: all, saturday: all }),
  c("toon-monkey", "Toon Monkey", "Toon Monkey.png", "Eternity Isle", "The Docks", "5-Star Dessert", "Tag", { sunday: all, monday: all, tuesday: all, wednesday: all, thursday: all, friday: all, saturday: all }),
  c("black-brown-monkey", "Black and Brown Monkey", "Black and Brown Monkey.png", "Eternity Isle", "The Courtyard", "5-Star Dessert", "Tag", { sunday: pm, monday: na, tuesday: pm, wednesday: all, thursday: pm, friday: na, saturday: all }),
  c("beige-monkey", "Beige Monkey", "Beige Monkey.png", "Eternity Isle", "The Ruins", "5-Star Dessert", "Tag", { sunday: all, monday: pm, tuesday: na, wednesday: pm, thursday: all, friday: pm, saturday: na }),
  c("black-gray-monkey", "Black and Gray Monkey", "Black and Gray Monkey.png", "Eternity Isle", "The Ruins", "5-Star Dessert", "Tag", { sunday: na, monday: na, tuesday: all, wednesday: na, thursday: na, friday: na, saturday: na }),
  c("red-beige-monkey", "Red and Beige Monkey", "Red and Beige Monkey.png", "Eternity Isle", "The Overlook", "5-Star Dessert", "Tag", { sunday: na, monday: am, tuesday: all, wednesday: am, thursday: na, friday: am, saturday: all }),

  // Storybook Vale
  c("brown-owl", "Brown Owl", "Brown Owl.png", "Storybook Vale", "The Library of Lore", "Barley", "Approach", { sunday: na, monday: all, tuesday: all, wednesday: all, thursday: all, friday: all, saturday: na }),
  c("dark-owl", "Dark Owl", "Dark Owl.png", "Storybook Vale", "The Library of Lore", "Barley", "Approach", { sunday: all, monday: na, tuesday: na, wednesday: na, thursday: na, friday: na, saturday: all }),
  c("white-owl", "White Owl", "White Owl.png", "Storybook Vale", "The Bind", "Barley", "Approach", { sunday: "3 PM to 8 PM", monday: "3 PM to 8 PM", tuesday: "3 PM to 8 PM", wednesday: "3 PM to 8 PM", thursday: "3 PM to 8 PM", friday: "3 PM to 8 PM", saturday: "3 PM to 8 PM" }),
  c("purple-owl", "Purple Owl", "Purple Owl.png", "Storybook Vale", "The Bind", "Barley", "Approach", { sunday: "12 AM to 9 AM", monday: "12 AM to 9 AM", tuesday: "12 AM to 9 AM", wednesday: "12 AM to 9 AM", thursday: "12 AM to 9 AM", friday: "12 AM to 9 AM", saturday: "12 AM to 9 AM" }),

  c("blue-baby-dragon", "Blue Baby Dragon", "Blue Baby Dragon.png", "Storybook Vale", "The Wild Woods", "Pure Ice", "Patience", { sunday: na, monday: na, tuesday: all, wednesday: all, thursday: all, friday: all, saturday: na }),
  c("teal-baby-dragon", "Teal Baby Dragon", "Teal Baby Dragon.png", "Storybook Vale", "The Wild Woods", "Pure Ice", "Patience", { sunday: all, monday: na, tuesday: na, wednesday: all, thursday: all, friday: all, saturday: all }),
  c("green-baby-dragon", "Green Baby Dragon", "Green Baby Dragon.png", "Storybook Vale", "The Fallen Fortress", "Pure Ice", "Patience", { sunday: "10 AM to 6 PM", monday: "10 AM to 6 PM", tuesday: "10 AM to 6 PM", wednesday: "10 AM to 6 PM", thursday: "10 AM to 6 PM", friday: na, saturday: na }),
  c("purple-baby-dragon", "Purple Baby Dragon", "Purple Baby Dragon.png", "Storybook Vale", "The Beanstalk Marshes", "Pure Ice", "Patience", { sunday: am, monday: am, tuesday: am, wednesday: am, thursday: am, friday: am, saturday: am }),
  c("red-baby-dragon", "Red Baby Dragon", "Red Baby Dragon.png", "Storybook Vale", "Teapot Falls", "Pure Ice", "Patience", { sunday: all, monday: na, tuesday: na, wednesday: na, thursday: na, friday: na, saturday: all }),

  c("black-pegasus", "Black Pegasus", "Black Pegasus.png", "Storybook Vale", "The Elysian Fields", "5-Star Vegetable Meal", "Tag", { sunday: all, monday: na, tuesday: na, wednesday: all, thursday: all, friday: all, saturday: all }),
  c("pink-pegasus", "Pink Pegasus", "Pink Pegasus.png", "Storybook Vale", "The Elysian Fields", "5-Star Vegetable Meal", "Tag", { sunday: all, monday: na, tuesday: na, wednesday: na, thursday: all, friday: all, saturday: all }),
  c("blue-pegasus", "Blue Pegasus", "Blue Pegasus.png", "Storybook Vale", "The Fiery Plains", "5-Star Vegetable Meal", "Tag", { sunday: na, monday: all, tuesday: all, wednesday: all, thursday: na, friday: na, saturday: na }),
  c("peach-pegasus", "Peach Pegasus", "Peach Pegasus.png", "Storybook Vale", "Mount Olympus", "5-Star Vegetable Meal", "Tag", { sunday: "6 AM to 2 PM", monday: "6 AM to 2 PM", tuesday: "6 AM to 2 PM", wednesday: "6 AM to 2 PM", thursday: "6 AM to 2 PM", friday: "6 AM to 2 PM", saturday: "6 AM to 2 PM" }),
  c("yellow-pegasus", "Yellow Pegasus", "Yellow Pegasus.png", "Storybook Vale", "The Statue's Shadow", "5-Star Vegetable Meal", "Tag", { sunday: na, monday: na, tuesday: "6 PM to 12 AM", wednesday: "6 PM to 12 AM", thursday: "6 PM to 12 AM", friday: "6 PM to 12 AM", saturday: "6 PM to 12 AM" }),

  // Wishblossom Mountains / Ranch
  c("black-goose", "Black Goose", "Black Goose.png", "Wishblossom Mountains", "Silver Summit", "Red Currants", "Patience", { sunday: "5 AM to 11 AM", monday: "5 AM to 11 AM", tuesday: "5 AM to 11 AM", wednesday: "5 AM to 11 AM", thursday: "5 AM to 11 AM", friday: "5 AM to 11 AM", saturday: "5 AM to 11 AM" }),
  c("blue-goose", "Blue Goose", "Blue Goose.png", "Wishblossom Mountains", "Wishing Way", "Red Currants", "Patience", { sunday: "6 PM to 8 PM", monday: "6 PM to 8 PM", tuesday: "6 PM to 8 PM", wednesday: "6 PM to 8 PM", thursday: "6 PM to 8 PM", friday: "6 PM to 8 PM", saturday: "6 PM to 8 PM" }),
  c("golden-goose", "Golden Goose", "Golden Goose.png", "Wishblossom Mountains", "Delver Dale", "Red Currants", "Patience", { sunday: "7-8 AM and 7-8 PM", monday: "7-8 AM and 7-8 PM", tuesday: "7-8 AM and 7-8 PM", wednesday: "7-8 AM and 7-8 PM", thursday: "7-8 AM and 7-8 PM", friday: "7-8 AM and 7-8 PM", saturday: "7-8 AM and 7-8 PM" }),
  c("goose", "Goose", "Goose.png", "Wishblossom Mountains", "Wishblossom Ranch", "Red Currants", "Patience", { sunday: all, monday: all, tuesday: na, wednesday: all, thursday: na, friday: all, saturday: na }),
  c("true-north-goose", "True North Goose", "True North Goose.png", "Wishblossom Mountains", "Ranch Highlands", "Red Currants", "Patience", { sunday: na, monday: na, tuesday: all, wednesday: na, thursday: all, friday: na, saturday: all }),

  c("brown-skunk", "Brown Skunk", "Brown Skunk.png", "Wishblossom Mountains", "Paisley Park", "Button Mushroom", "RLGL", { sunday: pm, monday: pm, tuesday: na, wednesday: pm, thursday: na, friday: pm, saturday: na }),
  c("patterned-skunk", "Patterned Skunk", "Patterned Skunk.png", "Wishblossom Mountains", "Haute Plateau", "Button Mushroom", "RLGL", { sunday: all, monday: all, tuesday: all, wednesday: all, thursday: all, friday: all, saturday: all }),
  c("skunk", "Skunk", "Skunk.png", "Wishblossom Mountains", "Runway River", "Button Mushroom", "RLGL", { sunday: am, monday: am, tuesday: am, wednesday: am, thursday: am, friday: am, saturday: am }),
  c("white-skunk", "White Skunk", "White Skunk.png", "Wishblossom Mountains", "Modish Marsh", "Button Mushroom", "RLGL", { sunday: pm, monday: na, tuesday: pm, wednesday: na, thursday: pm, friday: na, saturday: pm }),

  c("blue-sweet-bee", "Blue Sweet Bee", "Blue Sweet Bee.png", "Wishblossom Mountains", "Hunny Falls", "Honey Coral", "Tag", { sunday: all, monday: all, tuesday: all, wednesday: all, thursday: all, friday: all, saturday: all }),
  c("pink-sweet-bee", "Pink Sweet Bee", "Pink Sweet Bee.png", "Wishblossom Mountains", "Pixie Flats", "Honey Coral", "Tag", { sunday: all, monday: all, tuesday: all, wednesday: all, thursday: all, friday: all, saturday: all }),
  c("sweet-bee", "Sweet Bee", "Sweet Bee.png", "Wishblossom Mountains", "Sundae Shores", "Honey Coral", "Tag", { sunday: "7 AM to 8 PM", monday: "7 AM to 8 PM", tuesday: "7 AM to 8 PM", wednesday: "7 AM to 8 PM", thursday: "7 AM to 8 PM", friday: "7 AM to 8 PM", saturday: "7 AM to 8 PM" }),
  c("white-sweet-bee", "White Sweet Bee", "White Sweet Bee.png", "Wishblossom Mountains", "Hundred-Acre Fields", "Honey Coral", "Tag", { sunday: "8 PM to 12 AM", monday: "8 PM to 12 AM", tuesday: "8 PM to 12 AM", wednesday: "8 PM to 12 AM", thursday: "8 PM to 12 AM", friday: "8 PM to 12 AM", saturday: "8 PM to 12 AM" })
];

function c(id, name, imageFile, area, location, favouriteFood, approachMethod, schedule) {
  return {
    id,
    name,
    image: critterImg(imageFile),
    area,
    areaIcon: areaIcon(area),
    location,
    locationIcon: locationIcon(location),
    favouriteFood,
    favouriteFoodImage: foodImg(favouriteFood),
    approachMethod,
    schedule,
  };
}


function getFoodImageFile(foodName) {
  const key = String(foodName || "").toLowerCase().trim();
  const map = {
    "5-star meal": "menu-icon-meals.png",
    "5-star meals": "menu-icon-meals.png",
    "5-star dessert": "menu-icon-meals.png",
    "5-star vegetable meal": "menu-icon-meals.png",
    "green and yellow flowers": "menu-icon-flowers.png",
    "orange and yellow flowers": "menu-icon-flowers.png",
    "pink and purple flowers": "menu-icon-flowers.png",
    "blue and red flowers": "menu-icon-flowers.png",
    "green and pink flowers": "menu-icon-flowers.png",
  };
  return map[key] || `${foodName}.png`;
}
