"use client"

import React, { useState } from 'react';
import WalletSelector from '../components/WalletSelector';
import WalletInfo from '../components/WalletInfo';

const Home: React.FC = () => {
    const [walletType, setWalletType] = useState<string>('');
    const [mnemonic, setMnemonic] = useState<string>('');

    const handleWalletCreate = (type: string, mnemonic: string) => {
        setWalletType(type);
        setMnemonic(mnemonic);
    };

    return (
        <div>
            <h1>Web3 HD Wallet</h1>
            <WalletSelector onWalletCreate={handleWalletCreate} />
            {mnemonic && <WalletInfo walletType={walletType} mnemonic={mnemonic} />}
        </div>
    );
};

export default Home;
