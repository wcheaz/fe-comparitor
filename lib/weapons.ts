export interface Weapon {
    name: string;
    type: string;
    rank: string;
    uses?: number;
    weight: number;
    might: number;
    hit: number;
    crit: number;
    range: string;
    description?: string;
    effectiveAgainst?: string[];
    statBonuses?: Record<string, number>;
}

// Initial database of weapons, focusing on PRF weapons from Binding Blade.
// Stats are based on their Fire Emblem 6 implementation.
const WEAPONS: Record<string, Weapon> = {
    "Rapier": {
        name: "Rapier",
        type: "Sword",
        rank: "Prf",
        uses: 40,
        weight: 5,
        might: 5,
        hit: 95,
        crit: 10,
        range: "1",
        description: "Roy exclusively. Effective against armored and cavalry units.",
        effectiveAgainst: ["Armored", "Cavalry"]
    },
    "Binding Blade": {
        name: "Binding Blade",
        type: "Sword",
        rank: "Prf",
        uses: 20,
        weight: 8,
        might: 18,
        hit: 95,
        crit: 10,
        range: "1-2",
        description: "Roy exclusively. Grants Def/Res +5 when equipped. Can be used as an item to restore HP. Effective against dragons.",
        effectiveAgainst: ["Dragon"],
        statBonuses: {
            def: 5,
            res: 5
        }
    },
    "Eckesachs": {
        name: "Eckesachs",
        type: "Sword",
        rank: "Prf",
        uses: Infinity,
        weight: 15,
        might: 15,
        hit: 90,
        crit: 0,
        range: "1-2",
        description: "Zephiel exclusively."
        // no specific effect in FE6 besides animations and stats
    },
    // Add more as needed
};

export function getWeaponByName(name: string): Weapon | undefined {
    return WEAPONS[name];
}
