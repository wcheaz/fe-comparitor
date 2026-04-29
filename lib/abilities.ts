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
        description: 'Open doors and chests without the need of keys',
        gameSpecificDetails: {
            Awakening: 'Open doors and chests without the need of keys',
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
        description: 'Adds 10% to the Dual Strike rate',
        gameSpecificDetails: {
            Awakening: 'Adds 10% to the Dual Strike rate',
        }
    },
    'Charm': {
        name: 'Charm',
        description: 'Hit rate and Avoid +5 to all allies within a 3 tile radius',
        gameSpecificDetails: {
            Awakening: 'Hit rate and Avoid +5 to all allies within a 3 tile radius',
        }
    },
    'Aether': {
        name: 'Aether',
        description: 'Attack twice consecutively, with the first strike having a Sol effect and the second strike having a Luna effect',
        procCondition: 'Upon attacking.',
        procChance: 'Skill / 2%',
        gameSpecificDetails: {
            Awakening: 'Attack twice consecutively, with the first strike having a Sol effect and the second strike having a Luna effect',
        }
    },
    'Rightful King': {
        name: 'Rightful King',
        description: 'Adds 10% to Skill activation rates',
        gameSpecificDetails: {
            Awakening: 'Adds 10% to Skill activation rates',
        }
    },
    'Veteran': {
        name: 'Veteran',
        description: 'Experience gain x 1.5 when paired up',
        gameSpecificDetails: {
            Awakening: 'Experience gain x 1.5 when paired up',
        }
    },
    'Solidarity': {
        name: 'Solidarity',
        description: 'Critical and Critical Avoid +10 to adjacent allies',
        gameSpecificDetails: {
            Awakening: 'Critical and Critical Avoid +10 to adjacent allies',
        }
    },
    'Ignis': {
        name: 'Ignis',
        description: 'Adds (Magic)/2 to Strength when dealing physical damage and (Strength)/2 to Magic when dealing magical damage',
        procCondition: 'Upon attacking.',
        procChance: 'Skill%',
        gameSpecificDetails: {
            Awakening: 'Adds (Magic)/2 to Strength when dealing physical damage and (Strength)/2 to Magic when dealing magical damage',
        }
    },
    'Rally Spectrum': {
        name: 'Rally Spectrum',
        description: 'All stats +4 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        gameSpecificDetails: {
            Awakening: 'All stats +4 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        }
    },
    'Discipline': {
        name: 'Discipline',
        description: 'Weapon experience x2',
        gameSpecificDetails: {
            Awakening: 'Weapon experience x2',
        }
    },
    'Outdoor Fighter': {
        name: 'Outdoor Fighter',
        description: 'Hit rate and Avoid +10 when fighting outdoors',
        gameSpecificDetails: {
            Awakening: 'Hit rate and Avoid +10 when fighting outdoors',
        }
    },
    'Defender': {
        name: 'Defender',
        description: 'All stats +1 when paired up',
        gameSpecificDetails: {
            Awakening: 'All stats +1 when paired up',
        }
    },
    'Aegis': {
        name: 'Aegis',
        description: 'Halves damage from bows, tomes and dragonstones',
        procCondition: 'Upon being attacked.',
        procChance: 'Skill%',
        gameSpecificDetails: {
            Awakening: 'Halves damage from bows, tomes and dragonstones (does not apply for Dual Strikes)',
        }
    },
    'Luna': {
        name: 'Luna',
        description: 'Ignores half the enemy\'s Defence or Resistance',
        procCondition: 'Upon attacking.',
        procChance: 'Skill%',
        gameSpecificDetails: {
            Awakening: 'Ignores half the enemy\'s Defence or Resistance',
        }
    },
    'Dual Guard+': {
        name: 'Dual Guard+',
        description: 'Adds 10% to the Dual Guard rate',
        gameSpecificDetails: {
            Awakening: 'Adds 10% to the Dual Guard rate',
        }
    },
    'Defense +2': {
        name: 'Defense +2',
        description: 'Defence +2',
        gameSpecificDetails: {
            Awakening: 'Defence +2',
        }
    },
    'Indoor Fighter': {
        name: 'Indoor Fighter',
        description: 'Hit rate and Avoid +10 when fighting indoors',
        gameSpecificDetails: {
            Awakening: 'Hit rate and Avoid +10 when fighting indoors',
        }
    },
    'Rally Defense': {
        name: 'Rally Defense',
        description: 'Defence +4 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        gameSpecificDetails: {
            Awakening: 'Defence +4 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        }
    },
    'Pavise': {
        name: 'Pavise',
        description: 'Halves damage from swords, lances, axes (includes magical variants) and beaststones',
        procCondition: 'Upon being attacked.',
        procChance: 'Skill%',
        gameSpecificDetails: {
            Awakening: 'Halves damage from swords, lances, axes (includes magical variants) and beaststones (does not apply for Dual Strikes)',
        }
    },
    'Avoid +10': {
        name: 'Avoid +10',
        description: 'Avoid +10',
        gameSpecificDetails: {
            Awakening: 'Avoid +10',
        }
    },
    'Vantage': {
        name: 'Vantage',
        description: 'When HP under half, always attack first during the enemy\'s Turn',
        gameSpecificDetails: {
            Awakening: 'When HP under half, always attack first during the enemy\'s Turn',
        }
    },
    'Astra': {
        name: 'Astra',
        description: 'Deals 5 consecutive hits with half damage',
        procCondition: 'Upon attacking.',
        procChance: 'Skill / 2%',
        gameSpecificDetails: {
            Awakening: 'Deals 5 consecutive hits with half damage',
        }
    },
    'Swordfaire': {
        name: 'Swordfaire',
        description: 'Strength +5 when equipped with a sword (Magic +5 when equipped with the Levin Sword)',
        gameSpecificDetails: {
            Awakening: 'Strength +5 when equipped with a sword (Magic +5 when equipped with the Levin Sword)',
        }
    },
    'Armsthrift': {
        name: 'Armsthrift',
        description: 'Attack does not reduce weapon durability',
        procCondition: 'Upon attacking.',
        procChance: 'Luck × 2%',
        gameSpecificDetails: {
            Awakening: 'Attack does not reduce weapon durability',
        }
    },
    'Patience': {
        name: 'Patience',
        description: 'Hit rate and Avoid +10 during the enemy\'s Turn',
        gameSpecificDetails: {
            Awakening: 'Hit rate and Avoid +10 during the enemy\'s Turn',
        }
    },
    'Sol': {
        name: 'Sol',
        description: 'Recover HP equal to half the damage dealt to the enemy',
        procCondition: 'Upon attacking.',
        procChance: 'Skill%',
        gameSpecificDetails: {
            Awakening: 'Recover HP equal to half the damage dealt to the enemy',
        }
    },
    'Axebreaker': {
        name: 'Axebreaker',
        description: 'Hit rate and Avoid +50 when the enemy is equipped with an axe',
        gameSpecificDetails: {
            Awakening: 'Hit rate and Avoid +50 when the enemy is equipped with an axe',
        }
    },
    'HP +5': {
        name: 'HP +5',
        description: 'Maximum HP +5',
        gameSpecificDetails: {
            Awakening: 'Maximum HP +5',
        }
    },
    'Zeal': {
        name: 'Zeal',
        description: 'Critical +5',
        gameSpecificDetails: {
            Awakening: 'Critical +5',
        }
    },
    'Rally Strength': {
        name: 'Rally Strength',
        description: 'Strength +4 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        gameSpecificDetails: {
            Awakening: 'Strength +4 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        }
    },
    'Counter': {
        name: 'Counter',
        description: 'Returns damage when attacked by an adjacent enemy (except damage that KOs the user)',
        gameSpecificDetails: {
            Awakening: 'Returns damage when attacked by an adjacent enemy (except damage that KOs the user) (does not apply for Dual Strikes)',
        }
    },
    'Despoil': {
        name: 'Despoil',
        description: 'Obtain Bullion (S) from the enemy if the user defeats the enemy',
        procCondition: 'Upon defeating an enemy.',
        procChance: 'Luck%',
        gameSpecificDetails: {
            Awakening: 'Obtain Bullion (S) from the enemy if the user defeats the enemy',
        }
    },
    'Gamble': {
        name: 'Gamble',
        description: 'Hit rate -5, Critical +10',
        gameSpecificDetails: {
            Awakening: 'Hit rate -5, Critical +10',
        }
    },
    'Wrath': {
        name: 'Wrath',
        description: 'Critical +20 when under half HP',
        gameSpecificDetails: {
            Awakening: 'Critical +20 when under half HP',
        }
    },
    'Axefaire': {
        name: 'Axefaire',
        description: 'Strength +5 when equipped with an axe (Magic +5 when equipped with the Bolt Axe)',
        gameSpecificDetails: {
            Awakening: 'Strength +5 when equipped with an axe (Magic +5 when equipped with the Bolt Axe)',
        }
    },
    'Skill +2': {
        name: 'Skill +2',
        description: 'Skill +2',
        gameSpecificDetails: {
            Awakening: 'Skill +2',
        }
    },
    'Prescience': {
        name: 'Prescience',
        description: 'Hit rate and Avoid +15 during the user\'s Turn',
        gameSpecificDetails: {
            Awakening: 'Hit rate and Avoid +15 during the user\'s Turn',
        }
    },
    'Hit Rate +20': {
        name: 'Hit Rate +20',
        description: 'Hit rate +20',
        gameSpecificDetails: {
            Awakening: 'Hit rate +20',
        }
    },
    'Bowfaire': {
        name: 'Bowfaire',
        description: 'Strength +5 when equipped with a bow',
        gameSpecificDetails: {
            Awakening: 'Strength +5 when equipped with a bow',
        }
    },
    'Rally Skill': {
        name: 'Rally Skill',
        description: 'Skill +4 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        gameSpecificDetails: {
            Awakening: 'Skill +4 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        }
    },
    'Bowbreaker': {
        name: 'Bowbreaker',
        description: 'Hit rate and Avoid +50 when the enemy is equipped with a bow',
        gameSpecificDetails: {
            Awakening: 'Hit rate and Avoid +50 when the enemy is equipped with a bow',
        }
    },
    'Movement +1': {
        name: 'Movement +1',
        description: 'Movement +1',
        gameSpecificDetails: {
            Awakening: 'Movement +1',
        }
    },
    'Lethality': {
        name: 'Lethality',
        description: 'Instantly defeats the enemy',
        procCondition: 'Upon attacking.',
        procChance: 'Skill / 4%',
        gameSpecificDetails: {
            Awakening: 'Instantly defeats the enemy',
        }
    },
    'Pass': {
        name: 'Pass',
        description: 'User can pass through tiles occupied by enemy units',
        gameSpecificDetails: {
            Awakening: 'User can pass through tiles occupied by enemy units',
        }
    },
    'Lucky Seven': {
        name: 'Lucky Seven',
        description: 'Hit rate and Avoid +20 up to the 7th Turn',
        gameSpecificDetails: {
            Awakening: 'Hit rate and Avoid +20 up to the 7th Turn',
        }
    },
    'Acrobat': {
        name: 'Acrobat',
        description: 'All traversable terrain costs 1 movement point to cross',
        gameSpecificDetails: {
            Awakening: 'All traversable terrain costs 1 movement point to cross',
        }
    },
    'Speed +2': {
        name: 'Speed +2',
        description: 'Speed +2',
        gameSpecificDetails: {
            Awakening: 'Speed +2',
        }
    },
    'Relief': {
        name: 'Relief',
        description: 'Recover 20% HP at the start of the user\'s Turn if no units are within a 3 tile radius',
        gameSpecificDetails: {
            Awakening: 'Recover 20% HP at the start of the user\'s Turn if no units are within a 3 tile radius',
        }
    },
    'Rally Speed': {
        name: 'Rally Speed',
        description: 'Speed +4 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        gameSpecificDetails: {
            Awakening: 'Speed +4 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        }
    },
    'Lancefaire': {
        name: 'Lancefaire',
        description: 'Strength +5 when equipped with a lance (Magic +5 when equipped with the Shockstick)',
        gameSpecificDetails: {
            Awakening: 'Strength +5 when equipped with a lance (Magic +5 when equipped with the Shockstick)',
        }
    },
    'Rally Movement': {
        name: 'Rally Movement',
        description: 'Movement +1 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        gameSpecificDetails: {
            Awakening: 'Movement +1 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        }
    },
    'Galeforce': {
        name: 'Galeforce',
        description: 'Allows the user another full action after they defeat an enemy during the user\'s Turn (only once per Turn)',
        gameSpecificDetails: {
            Awakening: 'Allows the user another full action after they defeat an enemy during the user\'s Turn (only once per Turn)',
        }
    },
    'Strength +2': {
        name: 'Strength +2',
        description: 'Strength +2',
        gameSpecificDetails: {
            Awakening: 'Strength +2',
        }
    },
    'Tantivy': {
        name: 'Tantivy',
        description: 'Hit rate and Avoid +10 if no allies within a 3 tile radius',
        gameSpecificDetails: {
            Awakening: 'Hit rate and Avoid +10 if no allies within a 3 tile radius',
        }
    },
    'Quick Burn': {
        name: 'Quick Burn',
        description: 'Hit rate and Avoid +15 at the start of the chapter. Effect decreases with each passing Turn',
        gameSpecificDetails: {
            Awakening: 'Hit rate and Avoid +15 at the start of the chapter. Effect decreases with each passing Turn',
        }
    },
    'Swordbreaker': {
        name: 'Swordbreaker',
        description: 'Hit rate and Avoid +50 when the enemy is equipped with a sword',
        gameSpecificDetails: {
            Awakening: 'Hit rate and Avoid +50 when the enemy is equipped with a sword',
        }
    },
    'Deliverer': {
        name: 'Deliverer',
        description: 'Movement +2 when paired up',
        gameSpecificDetails: {
            Awakening: 'Movement +2 when paired up',
        }
    },
    'Lancebreaker': {
        name: 'Lancebreaker',
        description: 'Hit rate and Avoid +50 when the enemy is equipped with a lance',
        gameSpecificDetails: {
            Awakening: 'Hit rate and Avoid +50 when the enemy is equipped with a lance',
        }
    },
    'Magic +2': {
        name: 'Magic +2',
        description: 'Magic +2',
        gameSpecificDetails: {
            Awakening: 'Magic +2',
        }
    },
    'Focus': {
        name: 'Focus',
        description: 'Critical +10 when no allies within a 3 tile radius',
        gameSpecificDetails: {
            Awakening: 'Critical +10 when no allies within a 3 tile radius',
        }
    },
    'Rally Magic': {
        name: 'Rally Magic',
        description: 'Magic +4 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        gameSpecificDetails: {
            Awakening: 'Magic +4 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        }
    },
    'Tomefaire': {
        name: 'Tomefaire',
        description: 'Magic +5 when equipped with a Tome',
        gameSpecificDetails: {
            Awakening: 'Magic +5 when equipped with a Tome',
        }
    },
    'Hex': {
        name: 'Hex',
        description: 'Avoid -15 to all adjacent enemies',
        gameSpecificDetails: {
            Awakening: 'Avoid -15 to all adjacent enemies',
        }
    },
    'Anathema': {
        name: 'Anathema',
        description: 'Avoid and Critical Avoid -10 to all enemies within a 3 tile radius',
        gameSpecificDetails: {
            Awakening: 'Avoid and Critical Avoid -10 to all enemies within a 3 tile radius',
        }
    },
    'Vengeance': {
        name: 'Vengeance',
        description: 'Deals (user\'s Max HP – Current HP)/2 extra damage',
        procCondition: 'Upon attacking.',
        procChance: 'Skill × 2%',
        gameSpecificDetails: {
            Awakening: 'Deals (user\'s Max HP – Current HP)/2 extra damage',
        }
    },
    'Tomebreaker': {
        name: 'Tomebreaker',
        description: 'Hit rate and Avoid +50 when the enemy is equipped with a tome',
        gameSpecificDetails: {
            Awakening: 'Hit rate and Avoid +50 when the enemy is equipped with a tome',
        }
    },
    'Slow Burn': {
        name: 'Slow Burn',
        description: 'Hit rate and Avoid increases by 1 each Turn, up to the 15th Turn',
        gameSpecificDetails: {
            Awakening: 'Hit rate and Avoid increases by 1 each Turn, up to the 15th Turn',
        }
    },
    'Lifetaker': {
        name: 'Lifetaker',
        description: 'User recovers 50% HP after they defeat an enemy during the user\'s Turn',
        gameSpecificDetails: {
            Awakening: 'User recovers 50% HP after they defeat an enemy during the user\'s Turn',
        }
    },
    'Miracle': {
        name: 'Miracle',
        description: 'Character survives with 1 HP after receiving an attack that would otherwise KO them (must have over 1 HP)',
        procCondition: 'Upon receiving lethal damage.',
        procChance: 'Luck%',
        gameSpecificDetails: {
            Awakening: 'Character survives with 1 HP after receiving an attack that would otherwise KO them (must have over 1 HP)',
        }
    },
    'Healtouch': {
        name: 'Healtouch',
        description: 'Restores an extra 5 HP when healing allies',
        gameSpecificDetails: {
            Awakening: 'Restores an extra 5 HP when healing allies',
        }
    },
    'Rally Luck': {
        name: 'Rally Luck',
        description: 'Luck +8 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        gameSpecificDetails: {
            Awakening: 'Luck +8 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        }
    },
    'Renewal': {
        name: 'Renewal',
        description: 'Recover 30% HP at the start of the user\'s Turn',
        gameSpecificDetails: {
            Awakening: 'Recover 30% HP at the start of the user\'s Turn',
        }
    },
    'Resistance +2': {
        name: 'Resistance +2',
        description: 'Resistance +2',
        gameSpecificDetails: {
            Awakening: 'Resistance +2',
        }
    },
    'Demoiselle': {
        name: 'Demoiselle',
        description: 'Avoid and Critical Avoid +10 to all male allies within a 3 tile radius',
        gameSpecificDetails: {
            Awakening: 'Avoid and Critical Avoid +10 to all male allies within a 3 tile radius',
        }
    },
    'Rally Resistance': {
        name: 'Rally Resistance',
        description: 'Resistance +4 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        gameSpecificDetails: {
            Awakening: 'Resistance +4 to all allies within a 3 tile radius for one Turn when the Rally command is used',
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
        description: 'Adds 20% to all growth rates during Level Ups',
        gameSpecificDetails: {
            Awakening: 'Adds 20% to all growth rates during Level Ups',
        }
    },
    'Underdog': {
        name: 'Underdog',
        description: 'Hit rate and Avoid +15 when user\'s Level is lower than the enemy (promoted units count as Level +20)',
        gameSpecificDetails: {
            Awakening: 'Hit rate and Avoid +15 when user\'s Level is lower than the enemy (promoted units count as Level +20)',
        }
    },
    'Luck +4': {
        name: 'Luck +4',
        description: 'Luck +4',
        gameSpecificDetails: {
            Awakening: 'Luck +4',
        }
    },
    'Special Dance': {
        name: 'Special Dance',
        description: 'Strength, Magic, Defence and Resistance +2 for one Turn for the unit who receives the user\'s Dance',
        gameSpecificDetails: {
            Awakening: 'Strength, Magic, Defence and Resistance +2 for one Turn for the unit who receives the user\'s Dance',
        }
    },
    'Even Rhythm': {
        name: 'Even Rhythm',
        description: 'Hit rate and Avoid +10 during even numbered Turns',
        gameSpecificDetails: {
            Awakening: 'Hit rate and Avoid +10 during even numbered Turns',
        }
    },
    'Beastbane': {
        name: 'Beastbane',
        description: 'Deals effective damage to beast units when user is a Taguel',
        gameSpecificDetails: {
            Awakening: 'Deals effective damage to beast units when user is a Taguel',
        }
    },
    'Odd Rhythm': {
        name: 'Odd Rhythm',
        description: 'Hit rate and Avoid +10 during odd numbered Turns',
        gameSpecificDetails: {
            Awakening: 'Hit rate and Avoid +10 during odd numbered Turns',
        }
    },
    'Wyrmsbane': {
        name: 'Wyrmsbane',
        description: 'Deals effective damage to dragon units when user is a Manakete',
        gameSpecificDetails: {
            Awakening: 'Deals effective damage to dragon units when user is a Manakete',
        }
    },
    'Shadowgift': {
        name: 'Shadowgift',
        description: 'Enables usage of Dark Tomes for Tome wielders',
        gameSpecificDetails: {
            Awakening: 'Enables usage of Dark Tomes for Tome wielders',
        }
    },
    'Conquest': {
        name: 'Conquest',
        description: 'Negates user\'s beast and armour type weaknesses',
        gameSpecificDetails: {
            Awakening: 'Negates user\'s beast and armour type weaknesses',
        }
    },
    'Resistance +10': {
        name: 'Resistance +10',
        description: 'Resistance +10',
        gameSpecificDetails: {
            Awakening: 'Resistance +10',
        }
    },
    'Aggressor': {
        name: 'Aggressor',
        description: 'Attack +10 during the user\'s Turn',
        gameSpecificDetails: {
            Awakening: 'Attack +10 during the user\'s Turn',
        }
    },
    'Rally Heart': {
        name: 'Rally Heart',
        description: 'All stats +2 and Movement +1 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        gameSpecificDetails: {
            Awakening: 'All stats +2 and Movement +1 to all allies within a 3 tile radius for one Turn when the Rally command is used',
        }
    },
    'Bond': {
        name: 'Bond',
        description: 'Restores 10 HP to all allies within a 3 tile radius at the beginning of the user\'s Turn',
        gameSpecificDetails: {
            Awakening: 'Restores 10 HP to all allies within a 3 tile radius at the beginning of the user\'s Turn',
        }
    },
    'All Stats +2': {
        name: 'All Stats +2',
        description: 'Strength, Magic, Skill, Speed, Luck, Defence and Resistance +2',
        gameSpecificDetails: {
            Awakening: 'Strength, Magic, Skill, Speed, Luck, Defence and Resistance +2',
        }
    },
    'Paragon': {
        name: 'Paragon',
        description: 'Experience gain x2',
        gameSpecificDetails: {
            Awakening: 'Experience gain x2',
        }
    },
    'Iote\'s Shield': {
        name: 'Iote\'s Shield',
        description: 'Negates user\'s flying type weakness',
        gameSpecificDetails: {
            Awakening: 'Negates user\'s flying type weakness',
        }
    },
    'Limit Breaker': {
        name: 'Limit Breaker',
        description: 'Raises the character\'s maximum stats by 10',
        gameSpecificDetails: {
            Awakening: 'Raises the character\'s maximum stats by 10',
        }
    },
    'Dragonskin': {
        name: 'Dragonskin',
        description: 'Halves damage, negates Counter and Lethality',
        gameSpecificDetails: {
            Awakening: 'Halves damage, negates Counter and Lethality',
        }
    },
    'Hit Rate +10': {
        name: 'Hit Rate +10',
        description: 'Hit rate +10',
        gameSpecificDetails: {
            Awakening: 'Hit rate +10',
        }
    },
    'Rightful God': {
        name: 'Rightful God',
        description: 'Adds 30% to Skill activation rates',
        gameSpecificDetails: {
            Awakening: 'Adds 30% to Skill activation rates',
        }
    },
    'Vantage+': {
        name: 'Vantage+',
        description: 'Always attack first during the enemy\'s Turn',
        gameSpecificDetails: {
            Awakening: 'Always attack first during the enemy\'s Turn',
        }
    },
    'Luna+': {
        name: 'Luna+',
        description: 'Every attack has a Luna effect',
        gameSpecificDetails: {
            Awakening: 'Every attack has a Luna effect',
        }
    },
    'Hawkeye': {
        name: 'Hawkeye',
        description: 'Attacks always strike the enemy',
        gameSpecificDetails: {
            Awakening: 'Attacks always strike the enemy',
        }
    },
    'Pavise+': {
        name: 'Pavise+',
        description: 'Halves damage from swords, lances, axes (includes magical variants) and beaststones',
        gameSpecificDetails: {
            Awakening: 'Halves damage from swords, lances, axes (includes magical variants) and beaststones (does not apply for Dual Strikes)',
        }
    },
    'Aegis+': {
        name: 'Aegis+',
        description: 'Halves damage from bows, tomes and dragonstones',
        gameSpecificDetails: {
            Awakening: 'Halves damage from bows, tomes and dragonstones (does not apply for Dual Strikes)',
        }
    },
};

export function getAbilityByName(name: string): AbilityData | undefined {
    const cleanName = name.replace(/\s*\(Lv\.\s*\d+\)\s*$/, '');
    return abilityDefinitions[cleanName];
}
