export interface MovementData {
    name: string;
    description: string;
    abilities?: string;
    weaknesses?: string;
    gameSpecificDetails?: Record<string, string>;
}

export const movementTypes: Record<string, MovementData> = {
    'Infantry': {
        name: 'Infantry',
        description: 'Standard foot soldiers.',
        gameSpecificDetails: {}
    },
    'Armored': {
        name: 'Armored',
        description: 'Heavily armored foot soldiers.',
        weaknesses: 'Weak to armor-slaying/heavy weapons.',
        gameSpecificDetails: {
            'Engage': '(Engage) Immune to being broken in combat.',
        }
    },
    'Cavalry': {
        name: 'Cavalry',
        description: 'Mounted units on horseback.',
        abilities: 'High movement range on flat terrain.',
        weaknesses: 'Weak to horse-slaying/cavalry weapons.',
        gameSpecificDetails: {
            'The Binding Blade': '(Binding Blade) Canto: May use remaining movement after using a staff, item, trading, rescuing, dropping, talking, or visiting. Cannot move after attacking.',
            'Three Houses': '(Three Houses) Canto: May use remaining movement after any action, including attacking.',
        }
    },
    'Flying': {
        name: 'Flying',
        description: 'Airborne units mounted on pegasi or other flying mounts.',
        abilities: 'Ignores terrain movement costs. Can fly over mountains, water, and gaps.',
        weaknesses: 'Weak to bows and anti-air weapons.',
        gameSpecificDetails: {
            'The Binding Blade': '(Binding Blade) Canto: May use remaining movement after using a staff, item, trading, rescuing, dropping, talking, or visiting. Cannot move after attacking.',
            'Three Houses': '(Three Houses) Canto: May use remaining movement after any action, including attacking.',
            'Engage': '(Engage) Cannot receive defense or avoid bonuses from terrain tiles.'
        }
    },
    'Wyvern': {
        name: 'Wyvern',
        description: 'Airborne units mounted on wyverns.',
        abilities: 'Ignores terrain movement costs. Can fly over mountains, water, and gaps.',
        weaknesses: 'Weak to bows, dragon-slaying weapons, and sometimes wind magic.',
        gameSpecificDetails: {
            'The Binding Blade': '(Binding Blade) Canto: May use remaining movement after using a staff, item, trading, rescuing, dropping, talking, or visiting. Cannot move after attacking.',
            'Three Houses': '(Three Houses) Canto: May use remaining movement after any action, including attacking.',
        }
    },
};

export function getMovementByName(movementType: string): MovementData | undefined {
    return movementTypes[movementType] || movementTypes['Infantry'];
}
