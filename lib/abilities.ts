export interface AbilityData {
    name: string;
    description: string;
    procCondition?: string;
    procChance?: string;
    gameSpecificDetails?: Record<string, string>;
}

export const abilityDefinitions: Record<string, AbilityData> = {
    'Silencer': {
        name: 'Silencer',
        description: 'An instant-kill attack that activates when landing a critical hit.',
        procCondition: 'Critical hit must land.',
        procChance: 'Skill / 2 %',
        gameSpecificDetails: {
            'The Sacred Stones': '(Sacred Stones) Activation rate is halved against bosses, and 0% against the final boss.',
        }
    },
    'Great Shield': {
        name: 'Great Shield',
        description: 'Negates all damage from a single incoming attack.',
        procCondition: 'Upon being attacked.',
        procChance: 'Level%',
    },
    'Pierce': {
        name: 'Pierce',
        description: 'Ignores the enemy\'s Defense stat entirely for the attack.',
        procCondition: 'Upon attacking.',
        procChance: 'Level%',
    },
    'Sure Strike': {
        name: 'Sure Strike',
        description: 'Guarantees the attack will hit (100% accuracy).',
        procCondition: 'Upon attacking.',
        procChance: 'Level%',
    },
    'Slayer': {
        name: 'Slayer',
        description: 'Triples effective weapon might against monster-type units.',
    },
    'Lockpick': {
        name: 'Lockpick',
        description: 'Can use Lockpicks to open doors and chests.',
    },
    'Locktouch': {
        name: 'Locktouch',
        description: 'Can open doors and chests without needing keys or lockpicks.',
        gameSpecificDetails: {
            Awakening: 'Can open doors and chests without needing keys or lockpicks.',
        }
    },
    'Steal': {
        name: 'Steal',
        description: 'Can take a non-equipped item from an adjacent enemy, provided the thief has a higher Speed stat.',
    },
    'Pick': {
        name: 'Pick',
        description: 'Can open doors and chests without needing keys or lockpicks. Unlike Locktouch, does not consume lockpicks.',
    },
    'Summon': {
        name: 'Summon',
        description: 'Summons a controllable Phantom unit that fights alongside the caster.',
    },
    'Dance': {
        name: 'Dance',
        description: 'Refreshes an adjacent ally, allowing them to take another action this turn.',
    },
    'Play': {
        name: 'Play',
        description: 'Refreshes an adjacent ally, allowing them to take another action this turn.',
    },
    'Canto': {
        name: 'Canto',
        description: 'After performing an action, the unit can use any remaining movement.',
        gameSpecificDetails: {
            'The Binding Blade': '(Binding Blade) Can move after using items, staves, rescuing, dropping, talking, or visiting. Cannot move after attacking.',
            'The Blazing Blade': '(Blazing Blade) Can move after using items, staves, rescuing, dropping, talking, or visiting. Cannot move after attacking.',
            'The Sacred Stones': '(Sacred Stones) Can move after using items, staves, rescuing, dropping, talking, or visiting. Cannot move after attacking.',
            'Three Houses': '(Three Houses) Can move after any action, including attacking.',
        }
    },
    'Water Walk': {
        name: 'Water Walk',
        description: 'Can traverse water and ocean tiles without penalty.',
    },
    'Mountain Walk': {
        name: 'Mountain Walk',
        description: 'Can traverse mountain and peak tiles without penalty.',
    },
    'Dual Strike+': {
        name: 'Dual Strike+',
        description: '+10% to Dual Strike rate',
        gameSpecificDetails: {
            Awakening: '+10% to Dual Strike rate',
        }
    },
    'Charm': {
        name: 'Charm',
        description: '+5 Hit rate and +5 Avoid to all allies within a 3 tile radius',
        gameSpecificDetails: {
            Awakening: '+5 Hit rate and +5 Avoid to all allies within a 3 tile radius',
        }
    },
    'Aether': {
        name: 'Aether',
        description: 'Two consecutive strikes; first has Sol effect, second a Luna effect',
        gameSpecificDetails: {
            Awakening: 'Two consecutive strikes; first has Sol effect, second a Luna effect',
        }
    },
    'Rightful King': {
        name: 'Rightful King',
        description: '+10% to skill activation rates',
        gameSpecificDetails: {
            Awakening: '+10% to skill activation rates',
        }
    },
    'Veteran': {
        name: 'Veteran',
        description: '×1.5 experience gain while paired up',
        gameSpecificDetails: {
            Awakening: '×1.5 experience gain while paired up',
        }
    },
    'Solidarity': {
        name: 'Solidarity',
        description: '+10 Critical and +10 Dodge to all adjacent allies',
        gameSpecificDetails: {
            Awakening: '+10 Critical and +10 Dodge to all adjacent allies',
        }
    },
    'Ignis': {
        name: 'Ignis',
        description: 'Physical attacks: Adds half of the Magic stat to StrengthMagic attacks: Adds half of the Strength stat to Magic',
        gameSpecificDetails: {
            Awakening: 'Physical attacks: Adds half of the Magic stat to StrengthMagic attacks: Adds half of the Strength stat to Magic',
        }
    },
    'Rally Spectrum': {
        name: 'Rally Spectrum',
        description: '+4 all stats to all allies within a 3 square radius on command',
        gameSpecificDetails: {
            Awakening: '+4 all stats to all allies within a 3 square radius on command',
        }
    },
    'Discipline': {
        name: 'Discipline',
        description: '×2 weapon experience',
        gameSpecificDetails: {
            Awakening: '×2 weapon experience',
        }
    },
    'Outdoor Fighter': {
        name: 'Outdoor Fighter',
        description: '+10 Hit rate and +10 Avoid while outdoors',
        gameSpecificDetails: {
            Awakening: '+10 Hit rate and +10 Avoid while outdoors',
        }
    },
    'Defender': {
        name: 'Defender',
        description: '+1 all stats while paired up',
        gameSpecificDetails: {
            Awakening: '+1 all stats while paired up',
        }
    },
    'Aegis': {
        name: 'Aegis',
        description: 'Halves damage done by bows, tomes, and dragonstones',
        gameSpecificDetails: {
            Awakening: 'Halves damage done by bows, tomes, and dragonstones',
        }
    },
    'Luna': {
        name: 'Luna',
        description: 'Halves enemy\'s Defense or Resistance',
        procCondition: 'Upon attacking.',
        procChance: 'Skill%',
        gameSpecificDetails: {
            Awakening: 'Halves enemy\'s Defense or Resistance',
        }
    },
    'Dual Guard+': {
        name: 'Dual Guard+',
        description: '+10% to Dual Guard rate',
        gameSpecificDetails: {
            Awakening: '+10% to Dual Guard rate',
        }
    },
    'Defense +2': {
        name: 'Defense +2',
        description: '+2 Defense',
        gameSpecificDetails: {
            Awakening: '+2 Defense',
        }
    },
    'Indoor Fighter': {
        name: 'Indoor Fighter',
        description: '+10 Hit rate and +10 Avoid while indoors',
        gameSpecificDetails: {
            Awakening: '+10 Hit rate and +10 Avoid while indoors',
        }
    },
    'Rally Defense': {
        name: 'Rally Defense',
        description: '+4 Defense to all allies within a 3 square radius on command',
        gameSpecificDetails: {
            Awakening: '+4 Defense to all allies within a 3 square radius on command',
        }
    },
    'Pavise': {
        name: 'Pavise',
        description: 'Halves damage done by swords, lances, axes, beaststones, and blights',
        gameSpecificDetails: {
            Awakening: 'Halves damage done by swords, lances, axes, beaststones, and blights',
        }
    },
    'Avoid +10': {
        name: 'Avoid +10',
        description: '+10 Avoid',
        gameSpecificDetails: {
            Awakening: '+10 Avoid',
        }
    },
    'Vantage': {
        name: 'Vantage',
        description: 'Attack first during enemy phase when HP is half or below',
        gameSpecificDetails: {
            Awakening: 'Attack first during enemy phase when HP is half or below',
        }
    },
    'Astra': {
        name: 'Astra',
        description: '5 consecutive strikes at half damage',
        gameSpecificDetails: {
            Awakening: '5 consecutive strikes at half damage',
        }
    },
    'Swordfaire': {
        name: 'Swordfaire',
        description: '+5 Strength with a sword equipped(+5 Magic with a Levin Sword)',
        gameSpecificDetails: {
            Awakening: '+5 Strength with a sword equipped(+5 Magic with a Levin Sword)',
        }
    },
    'Armsthrift': {
        name: 'Armsthrift',
        description: 'Doesn\'t reduce durability',
        gameSpecificDetails: {
            Awakening: 'Doesn\'t reduce durability',
        }
    },
    'Patience': {
        name: 'Patience',
        description: '+10 Hit rate and +10 Avoid during enemy phase',
        gameSpecificDetails: {
            Awakening: '+10 Hit rate and +10 Avoid during enemy phase',
        }
    },
    'Sol': {
        name: 'Sol',
        description: 'Heal HP equal to half damage',
        gameSpecificDetails: {
            Awakening: 'Heal HP equal to half damage',
        }
    },
    'Axebreaker': {
        name: 'Axebreaker',
        description: '+50 Hit rate and +50 Avoid against enemies equipping an axe',
        gameSpecificDetails: {
            Awakening: '+50 Hit rate and +50 Avoid against enemies equipping an axe',
        }
    },
    'HP +5': {
        name: 'HP +5',
        description: '+5 maximum HP',
        gameSpecificDetails: {
            Awakening: '+5 maximum HP',
        }
    },
    'Zeal': {
        name: 'Zeal',
        description: '+5 Critical',
        gameSpecificDetails: {
            Awakening: '+5 Critical',
        }
    },
    'Rally Strength': {
        name: 'Rally Strength',
        description: '+4 Strength to all allies within a 3 square radius on command',
        gameSpecificDetails: {
            Awakening: '+4 Strength to all allies within a 3 square radius on command',
        }
    },
    'Counter': {
        name: 'Counter',
        description: 'Deals non-lethal damage against holder back against opponent',
        gameSpecificDetails: {
            Awakening: 'Deals non-lethal damage against holder back against opponent',
        }
    },
    'Despoil': {
        name: 'Despoil',
        description: 'Obtain a Bullion (S) upon killing an enemy',
        gameSpecificDetails: {
            Awakening: 'Obtain a Bullion (S) upon killing an enemy',
        }
    },
    'Gamble': {
        name: 'Gamble',
        description: '-5 Hit rate, +10 Critical',
        gameSpecificDetails: {
            Awakening: '-5 Hit rate, +10 Critical',
        }
    },
    'Wrath': {
        name: 'Wrath',
        description: '+20 Critical when HP is at half or below',
        gameSpecificDetails: {
            Awakening: '+20 Critical when HP is at half or below',
        }
    },
    'Axefaire': {
        name: 'Axefaire',
        description: '+5 Strength with an axe equipped(+5 Magic with a Bolt Axe)',
        gameSpecificDetails: {
            Awakening: '+5 Strength with an axe equipped(+5 Magic with a Bolt Axe)',
        }
    },
    'Skill +2': {
        name: 'Skill +2',
        description: '+2 Skill',
        gameSpecificDetails: {
            Awakening: '+2 Skill',
        }
    },
    'Prescience': {
        name: 'Prescience',
        description: '+15 Hit rate and +15 Avoid during player phase',
        gameSpecificDetails: {
            Awakening: '+15 Hit rate and +15 Avoid during player phase',
        }
    },
    'Hit Rate +20': {
        name: 'Hit Rate +20',
        description: '+20 Hit rate',
        gameSpecificDetails: {
            Awakening: '+20 Hit rate',
        }
    },
    'Bowfaire': {
        name: 'Bowfaire',
        description: '+5 Strength with a bow equipped',
        gameSpecificDetails: {
            Awakening: '+5 Strength with a bow equipped',
        }
    },
    'Rally Skill': {
        name: 'Rally Skill',
        description: '+4 Skill to all allies within a 3 square radius on command',
        gameSpecificDetails: {
            Awakening: '+4 Skill to all allies within a 3 square radius on command',
        }
    },
    'Bowbreaker': {
        name: 'Bowbreaker',
        description: '+50 Hit rate and +50 Avoid against enemies equipping a bow',
        gameSpecificDetails: {
            Awakening: '+50 Hit rate and +50 Avoid against enemies equipping a bow',
        }
    },

    'Movement +1': {
        name: 'Movement +1',
        description: '+1 Movement',
        gameSpecificDetails: {
            Awakening: '+1 Movement',
        }
    },
    'Lethality': {
        name: 'Lethality',
        description: 'Instantly defeats the enemy',
        gameSpecificDetails: {
            Awakening: 'Instantly defeats the enemy',
        }
    },
    'Pass': {
        name: 'Pass',
        description: 'Pass through enemy-occupied tiles',
        gameSpecificDetails: {
            Awakening: 'Pass through enemy-occupied tiles',
        }
    },
    'Lucky Seven': {
        name: 'Lucky Seven',
        description: '+20 Hit rate and +20 Avoid during first seven turns',
        gameSpecificDetails: {
            Awakening: '+20 Hit rate and +20 Avoid during first seven turns',
        }
    },
    'Acrobat': {
        name: 'Acrobat',
        description: 'Traverse all traversable terrain as if it were a plain',
        gameSpecificDetails: {
            Awakening: 'Traverse all traversable terrain as if it were a plain',
        }
    },
    'Speed +2': {
        name: 'Speed +2',
        description: '+2 Speed',
        gameSpecificDetails: {
            Awakening: '+2 Speed',
        }
    },
    'Relief': {
        name: 'Relief',
        description: 'Heal 20% HP at the start of a turn if no units are within three spaces',
        gameSpecificDetails: {
            Awakening: 'Heal 20% HP at the start of a turn if no units are within three spaces',
        }
    },
    'Rally Speed': {
        name: 'Rally Speed',
        description: '+4 Speed to all allies within a 3 square radius on command',
        gameSpecificDetails: {
            Awakening: '+4 Speed to all allies within a 3 square radius on command',
        }
    },
    'Lancefaire': {
        name: 'Lancefaire',
        description: '+5 Strength with a lance equipped(+5 Magic with a Shockstick)',
        gameSpecificDetails: {
            Awakening: '+5 Strength with a lance equipped(+5 Magic with a Shockstick)',
        }
    },
    'Rally Movement': {
        name: 'Rally Movement',
        description: '+1 Movement to all allies within a 3 square radius on command',
        gameSpecificDetails: {
            Awakening: '+1 Movement to all allies within a 3 square radius on command',
        }
    },
    'Galeforce': {
        name: 'Galeforce',
        description: 'Grants another full action to a unit upon defeating an enemy once per turn',
        gameSpecificDetails: {
            Awakening: 'Grants another full action to a unit upon defeating an enemy once per turn',
        }
    },
    'Strength +2': {
        name: 'Strength +2',
        description: '+2 Strength',
        gameSpecificDetails: {
            Awakening: '+2 Strength',
        }
    },
    'Tantivy': {
        name: 'Tantivy',
        description: '+10 Hit rate and +10 Avoid with no allies within a 3 square radius',
        gameSpecificDetails: {
            Awakening: '+10 Hit rate and +10 Avoid with no allies within a 3 square radius',
        }
    },
    'Quick Burn': {
        name: 'Quick Burn',
        description: '+15 Hit rate and +15 Avoid at start of chapter-1 to both stats for each successive turn',
        gameSpecificDetails: {
            Awakening: '+15 Hit rate and +15 Avoid at start of chapter-1 to both stats for each successive turn',
        }
    },
    'Swordbreaker': {
        name: 'Swordbreaker',
        description: '+50 Hit rate and +50 Avoid against enemies equipping a sword',
        gameSpecificDetails: {
            Awakening: '+50 Hit rate and +50 Avoid against enemies equipping a sword',
        }
    },
    'Deliverer': {
        name: 'Deliverer',
        description: '+2 Movement when paired up',
        gameSpecificDetails: {
            Awakening: '+2 Movement when paired up',
        }
    },
    'Lancebreaker': {
        name: 'Lancebreaker',
        description: '+50 Hit rate and +50 Avoid against enemies equipping a lance',
        gameSpecificDetails: {
            Awakening: '+50 Hit rate and +50 Avoid against enemies equipping a lance',
        }
    },
    'Magic +2': {
        name: 'Magic +2',
        description: '+2 Magic',
        gameSpecificDetails: {
            Awakening: '+2 Magic',
        }
    },
    'Focus': {
        name: 'Focus',
        description: '+10 Critical with no allies within a 3 square radius',
        gameSpecificDetails: {
            Awakening: '+10 Critical with no allies within a 3 square radius',
        }
    },
    'Rally Magic': {
        name: 'Rally Magic',
        description: '+4 Magic to all allies within a 3 square radius on command',
        gameSpecificDetails: {
            Awakening: '+4 Magic to all allies within a 3 square radius on command',
        }
    },
    'Tomefaire': {
        name: 'Tomefaire',
        description: '+5 Magic with a tome equipped',
        gameSpecificDetails: {
            Awakening: '+5 Magic with a tome equipped',
        }
    },
    'Hex': {
        name: 'Hex',
        description: '-15 Avoid to adjacent enemies',
        gameSpecificDetails: {
            Awakening: '-15 Avoid to adjacent enemies',
        }
    },
    'Anathema': {
        name: 'Anathema',
        description: '-10 Avoid and -10 Dodge to all enemies within a 3 square radius',
        gameSpecificDetails: {
            Awakening: '-10 Avoid and -10 Dodge to all enemies within a 3 square radius',
        }
    },
    'Vengeance': {
        name: 'Vengeance',
        description: 'Increases damage output by half of damage taken',
        gameSpecificDetails: {
            Awakening: 'Increases damage output by half of damage taken',
        }
    },
    'Tomebreaker': {
        name: 'Tomebreaker',
        description: '+50 Hit rate and +50 Avoid against enemies equipping a tome',
        gameSpecificDetails: {
            Awakening: '+50 Hit rate and +50 Avoid against enemies equipping a tome',
        }
    },
    'Slow Burn': {
        name: 'Slow Burn',
        description: '+1 Hit rate and +1 Avoid per turnEffects cap at 15 turns',
        gameSpecificDetails: {
            Awakening: '+1 Hit rate and +1 Avoid per turnEffects cap at 15 turns',
        }
    },
    'Lifetaker': {
        name: 'Lifetaker',
        description: 'Heals 50% HP upon defeating an enemy during player phase',
        gameSpecificDetails: {
            Awakening: 'Heals 50% HP upon defeating an enemy during player phase',
        }
    },
    'Miracle': {
        name: 'Miracle',
        description: 'Survives an otherwise-lethal attack with 1 HP if user didn\'t already have only 1 HP',
        gameSpecificDetails: {
            Awakening: 'Survives an otherwise-lethal attack with 1 HP if user didn\'t already have only 1 HP',
        }
    },
    'Healtouch': {
        name: 'Healtouch',
        description: '+5 HP healed with a staff',
        gameSpecificDetails: {
            Awakening: '+5 HP healed with a staff',
        }
    },
    'Rally Luck': {
        name: 'Rally Luck',
        description: '+8 Luck to all allies within a 3 square radius on command',
        gameSpecificDetails: {
            Awakening: '+8 Luck to all allies within a 3 square radius on command',
        }
    },
    'Renewal': {
        name: 'Renewal',
        description: 'Heals 30% HP at the start of a turn',
        gameSpecificDetails: {
            Awakening: 'Heals 30% HP at the start of a turn',
        }
    },
    'Resistance +2': {
        name: 'Resistance +2',
        description: '+2 Resistance',
        gameSpecificDetails: {
            Awakening: '+2 Resistance',
        }
    },
    'Demoiselle': {
        name: 'Demoiselle',
        description: '+10 Avoid and +10 Dodge to all male allies within 3 spaces',
        gameSpecificDetails: {
            Awakening: '+10 Avoid and +10 Dodge to all male allies within 3 spaces',
        }
    },
    'Rally Resistance': {
        name: 'Rally Resistance',
        description: '+4 Resistance to all allies within a 3 square radius on command',
        gameSpecificDetails: {
            Awakening: '+4 Resistance to all allies within a 3 square radius on command',
        }
    },
    'Dual Support+': {
        name: 'Dual Support+',
        description: 'Increases the support bonus effect',
        gameSpecificDetails: {
            Awakening: 'Increases the support bonus effect',
        }
    },
    'Aptitude': {
        name: 'Aptitude',
        description: '+20 to all Growth rates',
        gameSpecificDetails: {
            Awakening: '+20 to all Growth rates',
        }
    },
    'Underdog': {
        name: 'Underdog',
        description: '+15 Hit rate and +15 Avoid when opponent\'s level is higher(Advanced classes: Add 20 to level)',
        gameSpecificDetails: {
            Awakening: '+15 Hit rate and +15 Avoid when opponent\'s level is higher(Advanced classes: Add 20 to level)',
        }
    },
    'Luck +4': {
        name: 'Luck +4',
        description: '+4 Luck',
        gameSpecificDetails: {
            Awakening: '+4 Luck',
        }
    },
    'Special Dance': {
        name: 'Special Dance',
        description: '+2 to each of Strength, Magic, Defense, and Resistance to unit receiving the dance effect',
        gameSpecificDetails: {
            Awakening: '+2 to each of Strength, Magic, Defense, and Resistance to unit receiving the dance effect',
        }
    },
    'Even Rhythm': {
        name: 'Even Rhythm',
        description: '+10 Hit rate and +10 Avoid on even-numbered turns',
        gameSpecificDetails: {
            Awakening: '+10 Hit rate and +10 Avoid on even-numbered turns',
        }
    },
    'Beastbane': {
        name: 'Beastbane',
        description: 'Deals bonus damage to beast units while in the Taguel class',
        gameSpecificDetails: {
            Awakening: 'Deals bonus damage to beast units while in the Taguel class',
        }
    },
    'Odd Rhythm': {
        name: 'Odd Rhythm',
        description: '+10 Hit rate and +10 Avoid on odd-numbered turns',
        gameSpecificDetails: {
            Awakening: '+10 Hit rate and +10 Avoid on odd-numbered turns',
        }
    },
    'Wyrmsbane': {
        name: 'Wyrmsbane',
        description: 'Deals bonus damage to dragon units while in the Manakete class',
        gameSpecificDetails: {
            Awakening: 'Deals bonus damage to dragon units while in the Manakete class',
        }
    },
    'Shadowgift': {
        name: 'Shadowgift',
        description: 'Allows wielding of dark tomes in any tome-wielding class',
        gameSpecificDetails: {
            Awakening: 'Allows wielding of dark tomes in any tome-wielding class',
        }
    },
    'Conquest': {
        name: 'Conquest',
        description: 'Negates bonus damage weaknesses when equipped by a beast or armor unit',
        gameSpecificDetails: {
            Awakening: 'Negates bonus damage weaknesses when equipped by a beast or armor unit',
        }
    },
    'Resistance +10': {
        name: 'Resistance +10',
        description: '+10 Resistance',
        gameSpecificDetails: {
            Awakening: '+10 Resistance',
        }
    },
    'Aggressor': {
        name: 'Aggressor',
        description: '+10 Attack during player phase',
        gameSpecificDetails: {
            Awakening: '+10 Attack during player phase',
        }
    },
    'Rally Heart': {
        name: 'Rally Heart',
        description: '+1 Movement and +2 all other stats to all allies within a 3-square radius on command',
        gameSpecificDetails: {
            Awakening: '+1 Movement and +2 all other stats to all allies within a 3-square radius on command',
        }
    },
    'Bond': {
        name: 'Bond',
        description: 'Heals 10 HP to all allies within a 3-square radius at the start of the turn',
        gameSpecificDetails: {
            Awakening: 'Heals 10 HP to all allies within a 3-square radius at the start of the turn',
        }
    },
    'All Stats +2': {
        name: 'All Stats +2',
        description: '+2 All stats',
        gameSpecificDetails: {
            Awakening: '+2 All stats',
        }
    },
    'Paragon': {
        name: 'Paragon',
        description: '×2 experience gain',
        gameSpecificDetails: {
            Awakening: '×2 experience gain',
        }
    },
    'Iote\'s Shield': {
        name: 'Iote\'s Shield',
        description: 'Negates bonus damage weakness when equipped by a flying unit',
    },
    'Limit Breaker': {
        name: 'Limit Breaker',
        description: '+10 to all stat caps',
        gameSpecificDetails: {
            Awakening: '+10 to all stat caps',
        }
    },
    'Dragonskin': {
        name: 'Dragonskin',
        description: 'Halves all damage, negates Counter and Lethality',
        gameSpecificDetails: {
            Awakening: 'Halves all damage, negates Counter and Lethality',
        }
    },
    'Hit Rate +10': {
        name: 'Hit Rate +10',
        description: '+10 Hit rate',
        gameSpecificDetails: {
            Awakening: '+10 Hit rate',
        }
    },
    'Rightful God': {
        name: 'Rightful God',
        description: '+30 to skill activation rates',
        gameSpecificDetails: {
            Awakening: '+30 to skill activation rates',
        }
    },
    'Vantage+': {
        name: 'Vantage+',
        description: 'Always move before opponent',
        gameSpecificDetails: {
            Awakening: 'Always move before opponent',
        }
    },
    'Luna+': {
        name: 'Luna+',
        description: 'All attacks have the Luna effect',
        gameSpecificDetails: {
            Awakening: 'All attacks have the Luna effect',
        }
    },
    'Hawkeye': {
        name: 'Hawkeye',
        description: 'Attacks strike without fail',
        gameSpecificDetails: {
            Awakening: 'Attacks strike without fail',
        }
    },
    'Pavise+': {
        name: 'Pavise+',
        description: 'Always halves damage done by swords, lances, axes, and beaststones',
        gameSpecificDetails: {
            Awakening: 'Always halves damage done by swords, lances, axes, and beaststones',
        }
    },
    'Aegis+': {
        name: 'Aegis+',
        description: 'Always halves damage done by bows, tomes, and dragonstones',
        gameSpecificDetails: {
            Awakening: 'Always halves damage done by bows, tomes, and dragonstones',
        }
    },
};

export function getAbilityByName(name: string): AbilityData | undefined {
    const cleanName = name.replace(/\s*\(Lv\.\s*\d+\)\s*$/, '');
    return abilityDefinitions[cleanName];
}
