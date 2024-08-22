"use client"

import React, { useEffect, useState } from 'react';
import { generateSeedPhrase } from '../utils/walletUtils';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WalletSelector: React.FC<{ onWalletCreate: (type: string, mnemonic: string) => void }> = ({ onWalletCreate }) => {
    const [walletType, setWalletType] = useState<string>('ethereum');
    const [seedPhrase, setSeedPhrase] = useLocalStorage<string>('seedPhrase', '');
    const [isMounted, setIsMounted] = useState(false);
    const [previousMnemonic, setPreviousMnemonic] = useState<string>('');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleCreateWallet = () => {
        const newSeedPhrase = generateSeedPhrase();
        setPreviousMnemonic(seedPhrase); // Store previous seed phrase
        setSeedPhrase(newSeedPhrase);
        localStorage.removeItem(`wallets-${previousMnemonic}`); // Clear previous wallets
        onWalletCreate(walletType, newSeedPhrase);
    };

    const handleUseExistingSeed = () => {
        if (seedPhrase) {
            onWalletCreate(walletType, seedPhrase);
        }
    };

    if (!isMounted) {
        return null; // Prevent rendering until after the component has mounted on the client
    }

    return (
        <div>
            <label>
                Select Wallet Type:
                <select value={walletType} onChange={(e) => setWalletType(e.target.value)}>
                    <option value="ethereum">Ethereum</option>
                    <option value="solana">Solana</option>
                </select>
            </label>
            <button onClick={handleCreateWallet}>Create New Wallet</button>

            <div>
                <input 
                    type="text" 
                    placeholder="Enter existing seed phrase" 
                    value={seedPhrase} 
                    onChange={(e) => setSeedPhrase(e.target.value)} 
                />
                <button onClick={handleUseExistingSeed}>Retrieve Wallets</button>
            </div>

            {seedPhrase && (
                <div>
                    <h3>Your Seed Phrase</h3>
                    <p>{seedPhrase}</p>
                </div>
            )}
        </div>
    );
};

export default WalletSelector;
