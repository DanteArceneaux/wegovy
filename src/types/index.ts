export interface Settings {
  calorieGoal: number;
  proteinGoal: number;
  waterGoal: number;
  heightFt: number;
  heightIn: number;
  goalWeight: number;
  startWeight: number;
}

export interface Shot {
  id: string;
  date: string;
  time: string;
  dosage: string;
  site: string;
  notes?: string;
  timestamp?: any;
}

export interface DailyLog {
  calories: number;
  protein: number;
  water: number;
  symptoms: Record<string, number>;
  notes: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  dateString: string;
  timestamp?: any;
}

export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  timestamp?: any;
}

export interface Recipe {
  title: string;
  type: string;
  cost: string;
  prep: string;
  img: string;
  ingredients: string[];
  desc: string;
  calories: number;
  protein: number;
}


export interface StaplesCategory {
  cat: string;
  img: string;
  items: string[];
}

export interface Symptoms {
  nausea: number;
  fatigue: number;
  headache: number;
}

