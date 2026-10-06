// CONTRACT LAYER

export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';

export interface Transaction {
    id: string;
    accountId: string;
    type: TransactionType;
    amount: number;
    description?: string // this will be for transfers
    balanceAfter: number;
    createdAt: string; //(international standard format) YYYY-MM-DDTHH:mm:ssZ ex: 2026-09-29T14:30:00Z
}

export interface DepositRequest {
    accountId: string;
    amount: number;
    description?: string;
}

export interface WithdrawRequest {
    accountId: string;
    amount: number;
    description?: string;
}

export interface TransferRequest {
    fromAccountId: string;
    toAccountNumber: string;
    amount: number;
    description?: string;
}