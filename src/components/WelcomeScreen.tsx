import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GenerateWallet } from './GenerateWallet';
import { ImportWallet } from './ImportWallet';
import { Wallet as WalletIcon, Plus, Download } from 'lucide-react';
import { Wallet } from '../types/wallet';

interface WelcomeScreenProps {
  onWalletCreated: (wallet: Wallet) => void;
}

export function WelcomeScreen({ onWalletCreated }: WelcomeScreenProps) {
  const [activeTab, setActiveTab] = useState<string>('generate');

  return (
    <div className="h-[600px] w-[400px] flex flex-col p-4 overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <div className="p-2 bg-primary rounded-full">
            <WalletIcon className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-1">Octra Wallet</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Your secure gateway to Octra blockchain
        </p>
      </div>

      {/* Main Card */}
      <Card className="flex-1 shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-3">
          <CardTitle className="text-lg">Get Started</CardTitle>
          <p className="text-xs text-muted-foreground">
            Create or import a wallet to begin
          </p>
        </CardHeader>
        <CardContent className="px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="generate" className="flex items-center gap-1 text-xs">
                <Plus className="h-3 w-3" />
                Create
              </TabsTrigger>
              <TabsTrigger value="import" className="flex items-center gap-1 text-xs">
                <Download className="h-3 w-3" />
                Import
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-3">
              <div className="text-center mb-3">
                <h3 className="text-sm font-semibold mb-1">Create New Wallet</h3>
                <p className="text-xs text-muted-foreground">
                  Generate a secure wallet with mnemonic phrase
                </p>
              </div>
              <GenerateWallet onWalletGenerated={onWalletCreated} />
            </TabsContent>

            <TabsContent value="import" className="space-y-3">
              <div className="text-center mb-3">
                <h3 className="text-sm font-semibold mb-1">Import Wallet</h3>
                <p className="text-xs text-muted-foreground">
                  Restore using private key or mnemonic
                </p>
              </div>
              <ImportWallet onWalletImported={onWalletCreated} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-4 text-xs text-muted-foreground">
        <p>Keep your keys secure and never share them.</p>
      </div>
    </div>
  );
}