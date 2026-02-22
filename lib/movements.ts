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
        weaknesses: 'Standard terrain penalties (e.g., 2 movement cost for forests, 3 cost for sand/deserts). Cannot cross peaks or deep water.',
        gameSpecificDetails: {}
    },
    'Armor': {
        name: 'Armor',
        description: 'Heavily armored foot soldiers.',
        weaknesses: 'Weak to armor-slaying/heavy weapons. Severe movement penalties on rough terrain (e.g., 3 movement cost for forests).',
        gameSpecificDetails: {
            'Engage': '(Engage) Immune to being broken in combat.',
        }
    },
    'Horse': {
        name: 'Horse',
        description: 'Mounted units on horseback.',
        abilities: 'High movement range on flat terrain.',
        weaknesses: 'Weak to horse-slaying/cavalry weapons. High movement penalties on rough terrain (e.g., 3 movement cost for forests). Cannot cross mountains.',
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
    'Dragon': {
        name: 'Dragon',
        description: 'Manaketes and large reptilian creatures.',
        weaknesses: 'Weak to dragon-slaying weapons.',
        gameSpecificDetails: {}
    }
};

export function getMovementByName(movementType: string): MovementData | undefined {
    return movementTypes[movementType] || movementTypes['Infantry'];
}
