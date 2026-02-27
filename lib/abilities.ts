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
};

export function getAbilityByName(name: string): AbilityData | undefined {
    return abilityDefinitions[name];
}
