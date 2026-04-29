export interface SkillData {
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

const skillsCache = new Map<string, Record<string, SkillData>>();

function resolveDir(game: string): string | undefined {
    return gameDirMap[game.toLowerCase()];
}

function arrayToRecord(arr: { name: string; description: string; procCondition?: string; procChance?: string }[]): Record<string, SkillData> {
    const record: Record<string, SkillData> = {};
    for (const entry of arr) {
        const data: SkillData = { name: entry.name, description: entry.description };
        if (entry.procCondition) data.procCondition = entry.procCondition;
        if (entry.procChance) data.procChance = entry.procChance;
        record[entry.name] = data;
    }
    return record;
}

export async function getSkillsByGame(game: string): Promise<Record<string, SkillData>> {
    const dir = resolveDir(game);
    if (!dir) return {};

    if (skillsCache.has(dir)) {
        return skillsCache.get(dir)!;
    }

    try {
        const mod = await import(`@/data/${dir}/skills.json`);
        const record = arrayToRecord(mod.default);
        skillsCache.set(dir, record);
        return record;
    } catch {
        const empty: Record<string, SkillData> = {};
        skillsCache.set(dir, empty);
        return empty;
    }
}

export async function getSkillByName(name: string, game: string): Promise<SkillData | undefined> {
    const cleanName = name.replace(/\s*\(Lv\.\s*\d+\)\s*$/, '');
    const skills = await getSkillsByGame(game);
    return skills[cleanName];
}
