import React, { useEffect, useState } from 'react';
import { createEthWallets, createSolWallets, getEthBalance, getSolBalance } from '../utils/walletUtils';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WalletInfo: React.FC<{ walletType: string; mnemonic: string }> = ({ walletType, mnemonic }) => {
    const [wallets, setWallets] = useLocalStorage<any[]>(`wallets-${mnemonic}`, []);
    const [balances, setBalances] = useState<string[]>(new Array(wallets.length).fill(''));

    useEffect(() => {
        if (wallets.length === 0) {
            generateAndSetWallets(1); // Initialize with 1 wallet
        } else {
            setBalances(new Array(wallets.length).fill('Click to fetch balance'));
        }
    }, [walletType, mnemonic]);

    const generateAndSetWallets = async (numWallets: number) => {
        let generatedWallets: any[] = [];
        if (walletType === 'ethereum') {
            generatedWallets = createEthWallets(mnemonic, numWallets);
        } else if (walletType === 'solana') {
            generatedWallets = createSolWallets(mnemonic, numWallets);
        }

        const updatedWallets = [...wallets, ...generatedWallets];
        setWallets(updatedWallets);
        setBalances([...balances, ...new Array(generatedWallets.length).fill('Click to fetch balance')]);
    };

    const handleAddWallets = () => {
        generateAndSetWallets(1); // Add 1 new wallet at a time
    };

    const fetchBalance = async (index: number) => {
        try {
            const wallet = wallets[index];
            const balance = await (walletType === 'ethereum' 
                ? getEthBalance(wallet.address) 
                : getSolBalance(wallet.publicKey));
            
            const formattedBalance = balance.toString();
            const updatedBalances = [...balances];
            updatedBalances[index] = formattedBalance;
            setBalances(updatedBalances);
        } catch (error) {
            console.error('Failed to fetch balance:', error);
            const updatedBalances = [...balances];
            updatedBalances[index] = 'Error fetching balance';
            setBalances(updatedBalances);
        }
    };
    

    return (
        <div>
            <h3>Wallet Information</h3>
            {wallets.map((wallet, index) => (
                <div key={index}>
                    <h4>Wallet {index + 1}</h4>
                    <p>Address: {wallet.address || wallet.publicKey}</p>
                    <p>Private Key: {wallet.privateKey || wallet.secretKey}</p>
                    <p>Balance: {balances[index]}</p>
                    <button onClick={() => fetchBalance(index)}>Fetch Balance</button>
                </div>
            ))}
            <button onClick={handleAddWallets}>Add More Wallets</button>
        </div>
    );
};

export default WalletInfo;
