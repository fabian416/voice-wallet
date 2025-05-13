import { Injectable } from '@nestjs/common';
import { Client } from '@verida/client-ts';
import { Network, Web3CallType } from '@verida/types';
import { AutoAccount } from '@verida/account-node';
import { ethers } from 'ethers';
import { Context } from '@verida/client-ts';

@Injectable()
export class VeridaService {
  async createAccount() {
    // 1. Obtener la private key del .env
    const privateKey = process.env.PRIVATE_KEY!;
    const wallet = new ethers.Wallet(privateKey);
    const address = await wallet.getAddress();

    console.log('🟢 Verida Wallet Address:', address);

    // 2. Configuración de Verida
    const VERIDA_NETWORK = Network.BANKSIA;
    const CONTEXT_NAME = 'Baron:HackathonDemo'; // evitamos espacios raros

    const DID_CLIENT_CONFIG = {
      callType: 'web3' as Web3CallType,
      web3Config: {
        privateKey,
        rpcUrl: 'https://rpc-amoy.polygon.technology/',
      },
    };

    // 3. Crear cliente y cuenta
    const client = new Client({ network: VERIDA_NETWORK });

    const account = new AutoAccount({
      privateKey,
      network: VERIDA_NETWORK,
      didClientConfig: DID_CLIENT_CONFIG,
    });

    await client.connect(account);

    // 4. Abrir y publicar contexto
    const context = await client.openContext(CONTEXT_NAME, true);
    if (!context) throw new Error('❌ Context creation failed');
    
    // Proceder directamente a abrir la base de datos
    const db = await context.openDatabase('demo');
    await db.save({ createdAt: new Date().toISOString() });

    // 6. Obtener el DID del usuario
    const did = await account.did();

    return {
      did,
      privateKey,
      address,
      context: CONTEXT_NAME,
      network: VERIDA_NETWORK,
    };
  }
}
