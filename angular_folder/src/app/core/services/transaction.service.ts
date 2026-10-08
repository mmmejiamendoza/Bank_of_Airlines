import { Injectable } from '@angular/core';

import { Transaction } from '../models';
import transactions from '../mock/transactions.json';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private transactions = transactions as Transaction[];

  getTransactionsByAccountId(accountId: string): Transaction[] {
    return this.transactions
      .filter((transaction) => transaction.accountId === accountId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
  }

  getRecentTransactions(
    accountId: string,
    limit: number = 5
  ): Transaction[] {
    return this.getTransactionsByAccountId(accountId)
      .slice(0, limit);
  }
}
