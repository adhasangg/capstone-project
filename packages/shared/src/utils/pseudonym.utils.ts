/**
 * Generates an empathetic, anonymous pseudonym for users.
 * Example: "Mahasiswa #4821", "Konselor #1920"
 *
 * @param prefix - Optional prefix, defaults to "Mahasiswa"
 * @returns Formatted pseudonym string
 */
export function generatePseudonym(prefix = 'Mahasiswa'): string {
  // Generate random 4-digit number between 1000 and 9999
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix} #${randomSuffix}`;
}
