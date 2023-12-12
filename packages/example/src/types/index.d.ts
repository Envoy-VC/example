import { Warp } from 'warp-contracts';
import Irys, { WebIrys } from '@irys/sdk';
import { DataItemCreateOptions } from 'arbundles';
import { Tag } from 'arbundles';

export type AtomicToolkitOptions = {
    /**
     * A Warp instance that uses DeployPlugin
     */
    warp: Warp;
    /**
     * Web Irys instance for uploading Assets
     */
    irys: WebIrys;
};

export type CreateAtomicAssetOpts = {
    tags?: Tag[];
};
