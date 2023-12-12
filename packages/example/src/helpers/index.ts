import { Tag } from 'arbundles';

const ATOMIC_TOKEN_SRC = 'Of9pi--Gj7hCTawhgxOwbuWnFI1h24TTgO5pw8ENJNQ';

const getAtomicAssetTags = (tags?: Tag[]): Tag[] => {
    const baseTags: Tag[] = [
        //  Contract Identifiers
        { name: 'App-Name', value: 'SmartWeaveContract' },
        { name: 'App-Version', value: '0.3.0' },
        { name: 'Contract-Src', value: ATOMIC_TOKEN_SRC },
        {
            name: 'Contract-Manifest',
            value: '{"evaluationOptions":{"sourceType":"redstone-sequencer","allowBigInt":true,"internalWrites":true,"unsafeClient":"skip","useConstructor":true}}',
        },
        { name: 'Indexed-By', value: 'ucm' },
        // License
        { name: 'License', value: 'udlicense' },
    ];

    const requiredTags = baseTags.map((tag) => tag.name);
    const tagNames = tags?.map((tag) => tag.name);

    tagNames?.forEach((t) => {
        if (requiredTags.includes(t)) {
            const index = requiredTags.indexOf(t);
            baseTags[index] = tags?.find((tag) => tag.name === t) as Tag;
        } else {
            baseTags.push(tags?.find((tag) => tag.name === t) as Tag);
        }
    });

    return baseTags;
};

const checkAssetDiscoverabilityTags = (tags: Tag[]) => {
    const requiredTags = ['Type', 'Title', 'Description'];
    const tagNames = tags.map((tag) => tag.name);
    const missingTags = requiredTags.filter((tag) => !tagNames.includes(tag));
    if (missingTags.length > 0) {
        throw new Error(
            `Missing required tags: ${missingTags.join(', ')} in tags array`,
        );
    }
};

const checkInitStateTag = (tags: Tag[]) => {
    const initStateTag = tags.find((tag) => tag.name === 'Init-State');
    if (!initStateTag) {
        throw new Error('Init-State tag not found');
    }
    try {
        const parsed = JSON.parse(initStateTag.value);
        if (
            !parsed.ticker ||
            !parsed.name ||
            !parsed.balances ||
            !parsed.claimable
        ) {
            throw new Error('Init-State tag value is not valid');
        }
    } catch (e) {
        throw new Error('Init-State tag value is not valid JSON');
    }
};

const checkAndAddContentTypeTag = (file: File, tags: Tag[]): Tag[] => {
    const t = tags;
    const tagNames = t.map((tag) => tag.name);
    if (!tagNames.includes('Content-Type')) {
        const contentType = file.type;
        if (contentType) {
            t.push({ name: 'Content-Type', value: contentType });
        }
    }
    return t;
};

export {
    getAtomicAssetTags,
    checkAssetDiscoverabilityTags,
    checkAndAddContentTypeTag,
    checkInitStateTag,
};
