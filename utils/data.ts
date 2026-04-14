export function generateName(base: string) {
  const random = Math.floor(Math.random() * 1000);
  return `${base}-${random.toString().padStart(3, "0")}`;
}
