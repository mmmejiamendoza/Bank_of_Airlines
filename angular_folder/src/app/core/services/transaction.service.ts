import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, delay, forkJoin, map, shareReplay } from 'rxjs';
import {
    Account,
    ApiErrorCode,
    ApiResponse,
    DepositRequest,
    Recipient,
    Transaction,
    TransferRequest,
    WithdrawRequest,
}from '../models';

const FAKE_DELAY_MS = 600; 

@Injectable({ providedIn: 'root' })
export class TransactionService {
    private http = inject(HttpClient);
    private accounts: Account[] = [];
    private transactions: Transaction[] = [];
    private recipients: Recipient[] = [];
    private data$?: Observable<void>;


// what components call (public api)
getAccount(accountId: string): Observable<ApiResponse<Account>> {
    return this.load().pipe(
        map(() => {
            const account = this.accounts.find((a) => a.id === accountId);
            return account ? this.ok({ ...account }) : this.fail<Account>('ACCOUNT_NOT_FOUND', 'Account not found');
        }),
    );
}

getAccountByUserId(userId: string): Observable<ApiResponse<Account>> {
  return this.load().pipe(
    map(() => {
      const account = this.accounts.find((a) => a.userId === userId);
      return account ? this.ok({ ...account }) : this.fail<Account>('ACCOUNT_NOT_FOUND', 'Account not found.');
    }),
  );
}

getTransactions(accountId: string): Observable<ApiResponse<Transaction[]>> {
    return this.load().pipe(
        map(() => {
            const list = this.transactions
                .filter((t) => t.accountId === accountId)
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
            return this.ok(list);
        }),
    );
}

getRecipients(accountId: string): Observable<ApiResponse<Recipient[]>> {
    return this.load().pipe(
        map(() => {
            const own = this.accounts.find((a) => a.id === accountId);
            return this.ok(this.recipients.filter((r) => r.accountNumber !== own?.accountNumber));
        }),
    );
}

deposit(req: DepositRequest): Observable<ApiResponse<Transaction>> {
    return this.load().pipe(map(() => this.applyDeposit(req)), delay(FAKE_DELAY_MS));
}

withdraw(req: WithdrawRequest): Observable<ApiResponse<Transaction>> {
    return this.load().pipe(map(() => this.applyWithdraw(req)), delay(FAKE_DELAY_MS));
}

transfer(req: TransferRequest): Observable<ApiResponse<Transaction>> {
    return this.load().pipe(map(() => this.applyTransfer(req)), delay(FAKE_DELAY_MS));
}


//business rules
private applyDeposit(req: DepositRequest): ApiResponse<Transaction> {
    const bad = this.checkAmount<Transaction>(req.amount);
    if (bad) return bad;
    const account = this.accounts.find((a) => a.id === req.accountId );
    if(!account) return this.fail('ACCOUNT_NOT_FOUND', 'account not found');

    account.balance = this.round2(account.balance + req.amount);
    const tx = this.record(account, 'DEPOSIT', req.amount, req.description);
    return this.ok(tx);
}

private applyWithdraw(req: WithdrawRequest): ApiResponse<Transaction> {
    const bad = this.checkAmount<Transaction>(req.amount);
    if(bad) return bad;
    const account = this.accounts.find((a) => a.id === req.accountId );
    if(!account) return this.fail('ACCOUNT_NOT_FOUND', 'account not found');
    if(req.amount > account.balance) return this.fail('INSUFFICIENT_FUNDS', 'insufficient funds');

    account.balance = this.round2(account.balance - req.amount);
    const tx = this.record(account, 'WITHDRAW', req.amount, req.description);
    return this.ok(tx);
}

private applyTransfer(req: TransferRequest): ApiResponse<Transaction> {
    const bad = this.checkAmount<Transaction>(req.amount);
    if(bad) return bad;
    const from = this.accounts.find((a) => a.id === req.fromAccountId );
    const to = this.accounts.find((a) => a.accountNumber === req.toAccountNumber );
    if(!from) return this.fail('ACCOUNT_NOT_FOUND', 'your account was not found' );
    if(!to) return this.fail('ACCOUNT_NOT_FOUND', 'recipient account was not found' );
    if(from.id === to.id) return this.fail('VALIDATION_ERROR', 'you cant transfer to your own account' );
    if(req.amount > from.balance) return this.fail('INSUFFICIENT_FUNDS', 'insufficient funds' );

    from.balance = this.round2(from.balance - req.amount);
    to.balance = this.round2(to.balance + req.amount);
    const out = this.record(from, 'TRANSFER_OUT', req.amount, req.description, to.accountNumber);
    this.record(to, 'TRANSFER_IN', req.amount, req.description, from.accountNumber);
    return this.ok(out);
}

//helpers
private record(
    account: Account,
    type: Transaction['type'],
    amount: number,
    description?: string,
    relatedAccountNumber?: string,
): Transaction {
    const tx: Transaction = {
        id: `t${this.transactions.length + 1}`,
        accountId: account.id,
        type,
        amount: this.round2(amount),
        balanceAfter: account.balance,
        createdAt: new Date().toISOString(),
        ...(description ? { description } : {}),
        ...(relatedAccountNumber ? { relatedAccountNumber} : {}),
    };
    this.transactions.push(tx);
    return tx;
}

private checkAmount<T>(amount: number): ApiResponse<T> | null {
    if(!Number.isFinite(amount) || amount <= 0) {
        return this.fail<T>('VALIDATION_ERROR', 'amount must be greater than 0');
    }
    return null;
}

private load(): Observable<void> {
    if(!this.data$) {
        this.data$ = forkJoin({
            accounts: this.http.get<Account[]>('/mock/transactions.json'),
            transactions: this.http.get<Transaction[]>('/mock/transactions.json'),
            recipients: this.http.get<Recipient[]>('/mock/recipients.json')
        }).pipe(
            map(({ accounts, transactions, recipients }) => {
                this.accounts = accounts;
                this.transactions = transactions;
                this.recipients = recipients;
            }),
            shareReplay(1),
        );
    }
    return this.data$;
}

private round2(n: number): number {
    return Math.round(n * 100) / 100;
}

private ok<T>(data: T): ApiResponse<T> {
    return { success: true, data};
}

private fail<T>(code: ApiErrorCode, message: string): ApiResponse<T> {
    return { success: false, error: { code, message}};
}
}