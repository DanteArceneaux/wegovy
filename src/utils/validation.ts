export const validateWeight = (weight: string): { valid: boolean; error?: string } => {
  const numWeight = parseFloat(weight);
  if (!weight || isNaN(numWeight)) {
    return { valid: false, error: 'Please enter a valid weight' };
  }
  if (numWeight <= 0 || numWeight > 1000) {
    return { valid: false, error: 'Please enter a weight between 1 and 1000 lbs' };
  }
  return { valid: true };
};

export const validateFoodEntry = (name: string, calories: string, protein: string): { valid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Please enter a food name' };
  }
  const cals = parseInt(calories);
  const prot = parseInt(protein);
  if (isNaN(cals) || cals < 0 || cals > 10000) {
    return { valid: false, error: 'Please enter valid calories (0-10000)' };
  }
  if (isNaN(prot) || prot < 0 || prot > 1000) {
    return { valid: false, error: 'Please enter valid protein (0-1000g)' };
  }
  return { valid: true };
};

export const validateShot = (date: string, time: string): { valid: boolean; error?: string } => {
  if (!date) {
    return { valid: false, error: 'Please select a date' };
  }
  if (!time) {
    return { valid: false, error: 'Please select a time' };
  }
  return { valid: true };
};



