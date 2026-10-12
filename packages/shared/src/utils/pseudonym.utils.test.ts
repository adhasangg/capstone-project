import { describe, expect, it } from 'bun:test';
import { generatePseudonym, generateSessionPseudonym } from './pseudonym.utils';

describe('generatePseudonym', () => {
  it('should generate a pseudonym with default prefix "Mahasiswa"', () => {
    const pseudonym = generatePseudonym();
    expect(pseudonym.startsWith('Mahasiswa #')).toBe(true);
    expect(/^Mahasiswa #[0-9]{4}$/.test(pseudonym)).toBe(true);
  });

  it('should generate a pseudonym with custom prefix', () => {
    const pseudonym = generatePseudonym('Konselor');
    expect(pseudonym.startsWith('Konselor #')).toBe(true);
    expect(/^Konselor #[0-9]{4}$/.test(pseudonym)).toBe(true);
  });

  it('should generate non-negative 4-digit random numbers', () => {
    for (let i = 0; i < 20; i++) {
      const pseudonym = generatePseudonym();
      const numPart = pseudonym.replace('Mahasiswa #', '');
      const num = Number.parseInt(numPart, 10);
      expect(num).toBeGreaterThanOrEqual(1000);
      expect(num).toBeLessThanOrEqual(9999);
    }
  });
});

describe('generateSessionPseudonym', () => {
  it('should generate empathetic session pseudonyms starting with "Sahabat "', () => {
    const sessionPseudo = generateSessionPseudonym();
    expect(sessionPseudo.startsWith('Sahabat ')).toBe(true);
    expect(/^Sahabat [A-Za-z]+-[0-9]{2}$/.test(sessionPseudo)).toBe(true);
  });

  it('should generate unlinkable random pseudonyms on successive calls', () => {
    const samples = new Set<string>();
    for (let i = 0; i < 30; i++) {
      samples.add(generateSessionPseudonym());
    }
    // Should have good diversity (at least 15 unique out of 30)
    expect(samples.size).toBeGreaterThanOrEqual(15);
  });
});
