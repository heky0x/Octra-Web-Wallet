import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet as WalletIcon, 
  Send, 
  History, 
  LogOut,
  Copy,
  PieChart,
  ExternalLink,
  Maximize2
} from 'lucide-react';
import { Balance } from './Balance';
import { MultiSend } from './MultiSend';
import { TxHistory } from './TxHistory';
import { ThemeToggle } from './ThemeToggle';
import { Wallet } from '../types/wallet';
import { fetchBalance, getTransactionHistory } from '../utils/api';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  status: 'confirmed' | 'pending' | 'failed';
  type: 'sent' | 'received';
}

interface WalletDashboardProps {
  wallet: Wallet;
  onDisconnect: () => void;
  isExpanded?: boolean;
}

export function WalletDashboard({ wallet, onDisconnect, isExpanded = false }: WalletDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const { toast } = useToast();

  // Initial data fetch when wallet is connected
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!wallet) return;

      try {
        // Fetch balance
        setIsLoadingBalance(true);
        const balanceData = await fetchBalance(wallet.address);
        setBalance(balanceData.balance);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        toast({
          title: "Error",
          description: "Failed to fetch wallet balance",
          variant: "destructive",
        });
      } finally {
        setIsLoadingBalance(false);
      }

      try {
        // Fetch transaction history
        setIsLoadingTransactions(true);
        const historyData = await getTransactionHistory(wallet.address);
        
        if (Array.isArray(historyData)) {
          const transformedTxs = historyData.map((tx) => ({
            ...tx,
            type: tx.from?.toLowerCase() === wallet.address.toLowerCase() ? 'sent' : 'received'
          } as Transaction));
          setTransactions(transformedTxs);
        }
      } catch (error) {
        console.error('Failed to fetch transaction history:', error);
        toast({
          title: "Error",
          description: "Failed to fetch transaction history",
          variant: "destructive",
        });
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    fetchInitialData();
  }, [wallet, toast]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('Are you sure you want to disconnect your wallet? Make sure you have backed up your private key or mnemonic phrase.')) {
      onDisconnect();
    }
  };

  const handleBalanceUpdate = (newBalance: number) => {
    setBalance(newBalance);
  };

  const handleTransactionsUpdate = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
  };

  const handleTransactionSuccess = () => {
    // Refresh transaction history after successful transaction
    const refreshTransactions = async () => {
      try {
        const historyData = await getTransactionHistory(wallet.address);
        
        if (Array.isArray(historyData)) {
          const transformedTxs = historyData.map((tx) => ({
            ...tx,
            type: tx.from?.toLowerCase() === wallet.address.toLowerCase() ? 'sent' : 'received'
          } as Transaction));
          setTransactions(transformedTxs);
        }
      } catch (error) {
        console.error('Failed to refresh transaction history:', error);
      }
    };

    // Small delay to allow transaction to propagate
    setTimeout(refreshTransactions, 2000);
  };

  const truncateAddress = (address: string) => {
    if (isExpanded) {
      return `${address.slice(0, 8)}...${address.slice(-6)}`;
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const openInNewTab = (url: string) => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, '_blank');
    }
  };

  const openExpandedView = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: chrome.runtime.getURL('home.html') });
    } else {
      window.open('/home.html', '_blank');
    }
  };

  if (isExpanded) {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <WalletIcon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-xl font-bold">Octra Wallet</h1>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-muted-foreground">
                        {truncateAddress(wallet.address)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(wallet.address, 'Address')}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="hidden sm:inline-flex">
                  Connected
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openInNewTab('https://octrascan.io')}
                  className="hidden sm:inline-flex"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  OctraScan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="send" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Balance 
                wallet={wallet} 
                balance={balance}
                onBalanceUpdate={handleBalanceUpdate}
                isLoading={isLoadingBalance}
              />
            </TabsContent>

            <TabsContent value="send">
              <MultiSend 
                wallet={wallet} 
                balance={balance}
                onBalanceUpdate={handleBalanceUpdate}
                onTransactionSuccess={handleTransactionSuccess}
              />
            </TabsContent>

            <TabsContent value="history">
              <TxHistory 
                wallet={wallet} 
                transactions={transactions}
                onTransactionsUpdate={handleTransactionsUpdate}
                isLoading={isLoadingTransactions}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-[400px] flex flex-col">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <WalletIcon className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-sm font-bold">Octra Wallet</h1>
              <div className="flex items-center space-x-1">
                <p className="text-xs text-muted-foreground">
                  {truncateAddress(wallet.address)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(wallet.address, 'Address')}
                  className="h-4 w-4 p-0"
                >
                  <Copy className="h-2 w-2" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={openExpandedView}
              className="h-6 w-6 p-0"
              title="Open Full Version"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openInNewTab('https://octrascan.io')}
              className="h-6 w-6 p-0"
              title="Open OctraScan"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisconnect}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 h-6 px-2"
            >
              <LogOut className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-3 mt-3">
            <TabsTrigger value="overview" className="flex items-center gap-1 text-xs">
              <PieChart className="h-3 w-3" />
              Balance
            </TabsTrigger>
            <TabsTrigger value="send" className="flex items-center gap-1 text-xs">
              <Send className="h-3 w-3" />
              Send
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1 text-xs">
              <History className="h-3 w-3" />
              History
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-3">
            <TabsContent value="overview" className="mt-0">
              <Balance 
                wallet={wallet} 
                balance={balance}
                onBalanceUpdate={handleBalanceUpdate}
                isLoading={isLoadingBalance}
              />
            </TabsContent>

            <TabsContent value="send" className="mt-0">
              <MultiSend 
                wallet={wallet} 
                balance={balance}
                onBalanceUpdate={handleBalanceUpdate}
                onTransactionSuccess={handleTransactionSuccess}
              />
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <TxHistory 
                wallet={wallet} 
                transactions={transactions}
                onTransactionsUpdate={handleTransactionsUpdate}
                isLoading={isLoadingTransactions}
              />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}