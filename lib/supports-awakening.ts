import { UnitStats } from '@/types/unit';

/**
 * Awakening Dual System support calculations.
 *
 * Implements Pair Up bonuses, Dual Support lookup, and Dual Strike / Dual Guard
 * activation rates per https://serenesforest.net/awakening/miscellaneous/dual-system/
 * and https://serenesforest.net/awakening/miscellaneous/pair-up/.
 *
 * Reference tables live in `hidden/AWAKENING_SUPPORTS_ADDITION.md`.
 */

export type AwakeningSupportLevel = 'None' | 'C' | 'B' | 'A' | 'S';

export interface PairUpBonus {
  str?: number;
  mag?: number;
  skl?: number;
  spd?: number;
  lck?: number;
  def?: number;
  res?: number;
  mov?: number;
}

export interface DualSupportBonus {
  hit: number;
  avoid: number;
  critical: number;
  dodge: number; // Critical Avoid
}

const PAIR_UP_STAT_KEYS: readonly (keyof PairUpBonus)[] = [
  'str',
  'mag',
  'skl',
  'spd',
  'lck',
  'def',
  'res',
] as const;

/**
 * Pair Up class bonus lookup (from hidden/AWAKENING_SUPPORTS_ADDITION.md).
 * Only non-zero modifiers are listed; Mov is included verbatim (no support-level boost).
 */
export const CLASS_PAIR_UP_BONUSES: Record<string, PairUpBonus> = {
  'Lord': { spd: 3, lck: 3 },
  'Great Lord': { spd: 4, lck: 4 },
  'Tactician': { str: 1, mag: 1, skl: 2, spd: 2 },
  'Grandmaster': { str: 2, mag: 2, skl: 2, spd: 2 },
  'Cavalier': { str: 2, skl: 1, spd: 1, def: 2 },
  'Paladin': { str: 2, skl: 2, spd: 2, def: 2 },
  'Great Knight': { str: 3, def: 3, mov: 1 },
  'Knight': { str: 2, def: 4 },
  'General': { str: 3, def: 5 },
  'Myrmidon': { spd: 4, lck: 2 },
  'Swordmaster': { spd: 5, lck: 3 },
  'Mercenary': { skl: 2, spd: 3, def: 1 },
  'Hero': { skl: 3, spd: 3, def: 2 },
  'Fighter': { str: 4, def: 2 },
  'Warrior': { str: 5, def: 3 },
  'Barbarian': { str: 4, spd: 2 },
  'Berserker': { str: 5, spd: 3 },
  'Archer': { str: 2, skl: 2, def: 2 },
  'Sniper': { str: 3, skl: 3, def: 2 },
  'Bow Knight': { skl: 3, spd: 3, mov: 1 },
  'Thief': { skl: 2, spd: 2, mov: 1 },
  'Assassin': { str: 2, skl: 2, spd: 4 },
  'Trickster': { mag: 2, skl: 1, spd: 3, mov: 1 },
  'Pegasus Knight': { spd: 3, res: 3 },
  'Falcon Knight': { spd: 4, res: 4 },
  'Dark Flier': { mag: 3, spd: 3, res: 2 },
  'Wyvern Rider': { str: 3, def: 3 },
  'Wyvern Lord': { str: 4, def: 4 },
  'Griffon Rider': { str: 3, lck: 1, def: 2, mov: 1 },
  'Mage': { mag: 4, skl: 2 },
  'Sage': { mag: 4, skl: 2, res: 2 },
  'Dark Mage': { mag: 3, def: 3 },
  'Sorcerer': { mag: 3, def: 2, res: 3 },
  'Dark Knight': { mag: 2, def: 3, res: 1, mov: 1 },
  'Priest': { mag: 2, lck: 2, res: 2 },
  'Cleric': { mag: 2, lck: 2, res: 2 },
  'War Monk': { str: 2, mag: 2, lck: 2, res: 2 },
  'War Cleric': { str: 2, mag: 2, lck: 2, res: 2 },
  'Troubadour': { mag: 2, spd: 1, res: 3 },
  'Valkyrie': { mag: 3, spd: 2, res: 3 },
  'Villager': { skl: 3, lck: 3 },
  'Dancer': { spd: 3, lck: 3 },
  'Taguel': { str: 3, skl: 2, spd: 3 },
  'Manakete': { str: 2, mag: 2, def: 2, res: 2 },
  'Lodestar': { str: 2, spd: 3, lck: 3 },
  'Dread Fighter': { str: 3, mag: 1, spd: 1, res: 3 },
  'Bride': { mag: 2, spd: 2, lck: 2, res: 2 },
  'Conqueror': { str: 2, spd: 2, def: 2, mov: 1 },
};

/**
 * Dual Support bonus table indexed by combined support rank (1–12).
 * Source: hidden/AWAKENING_SUPPORTS_ADDITION.md §2.
 */
export const DUAL_SUPPORT_TABLE: Record<number, DualSupportBonus> = {
  1: { hit: 10, avoid: 0, critical: 0, dodge: 0 },
  2: { hit: 10, avoid: 10, critical: 0, dodge: 0 },
  3: { hit: 10, avoid: 10, critical: 0, dodge: 10 },
  4: { hit: 10, avoid: 10, critical: 10, dodge: 10 },
  5: { hit: 15, avoid: 10, critical: 10, dodge: 10 },
  6: { hit: 15, avoid: 15, critical: 10, dodge: 10 },
  7: { hit: 15, avoid: 15, critical: 10, dodge: 15 },
  8: { hit: 15, avoid: 15, critical: 15, dodge: 15 },
  9: { hit: 20, avoid: 15, critical: 15, dodge: 15 },
  10: { hit: 20, avoid: 20, critical: 15, dodge: 15 },
  11: { hit: 20, avoid: 20, critical: 15, dodge: 20 },
  12: { hit: 20, avoid: 20, critical: 20, dodge: 20 },
};

const SUPPORT_LEVEL_RANK: Record<AwakeningSupportLevel, number> = {
  None: 1,
  C: 2,
  B: 3,
  A: 4,
  S: 5,
};

const DUAL_STRIKE_BASE_RATE: Record<AwakeningSupportLevel, number> = {
  None: 20,
  C: 30,
  B: 40,
  A: 50,
  S: 60,
};

const DUAL_GUARD_BASE_RATE: Record<AwakeningSupportLevel, number> = {
  None: 0,
  C: 2,
  B: 5,
  A: 7,
  S: 10,
};

const MAX_DUAL_SUPPORT_RANK = 12;

/**
 * Convert an Awakening support level to its Dual Support rank value.
 * None = 1, C = 2, B = 3, A = 4, S = 5.
 */
export function getSupportRankValue(level: AwakeningSupportLevel): number {
  return SUPPORT_LEVEL_RANK[level];
}

/**
 * Stat bonus derived from a raw stat value: 10–19 → +1, 20–29 → +2, 30+ → +3.
 */
function getStatBonus(statValue: number): number {
  if (statValue >= 30) return 3;
  if (statValue >= 20) return 2;
  if (statValue >= 10) return 1;
  return 0;
}

/**
 * Support level bonus applied to non-Mov class modifiers:
 * C/B → +1, A/S → +2, None → +0.
 */
function getSupportLevelClassBonus(level: AwakeningSupportLevel): number {
  switch (level) {
    case 'A':
    case 'S':
      return 2;
    case 'C':
    case 'B':
      return 1;
    default:
      return 0;
  }
}

/**
 * Calculate Awakening Pair Up stat bonuses granted to a lead unit by a support unit.
 *
 * For each combat stat the total is:
 *   statBonus(supportStat) + classBonus[stat] + supportLevelBonus   (when classBonus[stat] > 0)
 * Mov only ever receives the raw class Mov bonus (no stat bonus, no support-level boost).
 *
 * @param supportUnitStats Raw stats of the paired support unit (HP/Mov ignored for stat bonus).
 * @param supportUnitClass Display name of the support unit's class (must match CLASS_PAIR_UP_BONUSES keys).
 * @param supportLevel Support level between the two units ('None' if unsupported).
 * @returns Per-stat bonuses; only non-zero stats are populated.
 */
export function calculatePairUpBonuses(
  supportUnitStats: UnitStats,
  supportUnitClass: string,
  supportLevel: AwakeningSupportLevel,
): PairUpBonus {
  const classBonus = CLASS_PAIR_UP_BONUSES[supportUnitClass] ?? {};
  const levelBonus = getSupportLevelClassBonus(supportLevel);

  const result: PairUpBonus = {};

  for (const stat of PAIR_UP_STAT_KEYS) {
    const rawStat = (supportUnitStats[stat as keyof UnitStats] as number | undefined) ?? 0;
    const statBonus = getStatBonus(rawStat);
    const classStatBonus = (classBonus[stat] as number | undefined) ?? 0;

    // Support level bonus is applied to class modifiers only (not to pure stat bonuses).
    const boostedClassBonus = classStatBonus > 0 ? classStatBonus + levelBonus : 0;
    const total = statBonus + boostedClassBonus;
    if (total > 0) {
      result[stat] = total;
    }
  }

  // Mov is class-only and is never boosted by support level or raw stat.
  const classMovBonus = (classBonus.mov as number | undefined) ?? 0;
  if (classMovBonus > 0) {
    result.mov = classMovBonus;
  }

  return result;
}

/**
 * Retrieve Dual Support bonuses (Hit, Avoid, Critical, Crit Avoid) for a combined support rank.
 *
 * Ranks are additive across multiple adjacent allies (None=1, C=2, B=3, A=4, S=5).
 * The "Dual Support+" skill boosts the rank by +4, capped at 12.
 *
 * @param combinedRank Total support rank from 1–12 (caller is responsible for summing allies).
 * @param hasDualSupportPlus Whether the unit possesses the "Dual Support+" skill.
 */
export function getDualSupportBonuses(
  combinedRank: number,
  hasDualSupportPlus: boolean = false,
): DualSupportBonus {
  const boostedRank = hasDualSupportPlus ? combinedRank + 4 : combinedRank;
  const clampedRank = Math.min(Math.max(Math.trunc(boostedRank), 1), MAX_DUAL_SUPPORT_RANK);
  return DUAL_SUPPORT_TABLE[clampedRank];
}

/**
 * Calculate the Dual Strike activation rate.
 *
 * Formula: floor((leadSkill + supportSkill) / 4) + baseRate(supportLevel)
 *   baseRate: None=20, C=30, B=40, A=50, S=60.
 * "Dual Strike+" adds +10%.
 */
export function calculateDualStrikeRate(
  leadSkill: number,
  supportSkill: number,
  supportLevel: AwakeningSupportLevel,
  hasDualStrikePlus: boolean = false,
): number {
  const baseRate = DUAL_STRIKE_BASE_RATE[supportLevel];
  const skillContribution = Math.floor((leadSkill + supportSkill) / 4);
  const bonus = hasDualStrikePlus ? 10 : 0;
  return skillContribution + baseRate + bonus;
}

/**
 * Calculate the Dual Guard activation rate.
 *
 * Formula: floor((leadStat + supportStat) / 4) + baseRate(supportLevel)
 *   `leadStat`/`supportStat` are Def for physical attacks, Res for magical attacks.
 *   baseRate: None=0, C=2, B=5, A=7, S=10.
 * "Dual Guard+" adds +10%.
 */
export function calculateDualGuardRate(
  leadStat: number,
  supportStat: number,
  supportLevel: AwakeningSupportLevel,
  hasDualGuardPlus: boolean = false,
): number {
  const baseRate = DUAL_GUARD_BASE_RATE[supportLevel];
  const statContribution = Math.floor((leadStat + supportStat) / 4);
  const bonus = hasDualGuardPlus ? 10 : 0;
  return statContribution + baseRate + bonus;
}
