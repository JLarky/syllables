const syllables = ["ма", "па", "ка", "ти", "ша", "ила"];
export const words = ["мама", "папа", "тиша", "илаша"];

export function getRandomSyllable() {
  return syllables[Math.floor(Math.random() * syllables.length)];
}

export function getRandomWord() {
  return getRandomSyllable() + " " + getRandomSyllable();
}
