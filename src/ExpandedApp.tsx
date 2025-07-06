import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { WalletDashboard } from './components/WalletDashboard';
import { ThemeProvider } from './components/ThemeProvider';
import { Wallet } from './types/wallet';
import { Toaster } from '@/components/ui/toaster';
import { ExtensionStorage } from './utils/storage';

function ExpandedApp() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const storedWallets = await ExtensionStorage.getItem('wallets');
        if (storedWallets) {
          setWallets(storedWallets);
          if (storedWallets.length > 0) {
            setWallet(storedWallets[0]);
          }
        }
      } catch (error) {
        console.error('Failed to load wallets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWallets();
  }, []);

  const saveWallet = async (newWallet: Wallet) => {
    const updatedWallets = [...wallets, newWallet];
    setWallets(updatedWallets);
    setWallet(newWallet);
    await ExtensionStorage.setItem('wallets', updatedWallets);
  };

  const disconnectWallet = async () => {
    setWallet(null);
    setWallets([]);
    await ExtensionStorage.removeItem('wallets');
    
    // Reset theme to light when disconnecting
    await ExtensionStorage.setItem('octra-wallet-theme', 'light');
  };

  if (isLoading) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="octra-wallet-theme">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading Octra Wallet...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="octra-wallet-theme">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {!wallet ? (
          <WelcomeScreen onWalletCreated={saveWallet} isExpanded={true} />
        ) : (
          <WalletDashboard wallet={wallet} onDisconnect={disconnectWallet} isExpanded={true} />
        )}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default ExpandedApp;