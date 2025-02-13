import { CATEGORIES } from "./constants";


export function getAllCategories() {
  return Object.keys(CATEGORIES);
}

export function getDefaultCategories() {
  return getAllCategories().filter(cat => CATEGORIES[cat].enabled === true);
}

export function getRequiredCategories() {
  return getDefaultCategories().filter(cat => CATEGORIES[cat].readOnly === true);
}