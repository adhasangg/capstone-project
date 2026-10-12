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

const SESSION_EMPATHY_NAMES = [
  'Lentera',
  'Pelita',
  'Samudera',
  'Cakrawala',
  'Binar',
  'Bayu',
  'Senja',
  'Fajar',
  'Embun',
  'Arunika',
  'Mentari',
  'Renjana',
  'Asa',
  'Kirana',
  'Gemintang',
] as const;

/**
 * Generates an unlinkable ephemeral session pseudonym for a counseling ticket.
 * Example: "Sahabat Lentera-42", "Sahabat Pelita-87"
 */
export function generateSessionPseudonym(): string {
  const name = SESSION_EMPATHY_NAMES[Math.floor(Math.random() * SESSION_EMPATHY_NAMES.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `Sahabat ${name}-${num}`;
}
