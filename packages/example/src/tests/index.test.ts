import { describe, expect, it } from 'vitest';
import fs from 'fs';

import { WebIrys } from '@irys/sdk';
import { WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import { ethers } from 'ethers';

import AtomicToolkit from '..';

// Load dotenv configuration from .env.local
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Load Atomic Asset Image
let buffer = fs.readFileSync('assets/trees-wallpaper.jpg');
let blob = new Blob([buffer]);
let file = new File([blob], 'trees-wallpaper.jpg', { type: 'image/jpeg' });

describe('Atomic Toolkit', () => {
    it('Should be a Class', () => {
        expect(AtomicToolkit).toBeInstanceOf(Function);
    });
    it('Should have createAtomicAssetFunction', async () => {
        const warp = WarpFactory.forTestnet().use(new DeployPlugin());
        const irys = new WebIrys({
            url: 'node1',
            token: 'matic',
        });
        const atomicToolkit = new AtomicToolkit({
            warp,
            irys,
        });
        expect(atomicToolkit.createAtomicAsset).toBeInstanceOf(Function);
    });
    it('Should throw error if warp instance does not have deploy plugin', async () => {
        const warp = WarpFactory.forTestnet();
        const irys = new WebIrys({
            url: 'node1',
            token: 'matic',
        });
        expect(() => new AtomicToolkit({ warp, irys })).toThrowError(
            'Warp instance must have DeployPlugin',
        );
    });
    it('Should Create a Atomic Asset', async () => {
        let provider = new ethers.providers.JsonRpcProvider(
            process.env.RPC_URL,
        );
        if (!process.env.PRIVATE_KEY) {
            throw new Error('PRIVATE_KEY not found');
        }
        const ethersWallet = new ethers.Wallet(
            process.env.PRIVATE_KEY,
            provider,
        );
        const warp = WarpFactory.forTestnet().use(new DeployPlugin());
        const irys = new WebIrys({
            url: 'https://node2.irys.xyz',
            token: 'matic',
            wallet: {
                name: 'ethersv5',
                provider: {
                    ...ethersWallet,
                    getSigner: () => ethersWallet,
                },
            },
        });
        await irys.ready();

        const atomicToolkit = new AtomicToolkit({
            warp,
            irys,
        });
        const tx = await atomicToolkit.createAtomicAsset(file, {
            tags: [
                {
                    name: 'Type',
                    value: 'file',
                },
                {
                    name: 'Title',
                    value: 'test',
                },
                {
                    name: 'Description',
                    value: 'test',
                },
                {
                    name: 'Init-State',
                    value: JSON.stringify({
                        balances: {
                            '9WQ7xH2LOuqfAccjGquck8eaKARg1vMhRJaOo3LJL14': 100,
                        },
                        name: 'Trees Wallpaper',
                        description: 'Trees Wallpaper',
                        ticker: 'TREES',
                        claimable: [],
                    }),
                },
            ],
        });
        console.log(tx);
        expect(tx).toBeDefined();
    });
});
