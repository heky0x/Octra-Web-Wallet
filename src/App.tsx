import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { WalletDashboard } from './components/WalletDashboard';
import { ThemeProvider } from './components/ThemeProvider';
import { Wallet } from './types/wallet';
import { Toaster } from '@/components/ui/toaster';
import { ExtensionStorage } from './utils/storage';

function App() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure body has the extension-popup class
    document.body.classList.add('extension-popup');
    document.body.classList.remove('expanded-view');
    
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
        <div className="min-h-[600px] w-[400px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading wallet...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="octra-wallet-theme">
      <div className="min-h-[600px] w-[400px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {!wallet ? (
          <WelcomeScreen onWalletCreated={saveWallet} />
        ) : (
          <WalletDashboard wallet={wallet} onDisconnect={disconnectWallet} />
        )}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;