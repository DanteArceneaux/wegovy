import { Settings, Recipe, StaplesCategory } from '../types';

export const DEFAULT_SETTINGS: Settings = {
  calorieGoal: 1800,
  proteinGoal: 120,
  waterGoal: 90,
  heightFt: 5,
  heightIn: 10,
  goalWeight: 180,
  startWeight: 240
};

export const SYMPTOM_LEVELS = {
  0: 'None',
  1: 'Mild',
  2: 'Moderate',
  3: 'Severe'
} as const;

export const INJECTION_SITES = [
  'Right Thigh',
  'Left Thigh',
  'Stomach (R)',
  'Stomach (L)'
] as const;

export const DOSAGE_OPTIONS = [
  { value: '0.25', label: '0.25 mg (Starter)' },
  { value: '0.5', label: '0.5 mg' },
  { value: '1.0', label: '1.0 mg' },
  { value: '1.7', label: '1.7 mg' },
  { value: '2.4', label: '2.4 mg (Maintenance)' }
] as const;

export const SYMPTOM_TYPES = ['Nausea', 'Fatigue', 'Headache'] as const;

export const RECIPES: Recipe[] = [
  { title: "Rotisserie Hack", type: "Meal", cost: "$", prep: "5m", img: "/assets/recipes/rotisserie_hack.png", calories: 450, protein: 45, ingredients: ["Rotisserie Chicken", "Frozen Steamer Veggies", "Microwave Rice Pouch"], desc: "The ultimate driver fuel. Buy one chicken, shred it. Lasts 3-4 days. Mix with microwaved frozen veggies and rice." },
  { title: "Tuna Wraps", type: "Lunch", cost: "$", prep: "5m", img: "/assets/recipes/tuna_wraps.png", calories: 320, protein: 35, ingredients: ["Canned Tuna", "Light Mayo", "Mustard", "Iceberg Lettuce Head", "Relish"], desc: "Drain tuna, mix with mayo/mustard. Wrap in large lettuce leaves. Crunch replaces chips. No cooking." },
  { title: "Overnight Oats", type: "Breakfast", cost: "$", prep: "2m", img: "/assets/recipes/overnight_oats.png", calories: 380, protein: 25, ingredients: ["Rolled Oats", "Milk or Almond Milk", "Frozen Berries", "Protein Powder"], desc: "Mix equal parts oats and liquid in a jar/container. Add berries. Let sit in fridge while you sleep. Grab and go." },
  { title: "Boiled Egg Box", type: "Snack", cost: "$", prep: "15m", img: "/assets/recipes/boiled_eggs.png", calories: 280, protein: 18, ingredients: ["Eggs", "String Cheese", "Apple", "Salt/Pepper"], desc: "Boil 6-10 eggs at once. Peel. Pack 2 eggs, 1 cheese stick, 1 apple. The perfect nausea-friendly car lunch." },
  { title: "Turkey Roll-ups", type: "Snack", cost: "$$", prep: "2m", img: "/assets/recipes/turkey_rollups.png", calories: 210, protein: 22, ingredients: ["Deli Turkey", "Cream Cheese", "Pickle Spear"], desc: "Spread cheese on turkey slice, place pickle in middle, roll up. High protein, low carb, cheap." },
  { title: "Cottage Bowl", type: "Breakfast", cost: "$", prep: "1m", img: "/assets/recipes/cottage_bowl.png", calories: 240, protein: 28, ingredients: ["Cottage Cheese", "Canned Pineapple or Peaches"], desc: "Scoop cheese, top with fruit. High protein helps nausea. Very cheap per serving." },
  { title: "Bean Burrito", type: "Meal", cost: "$", prep: "5m", img: "/assets/recipes/bean_burrito.png", calories: 410, protein: 15, ingredients: ["Refried Beans", "Tortillas", "Shredded Cheese", "Taco Sauce"], desc: "Spread beans and cheese on tortilla. Microwave 45s. Roll up. Foil wrap for the road." },
  { title: "Lentil Soup", type: "Meal", cost: "$", prep: "3m", img: "/assets/recipes/lentil_soup.png", calories: 290, protein: 18, ingredients: ["Canned Lentil Soup", "Frozen Spinach"], desc: "Heat soup, toss in handful of spinach to wilt. Lentils are cheap fiber/protein powerhouses." },
  { title: "PB & Banana", type: "Snack", cost: "$", prep: "1m", img: "/assets/recipes/pb_banana.png", calories: 280, protein: 8, ingredients: ["Banana", "Peanut Butter"], desc: "Classic. Potassium helps with leg cramps. PB provides energy." },
  { title: "Rice Cake 'Pizza'", type: "Snack", cost: "$", prep: "2m", img: "/assets/recipes/rice_cake_pizza.png", calories: 180, protein: 10, ingredients: ["Rice Cakes", "Tomato Sauce", "Mozzarella"], desc: "Top cake with sauce and cheese. Microwave 30s. Fixes the pizza craving without the grease/nausea." },
  { title: "Yogurt Parfait", type: "Breakfast", cost: "$$", prep: "2m", img: "/assets/recipes/yogurt_parfait.png", calories: 310, protein: 20, ingredients: ["Greek Yogurt", "Honey", "Granola"], desc: "Buy the big tub, not single cups. Sweeten with little honey. Top with granola." },
  { title: "Egg Tacos", type: "Meal", cost: "$", prep: "5m", img: "/assets/recipes/egg_tacos.png", calories: 350, protein: 16, ingredients: ["Eggs", "Corn Tortillas", "Salsa"], desc: "Scramble 2 eggs. Warm tortillas. Top with salsa. Cheap dinner." },
  { title: "Chicken Cuke", type: "Lunch", cost: "$", prep: "5m", img: "/assets/recipes/chicken_cuke.png", calories: 220, protein: 32, ingredients: ["Canned Chicken", "Mayo", "Cucumber"], desc: "Mix canned chicken and mayo. Use cucumber slices as 'crackers'. Hydrating and high protein." },
  { title: "Edamame", type: "Snack", cost: "$", prep: "3m", img: "/assets/recipes/edamame.png", calories: 150, protein: 14, ingredients: ["Frozen Edamame"], desc: "Microwave bag. Add salt. High protein snack that takes time to eat (keeps you busy)." },
  { title: "Black Bean Bowl", type: "Meal", cost: "$", prep: "5m", img: "/assets/recipes/black_bean_bowl.png", calories: 380, protein: 16, ingredients: ["Canned Black Beans", "Canned Corn", "Salsa", "Avocado"], desc: "Rinse beans and corn. Mix with salsa. No cooking required. Very filling." },
  { title: "Protein Shake", type: "Drink", cost: "$$", prep: "1m", img: "/assets/recipes/protein_shake.png", calories: 160, protein: 30, ingredients: ["Protein Powder", "Water/Milk"], desc: "Cheaper than ready-to-drink bottles. Keep powder and bottle in the car. Add water when hungry." },
  { title: "Hummus & Carrots", type: "Snack", cost: "$", prep: "0m", img: "/assets/recipes/hummus_carrots.png", calories: 240, protein: 8, ingredients: ["Hummus", "Carrots"], desc: "Peeling your own carrots saves 50% vs baby carrots. Great crunch." },
  { title: "Turkey Jerky", type: "Snack", cost: "$$$", prep: "0m", img: "/assets/recipes/turkey_jerky.png", calories: 120, protein: 20, ingredients: ["Turkey Jerky"], desc: "More expensive, but keeps forever in the glove box for emergencies. Get at Grocery Outlet." },
  { title: "Microwave Potato", type: "Meal", cost: "$", prep: "7m", img: "/assets/recipes/microwave_potato.png", calories: 420, protein: 18, ingredients: ["Russet Potato", "Canned Chili", "Shredded Cheese"], desc: "Poke potato, microwave 6-7 mins. Top with canned chili and cheese. A heavy meal for <$2." },
  { title: "Cheese & Nuts", type: "Snack", cost: "$$", prep: "0m", img: "/assets/recipes/cheese_nuts.png", calories: 260, protein: 14, ingredients: ["String Cheese", "Almonds"], desc: "The classic driver snack. Buy almonds in bulk at WinCo to save $$." }
];

export const STAPLES: StaplesCategory[] = [
  {
    cat: "1. Produce",
    img: "/assets/recipes/cat_produce.png",
    items: ["Bananas", "Apples", "Cucumber", "Avocado", "Carrots (Whole bag)", "Russet Potatoes", "Iceberg Lettuce"]
  },
  {
    cat: "2. Meat & Deli",
    img: "/assets/recipes/cat_meat_deli.png",
    items: ["Rotisserie Chicken", "Deli Turkey (Family Pack)", "Turkey Jerky"]
  },
  {
    cat: "3. Aisle: Canned & Jars",
    img: "/assets/recipes/cat_canned_jars.png",
    items: ["Canned Tuna", "Canned Chicken", "Canned Black Beans", "Canned Refried Beans", "Canned Corn", "Canned Lentil Soup", "Canned Chili", "Canned Pineapple/Peaches (in juice)", "Salsa", "Tomato Sauce", "Taco Sauce", "Peanut Butter", "Honey", "Pickles", "Relish"]
  },
  {
    cat: "4. Aisle: Grains & Dry Goods",
    img: "/assets/recipes/cat_grains_dry.png",
    items: ["Rolled Oats (Bulk)", "Rice Pouches (Microwave)", "Tortillas (Corn & Flour)", "Rice Cakes", "Granola (Low Sugar)", "Protein Powder", "Almonds (Bulk)"]
  },
  {
    cat: "5. Condiments & Spices",
    img: "/assets/recipes/cat_condiments.png",
    items: ["Light Mayo", "Mustard", "Salt & Pepper Shakers"]
  },
  {
    cat: "6. Dairy & Refrigerated",
    img: "/assets/recipes/cat_dairy.png",
    items: ["Greek Yogurt (Tub)", "Cottage Cheese", "String Cheese", "Shredded Cheese (Mexican Blend)", "Mozzarella (Shredded)", "Cream Cheese", "Hummus", "Milk or Almond Milk"]
  },
  {
    cat: "7. Freezer",
    img: "/assets/recipes/cat_freezer.png",
    items: ["Frozen Mixed/Steamer Veggies", "Frozen Berries", "Frozen Spinach", "Frozen Edamame"]
  },
  {
    cat: "8. Beverages (Wegovy Safe)",
    img: "/assets/recipes/cat_beverages.png",
    items: ["Water Filter Bottle", "Crystal Light / Mio", "Ginger Tea Bags", "Peppermint Tea", "Electrolyte Powder"]
  }
];



