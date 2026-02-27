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

// Initial database of weapons, focusing on PRF weapons from Binding Blade and The Sacred Stones.
// Stats are based on their Fire Emblem 6 and 8 implementations.
const WEAPONS: Record<string, Weapon> = {
    // FE6 - Binding Blade PRF Weapons
    "Rapier (FE6)": {
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
    // FE8 - The Sacred Stones PRF Weapons
    "Rapier": {
        name: "Rapier",
        type: "Sword",
        rank: "Prf",
        uses: 30,
        weight: 4,
        might: 8,
        hit: 100,
        crit: 5,
        range: "1",
        description: "Eirika exclusively. Effective against armored and cavalry units.",
        effectiveAgainst: ["Armored", "Cavalry"]
    },
    "Reginleif": {
        name: "Reginleif",
        type: "Lance",
        rank: "Prf",
        uses: 30,
        weight: 6,
        might: 10,
        hit: 95,
        crit: 5,
        range: "1",
        description: "Ephraim exclusively. Effective against armored and cavalry units.",
        effectiveAgainst: ["Armored", "Cavalry"]
    },
    "Siegmund": {
        name: "Siegmund",
        type: "Lance",
        rank: "Prf",
        uses: 50,
        weight: 12,
        might: 15,
        hit: 90,
        crit: 0,
        range: "1",
        description: "Ephraim exclusively."
    },
    "Audhulma": {
        name: "Audhulma",
        type: "Lance",
        rank: "Prf",
        uses: 30,
        weight: 10,
        might: 20,
        hit: 95,
        crit: 10,
        range: "1-2",
        description: "Ephraim exclusively. Sacred Twin of lightning. Grants Def/Res +5 when equipped.",
        statBonuses: {
            def: 5,
            res: 5
        }
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
    "Excalibur": {
        name: "Excalibur",
        type: "Anima",
        rank: "Prf",
        uses: 30,
        weight: 3,
        might: 14,
        hit: 100,
        crit: 15,
        range: "1-2",
        description: "Lute exclusively. Effective against flying units.",
        effectiveAgainst: ["Flying"]
    },
    "Ivaldi": {
        name: "Ivaldi",
        type: "Anima",
        rank: "Prf",
        uses: 30,
        weight: 8,
        might: 16,
        hit: 100,
        crit: 10,
        range: "1-2",
        description: "Saleh exclusively. Sacred Twin of wind. Grants Res +10 when equipped.",
        statBonuses: {
            res: 10
        }
    },
    "Naglfar": {
        name: "Naglfar",
        type: "Dark",
        rank: "Prf",
        uses: 10,
        weight: 18,
        might: 20,
        hit: 80,
        crit: 5,
        range: "1-2",
        description: "Lyon exclusively."
    },
    "Latona": {
        name: "Latona",
        type: "Staff",
        rank: "Prf",
        uses: 10,
        weight: 1,
        might: 0,
        hit: 100,
        crit: 0,
        range: "1",
        description: "Natasha exclusively. Restores HP to all allies by 20."
    },
    "Vidofnir": {
        name: "Vidofnir",
        type: "Lance",
        rank: "Prf",
        uses: 30,
        weight: 10,
        might: 18,
        hit: 95,
        crit: 10,
        range: "1-2",
        description: "Tana exclusively. Sacred Twin of wind. Grants Spd +10 when equipped.",
        statBonuses: {
            spd: 10
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
    // FE7 - The Blazing Blade PRF Weapons
    "Rapier (FE7)": {
        name: "Rapier",
        type: "Sword",
        rank: "Prf",
        uses: 40,
        weight: 5,
        might: 7,
        hit: 95,
        crit: 10,
        range: "1",
        description: "Eliwood exclusively. Effective against armored and cavalry units.",
        effectiveAgainst: ["Armored", "Cavalry"]
    },
    "Mani Katti": {
        name: "Mani Katti",
        type: "Sword",
        rank: "Prf",
        uses: 45,
        weight: 3,
        might: 8,
        hit: 80,
        crit: 20,
        range: "1",
        description: "Lyn exclusively. Effective against armored and cavalry units.",
        effectiveAgainst: ["Armored", "Cavalry"]
    },
    "Sol Katti": {
        name: "Sol Katti",
        type: "Sword",
        rank: "Prf",
        uses: 30,
        weight: 14,
        might: 12,
        hit: 95,
        crit: 25,
        range: "1",
        description: "Lyn exclusively. Grants Res +5 when equipped. Effective against dragons.",
        effectiveAgainst: ["Dragon"],
        statBonuses: {
            res: 5
        }
    },
    "Durandal": {
        name: "Durandal",
        type: "Sword",
        rank: "Prf",
        uses: 20,
        weight: 16,
        might: 17,
        hit: 90,
        crit: 0,
        range: "1",
        description: "Eliwood exclusively. Grants Str +5 when equipped. Effective against dragons.",
        effectiveAgainst: ["Dragon"],
        statBonuses: {
            str: 5
        }
    },
    "Wolf Beil": {
        name: "Wolf Beil",
        type: "Axe",
        rank: "Prf",
        uses: 30,
        weight: 10,
        might: 10,
        hit: 75,
        crit: 5,
        range: "1",
        description: "Hector exclusively. Effective against armored and cavalry units.",
        effectiveAgainst: ["Armored", "Cavalry"]
    },
    "Armads": {
        name: "Armads",
        type: "Axe",
        rank: "Prf",
        uses: 25,
        weight: 18,
        might: 18,
        hit: 85,
        crit: 0,
        range: "1",
        description: "Hector exclusively. Grants Def +5 when equipped. Effective against dragons.",
        effectiveAgainst: ["Dragon"],
        statBonuses: {
            def: 5
        }
    },
    "Forblaze": {
        name: "Forblaze",
        type: "Anima",
        rank: "Prf",
        uses: 20,
        weight: 11,
        might: 14,
        hit: 85,
        crit: 5,
        range: "1-2",
        description: "Athos exclusively. Grants Lck +5 when equipped. Effective against dragons.",
        effectiveAgainst: ["Dragon"],
        statBonuses: {
            lck: 5
        }
    },
    "Wo Dao (FE6)": {
        name: "Wo Dao",
        type: "Sword",
        rank: "D",
        uses: 20,
        weight: 5,
        might: 8,
        hit: 75,
        crit: 40,
        range: "1",
        description: "Myrmidon and Swordmaster exclusive."
    },
    "Wo Dao (FE7)": {
        name: "Wo Dao",
        type: "Sword",
        rank: "D",
        uses: 20,
        weight: 5,
        might: 8,
        hit: 75,
        crit: 35,
        range: "1",
        description: "Myrmidon, Swordmaster, and Blade Lord (Lyn) exclusive."
    },
    // Add more as needed
};

export function getWeaponByName(name: string): Weapon | undefined {
    return WEAPONS[name];
}
