import { describe, expect, it } from 'vitest';

import {
    getAtomicAssetTags,
    checkAssetDiscoverabilityTags,
    checkAndAddContentTypeTag,
} from '../helpers';

describe('Atomic Toolkit Helper Functions', () => {
    it('Should Return Modified Tags as per params', () => {
        const tags = getAtomicAssetTags([
            {
                name: 'License',
                value: 'custom',
            },
        ]);
        const licenseTags = tags.filter((t) => t.name === 'License');
        expect(licenseTags.length).toBe(1);
        expect(licenseTags?.at(0)?.value).toBe('custom');
    });
    it('Should Throw Error if required tags are missing', () => {
        const tags = getAtomicAssetTags();
        expect(() => checkAssetDiscoverabilityTags(tags)).toThrowError(
            'Missing required tags: Type, Title, Description in tags array',
        );
    });
    it('Should Add Content Tag if not Present', () => {
        const file = new File([''], 'test.txt', { type: 'text/plain' });
        const tags = checkAndAddContentTypeTag(file, []);
        const contentTypeTag = tags.find((t) => t.name === 'Content-Type');
        expect(contentTypeTag?.value).toBe('text/plain');
    });
});
