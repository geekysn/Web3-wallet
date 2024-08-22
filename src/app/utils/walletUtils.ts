import { ethers } from 'ethers';
import { Keypair, Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { HDNode } from '@ethersproject/hdnode';
import * as bip39 from 'bip39';

// Generate Seed Phrase
export const generateSeedPhrase = () => {
    return bip39.generateMnemonic();
};

// Ethereum Wallet Creation
export const createEthWallets = (mnemonic: string, numWallets: number) => {
    const wallets = [];
    const hdNode = HDNode.fromMnemonic(mnemonic);
    for (let i = 0; i < numWallets; i++) {
        const wallet = hdNode.derivePath(`m/44'/60'/0'/0/${i}`);
        wallets.push({
            address: wallet.address,
            privateKey: wallet.privateKey,
        });
    }

    return wallets;
};

// Solana Wallet Creation
export const createSolWallets = (mnemonic: string, numWallets: number) => {
    const wallets = [];
    const seed = bip39.mnemonicToSeedSync(mnemonic).slice(0, 32);

    for (let i = 0; i < numWallets; i++) {
        const keypair = Keypair.fromSeed(seed);
        wallets.push({
            publicKey: keypair.publicKey.toString(),
            secretKey: keypair.secretKey,
        });
    }

    return wallets;
};

// Get Ethereum Wallet Balance
export const getEthBalance = async (address: string) => {
    const provider = ethers.getDefaultProvider();
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
};

// Get Solana Wallet Balance
export const getSolBalance = async (address: string) => {
    const connection = new Connection(clusterApiUrl('devnet'));
    const balance = await connection.getBalance(new PublicKey(address));
    return balance / 1e9; // Convert lamports to SOL
};
