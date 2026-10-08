import { Injectable } from '@angular/core';

import { Account } from '../models';
import accounts from '../mock/accounts.json';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private accounts = accounts as Account[];

  getAccountByUserId(userId: string): Account | null {
    const account = this.accounts.find(
      (item) => item.userId === userId
    );

    return account ?? null;
  }

  getAccountById(accountId: string): Account | null {
    const account = this.accounts.find(
      (item) => item.id === accountId
    );

    return account ?? null;
  }
}
