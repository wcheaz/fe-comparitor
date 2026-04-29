export interface AbilityData {
    name: string;
    description: string;
    procCondition?: string;
    procChance?: string;
}

const gameDirMap: Record<string, string> = {
    'awakening': 'awakening',
    'sacred_stones': 'sacred_stones',
    'sacred stones': 'sacred_stones',
    'the sacred stones': 'sacred_stones',
    'binding_blade': 'binding_blade',
    'binding blade': 'binding_blade',
    'the binding blade': 'binding_blade',
    'blazing_blade': 'blazing_blade',
    'blazing blade': 'blazing_blade',
    'the blazing blade': 'blazing_blade',
    'three_houses': 'three_houses',
    'three houses': 'three_houses',
    'engage': 'engage',
};

const abilitiesCache = new Map<string, Record<string, AbilityData>>();

function resolveDir(game: string): string | undefined {
    return gameDirMap[game.toLowerCase()];
}

function arrayToRecord(arr: { name: string; description: string; procCondition?: string; procChance?: string }[]): Record<string, AbilityData> {
    const record: Record<string, AbilityData> = {};
    for (const entry of arr) {
        const data: AbilityData = { name: entry.name, description: entry.description };
        if (entry.procCondition) data.procCondition = entry.procCondition;
        if (entry.procChance) data.procChance = entry.procChance;
        record[entry.name] = data;
    }
    return record;
}

export async function getAbilitiesByGame(game: string): Promise<Record<string, AbilityData>> {
    const dir = resolveDir(game);
    if (!dir) return {};

    if (abilitiesCache.has(dir)) {
        return abilitiesCache.get(dir)!;
    }

    try {
        const mod = await import(`@/data/${dir}/abilities.json`);
        const record = arrayToRecord(mod.default);
        abilitiesCache.set(dir, record);
        return record;
    } catch {
        const empty: Record<string, AbilityData> = {};
        abilitiesCache.set(dir, empty);
        return empty;
    }
}

export async function getAbilityByName(name: string, game: string): Promise<AbilityData | undefined> {
    const cleanName = name.replace(/\s*\(Lv\.\s*\d+\)\s*$/, '');
    const abilities = await getAbilitiesByGame(game);
    return abilities[cleanName];
}
