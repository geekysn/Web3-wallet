import { useState } from 'react';

export function useWalletStorage(seedPhrase: string) {
    const key = `wallets_${seedPhrase}`;

    const [storedWallets, setStoredWallets] = useState<any[]>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    });

    const saveWallets = (wallets: any[]) => {
        try {
            setStoredWallets(wallets);
            localStorage.setItem(key, JSON.stringify(wallets));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedWallets, saveWallets] as const;
}
