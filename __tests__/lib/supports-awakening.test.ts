import {
  calculatePairUpBonuses,
  getDualSupportBonuses,
  calculateDualStrikeRate,
  calculateDualGuardRate,
  getSupportRankValue,
  CLASS_PAIR_UP_BONUSES,
  DUAL_SUPPORT_TABLE,
} from '@/lib/supports-awakening';
import type { UnitStats } from '@/types/unit';

describe('supports-awakening lookup tables', () => {
  describe('CLASS_PAIR_UP_BONUSES', () => {
    it('matches documented class modifiers (sample)', () => {
      expect(CLASS_PAIR_UP_BONUSES['Lord']).toEqual({ spd: 3, lck: 3 });
      expect(CLASS_PAIR_UP_BONUSES['Grandmaster']).toEqual({ str: 2, mag: 2, skl: 2, spd: 2 });
      expect(CLASS_PAIR_UP_BONUSES['Great Knight']).toEqual({ str: 3, def: 3, mov: 1 });
      expect(CLASS_PAIR_UP_BONUSES['Manakete']).toEqual({ str: 2, mag: 2, def: 2, res: 2 });
    });

    it('only exposes non-zero modifiers', () => {
      for (const bonus of Object.values(CLASS_PAIR_UP_BONUSES)) {
        for (const value of Object.values(bonus)) {
          expect(value).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('DUAL_SUPPORT_TABLE', () => {
    it('covers ranks 1 through 12', () => {
      for (let rank = 1; rank <= 12; rank += 1) {
        expect(DUAL_SUPPORT_TABLE[rank]).toBeDefined();
      }
    });

    it('matches documented rank endpoints', () => {
      expect(DUAL_SUPPORT_TABLE[1]).toEqual({ hit: 10, avoid: 0, critical: 0, dodge: 0 });
      expect(DUAL_SUPPORT_TABLE[6]).toEqual({ hit: 15, avoid: 15, critical: 10, dodge: 10 });
      expect(DUAL_SUPPORT_TABLE[12]).toEqual({ hit: 20, avoid: 20, critical: 20, dodge: 20 });
    });
  });

  describe('getSupportRankValue', () => {
    it('maps support levels to Dual Support rank values', () => {
      expect(getSupportRankValue('None')).toBe(1);
      expect(getSupportRankValue('C')).toBe(2);
      expect(getSupportRankValue('B')).toBe(3);
      expect(getSupportRankValue('A')).toBe(4);
      expect(getSupportRankValue('S')).toBe(5);
    });
  });
});

describe('calculatePairUpBonuses', () => {
  it('derives a stat-only bonus when the class has no modifiers', () => {
    const stats: UnitStats = { str: 25, mag: 25, skl: 25, spd: 25, lck: 25, def: 25, res: 25 };
    expect(calculatePairUpBonuses(stats, 'Unknown', 'None')).toEqual({
      str: 2, mag: 2, skl: 2, spd: 2, lck: 2, def: 2, res: 2,
    });
  });

  it('applies stat bonus thresholds (9->0, 10->1, 19->1, 20->2, 29->2, 30->3)', () => {
    const stats: UnitStats = { str: 9, mag: 10, skl: 19, spd: 20, lck: 29, def: 30, res: 100 };
    expect(calculatePairUpBonuses(stats, 'Unknown', 'None')).toEqual({
      mag: 1, skl: 1, spd: 2, lck: 2, def: 3, res: 3,
    });
  });

  it('applies class modifiers with no stat and no support level', () => {
    expect(calculatePairUpBonuses({}, 'Lord', 'None')).toEqual({ spd: 3, lck: 3 });
  });

  it('adds +1 to class modifiers for C and B support levels', () => {
    expect(calculatePairUpBonuses({}, 'Lord', 'C')).toEqual({ spd: 4, lck: 4 });
    expect(calculatePairUpBonuses({}, 'Lord', 'B')).toEqual({ spd: 4, lck: 4 });
  });

  it('adds +2 to class modifiers for A and S support levels', () => {
    expect(calculatePairUpBonuses({}, 'Lord', 'A')).toEqual({ spd: 5, lck: 5 });
    expect(calculatePairUpBonuses({}, 'Lord', 'S')).toEqual({ spd: 5, lck: 5 });
  });

  it('combines stat bonus + class bonus + support level bonus', () => {
    const stats: UnitStats = { str: 25, mag: 25, skl: 25, spd: 25 }; // +2 each
    // Grandmaster: str/mag/skl/spd = 2, at A (+2 level) => 2 + 2 + 2 = 6
    expect(calculatePairUpBonuses(stats, 'Grandmaster', 'A')).toEqual({
      str: 6, mag: 6, skl: 6, spd: 6,
    });
  });

  it('omits stats whose total bonus is zero', () => {
    const stats: UnitStats = { str: 0, mag: 0, skl: 0, spd: 0, lck: 0, def: 0, res: 0 };
    const result = calculatePairUpBonuses(stats, 'Lord', 'None');
    expect(result).toEqual({ spd: 3, lck: 3 });
    expect(result).not.toHaveProperty('str');
    expect(result).not.toHaveProperty('res');
  });

  it('does not apply the support level bonus to pure stat bonuses', () => {
    // Unknown class, high stat, S support: stat bonus only (no +2 level boost).
    const stats: UnitStats = { str: 25 };
    expect(calculatePairUpBonuses(stats, 'Unknown', 'S')).toEqual({ str: 2 });
  });

  it('returns an empty object for an unknown class with no stats', () => {
    expect(calculatePairUpBonuses({}, 'NonexistentClass', 'S')).toEqual({});
  });

  it('treats missing stats as zero', () => {
    // Lord class, no stats provided -> class-only bonuses at None level.
    expect(calculatePairUpBonuses({}, 'Lord', 'None')).toEqual({ spd: 3, lck: 3 });
  });

  it('never boosts mov by support level or raw mov stat', () => {
    // Great Knight: str:3, def:3, mov:1. High mov stat must not change mov bonus.
    const result = calculatePairUpBonuses({ mov: 50 }, 'Great Knight', 'S');
    expect(result).toEqual({ str: 5, def: 5, mov: 1 });
  });

  it('always exposes the class mov bonus regardless of support level', () => {
    expect(calculatePairUpBonuses({}, 'Bow Knight', 'None').mov).toBe(1);
    expect(calculatePairUpBonuses({}, 'Bow Knight', 'S').mov).toBe(1);
  });
});

describe('getDualSupportBonuses', () => {
  it('returns rank 1 values for the base rank', () => {
    expect(getDualSupportBonuses(1)).toEqual({ hit: 10, avoid: 0, critical: 0, dodge: 0 });
  });

  it('returns rank 12 values for the maximum rank', () => {
    expect(getDualSupportBonuses(12)).toEqual({ hit: 20, avoid: 20, critical: 20, dodge: 20 });
  });

  it('returns the documented values at a mid rank', () => {
    expect(getDualSupportBonuses(6)).toEqual({ hit: 15, avoid: 15, critical: 10, dodge: 10 });
  });

  it('clamps ranks below 1 to rank 1', () => {
    expect(getDualSupportBonuses(-3)).toEqual({ hit: 10, avoid: 0, critical: 0, dodge: 0 });
  });

  it('clamps ranks above 12 to rank 12', () => {
    expect(getDualSupportBonuses(99)).toEqual({ hit: 20, avoid: 20, critical: 20, dodge: 20 });
  });

  it('boosts the rank by +4 when Dual Support+ is active', () => {
    // rank 5 + 4 = 9
    expect(getDualSupportBonuses(5, true)).toEqual({ hit: 20, avoid: 15, critical: 15, dodge: 15 });
  });

  it('caps the Dual Support+ boost at rank 12', () => {
    // rank 10 + 4 = 14 -> clamped to 12
    expect(getDualSupportBonuses(10, true)).toEqual({ hit: 20, avoid: 20, critical: 20, dodge: 20 });
  });

  it('defaults the Dual Support+ flag to false', () => {
    expect(getDualSupportBonuses(5)).toEqual({ hit: 15, avoid: 10, critical: 10, dodge: 10 });
  });

  it('truncates fractional ranks before lookup', () => {
    // 5.9 -> trunc 5
    expect(getDualSupportBonuses(5.9)).toEqual({ hit: 15, avoid: 10, critical: 10, dodge: 10 });
  });
});

describe('calculateDualStrikeRate', () => {
  it('uses the None base rate', () => {
    expect(calculateDualStrikeRate(0, 0, 'None')).toBe(20);
  });

  it('uses the S base rate', () => {
    expect(calculateDualStrikeRate(0, 0, 'S')).toBe(60);
  });

  it('uses each support level base rate', () => {
    expect(calculateDualStrikeRate(0, 0, 'C')).toBe(30);
    expect(calculateDualStrikeRate(0, 0, 'B')).toBe(40);
    expect(calculateDualStrikeRate(0, 0, 'A')).toBe(50);
  });

  it('includes the floored skill contribution', () => {
    // (20 + 19) / 4 = 9.75 -> floor 9, +30 (C) = 39
    expect(calculateDualStrikeRate(20, 19, 'C')).toBe(39);
  });

  it('adds +10 when Dual Strike+ is active', () => {
    // floor((10 + 10) / 4) = 5, +40 (B) + 10 = 55
    expect(calculateDualStrikeRate(10, 10, 'B', true)).toBe(55);
  });

  it('defaults the Dual Strike+ flag to false', () => {
    expect(calculateDualStrikeRate(10, 10, 'B')).toBe(45);
  });
});

describe('calculateDualGuardRate', () => {
  it('uses the None base rate (0)', () => {
    expect(calculateDualGuardRate(0, 0, 'None')).toBe(0);
  });

  it('uses the S base rate', () => {
    expect(calculateDualGuardRate(0, 0, 'S')).toBe(10);
  });

  it('uses each support level base rate', () => {
    expect(calculateDualGuardRate(0, 0, 'C')).toBe(2);
    expect(calculateDualGuardRate(0, 0, 'B')).toBe(5);
    expect(calculateDualGuardRate(0, 0, 'A')).toBe(7);
  });

  it('includes the floored stat contribution (Def for physical)', () => {
    // (15 + 13) / 4 = 7, +5 (B) = 12
    expect(calculateDualGuardRate(15, 13, 'B')).toBe(12);
  });

  it('includes the floored stat contribution (Res for magical)', () => {
    // (10 + 14) / 4 = 6, +2 (C) = 8
    expect(calculateDualGuardRate(10, 14, 'C')).toBe(8);
  });

  it('adds +10 when Dual Guard+ is active', () => {
    // (16 + 16) / 4 = 8, +7 (A) + 10 = 25
    expect(calculateDualGuardRate(16, 16, 'A', true)).toBe(25);
  });

  it('defaults the Dual Guard+ flag to false', () => {
    expect(calculateDualGuardRate(16, 16, 'A')).toBe(15);
  });
});
