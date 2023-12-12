import { ContractDeploy, Warp } from 'warp-contracts';
import { WebIrys } from '@irys/sdk';

// Helpers
import {
    getAtomicAssetTags,
    checkAndAddContentTypeTag,
    checkAssetDiscoverabilityTags,
    checkInitStateTag,
} from './helpers';

// Types
import { AtomicToolkitOptions, CreateAtomicAssetOpts } from './types';

class AtomicToolkit {
    protected warp: Warp;
    protected irys: WebIrys;

    constructor({ warp, irys }: AtomicToolkitOptions) {
        if (!warp.hasPlugin('deploy')) {
            throw new Error('Warp instance must have DeployPlugin');
        }
        this.warp = warp;
        this.irys = irys;
    }

    public async createAtomicAsset(
        file: File,
        opts: CreateAtomicAssetOpts,
    ): Promise<ContractDeploy> {
        const tags = getAtomicAssetTags(opts?.tags ?? []);
        checkAssetDiscoverabilityTags(tags);
        checkInitStateTag(tags);
        const tagsWithType = checkAndAddContentTypeTag(file, tags);
        await this.irys.ready();
        const tx = await this.irys.uploadFile(file, {
            ...opts,
            tags: tagsWithType,
        });
        const contract = this.warp.register(tx.id, this.getIrysNode());
        return contract;
    }

    // Helper functions
    public getIrysNode() {
        const url = this.irys.api.config.url.href;
        const node = url?.split('https://')[1]?.split('.irys.xyz')[0];
        if (node === 'devnet') {
            throw new Error('Only Node1 and Node2 are supported');
        }
        return node as 'node1' | 'node2';
    }
}

export default AtomicToolkit;
