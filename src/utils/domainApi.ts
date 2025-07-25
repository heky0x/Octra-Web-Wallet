import { DomainRegistrationRequest, DomainRegistrationResult, DomainLookupResult } from '../types/domain';
import { createTransaction, sendTransaction, fetchBalance } from './api';

// Master wallet address for domain registration verification
const DOMAIN_MASTER_ADDRESS = 'oct1234567890abcdef1234567890abcdef12345678'; // Replace with actual master address

export async function registerDomain(request: DomainRegistrationRequest): Promise<DomainRegistrationResult> {
  try {
    // Validate domain format
    if (!isValidDomainFormat(request.domain)) {
      return { success: false, error: 'Invalid domain format. Use only letters, numbers, and hyphens.' };
    }

    // Check if domain is already registered
    const existingDomain = await lookupDomain(request.domain);
    if (existingDomain.found) {
      return { success: false, error: 'Domain is already registered' };
    }

    // Get current nonce
    const balanceData = await fetchBalance(request.ownerAddress);
    
    // Create registration message
    const registrationMessage = `register_domain:${request.domain}`;
    
    // Create transaction to master address with 0 OCT and registration message
    const transaction = createTransaction(
      request.ownerAddress,
      DOMAIN_MASTER_ADDRESS,
      0, // 0 OCT amount
      balanceData.nonce + 1,
      request.privateKey,
      '', // Will be derived from private key
      registrationMessage
    );

    // Send transaction
    const result = await sendTransaction(transaction);
    
    if (result.success && result.hash) {
      // Store domain registration in backend
      await storeDomainRegistration({
        domain: request.domain,
        address: request.ownerAddress,
        txHash: result.hash,
        registeredAt: Date.now()
      });

      return { success: true, txHash: result.hash };
    } else {
      return { success: false, error: result.error || 'Transaction failed' };
    }
  } catch (error) {
    console.error('Domain registration error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function lookupDomain(domain: string): Promise<DomainLookupResult> {
  try {
    const response = await fetch(`/api/domain/lookup/${domain}`);
    
    if (response.ok) {
      const data = await response.json();
      return {
        found: true,
        address: data.address,
        domain: data.domain
      };
    } else if (response.status === 404) {
      return { found: false };
    } else {
      throw new Error('Failed to lookup domain');
    }
  } catch (error) {
    console.error('Domain lookup error:', error);
    return { found: false };
  }
}

export async function lookupAddress(address: string): Promise<DomainLookupResult> {
  try {
    const response = await fetch(`/api/domain/reverse/${address}`);
    
    if (response.ok) {
      const data = await response.json();
      return {
        found: true,
        address: data.address,
        domain: data.domain
      };
    } else if (response.status === 404) {
      return { found: false };
    } else {
      throw new Error('Failed to lookup address');
    }
  } catch (error) {
    console.error('Address lookup error:', error);
    return { found: false };
  }
}

async function storeDomainRegistration(registration: any): Promise<void> {
  try {
    const response = await fetch('/api/domain/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registration),
    });

    if (!response.ok) {
      throw new Error('Failed to store domain registration');
    }
  } catch (error) {
    console.error('Failed to store domain registration:', error);
    throw error;
  }
}

export function isValidDomainFormat(domain: string): boolean {
  // Domain should end with .oct
  if (!domain.endsWith('.oct')) {
    return false;
  }

  // Remove .oct suffix for validation
  const name = domain.slice(0, -4);
  
  // Check length (3-32 characters)
  if (name.length < 3 || name.length > 32) {
    return false;
  }

  // Check format: only letters, numbers, and hyphens
  // Cannot start or end with hyphen
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
  return domainRegex.test(name);
}

export function isOctDomain(input: string): boolean {
  return input.endsWith('.oct') && isValidDomainFormat(input);
}

export async function resolveAddressOrDomain(input: string): Promise<string> {
  const trimmedInput = input.trim();
  
  // If it's already an OCT address, return as is
  if (trimmedInput.startsWith('oct') && trimmedInput.length > 40) {
    return trimmedInput;
  }
  
  // If it's a domain, resolve it
  if (isOctDomain(trimmedInput)) {
    const lookup = await lookupDomain(trimmedInput);
    if (lookup.found && lookup.address) {
      return lookup.address;
    } else {
      throw new Error(`Domain ${trimmedInput} not found`);
    }
  }
  
  // If it doesn't match either format, throw error
  throw new Error('Invalid address or domain format');
}