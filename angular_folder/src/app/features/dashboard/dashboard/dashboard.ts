import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CurrencyPipe,
  DatePipe,
  UpperCasePipe
} from '@angular/common';

import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { AccountService } from '../../../core/services/account.service';
import { TransactionService } from '../../../core/services/transaction.service';

import {
  Account,
  Transaction,
  User
} from '../../../core/models';

@Component({
  selector: 'app-dashboard',
  imports: [
    CurrencyPipe,
    DatePipe,
    UpperCasePipe,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  private authService = inject(AuthService);
  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);
  private cdr = inject(ChangeDetectorRef);

  currentUser: User | null = null;

  account: Account | null = null;

  /*
   * The current mock contract provides one account per user.
   * checkingAccount is the account supplied by AccountService.
   */
  checkingAccount: Account | null = null;

  /*
   * Savings is kept optional because the current mock data
   * does not contain a separate savings account.
   */
  savingsAccount: Account | null = null;

  recentTransactions: Transaction[] = [];

  checkingTransactions: Transaction[] = [];

  savingsTransactions: Transaction[] = [];

  isLoading = true;

  today = new Date();

  /*
   * Simple mock activity values used only for the dashboard
   * visual chart. The backend can replace these later.
   */
 activity = [
  {
    month: 'MAY',
    deposits: 35,
    withdrawals: 18,
    transfers: 25
  },
  {
    month: 'JUN',
    deposits: 55,
    withdrawals: 30,
    transfers: 40
  },
  {
    month: 'JUL',
    deposits: 42,
    withdrawals: 24,
    transfers: 32
  },
  {
    month: 'AUG',
    deposits: 68,
    withdrawals: 38,
    transfers: 52
  },
  {
    month: 'SEP',
    deposits: 50,
    withdrawals: 32,
    transfers: 45
  }
];

activityMaximum = 100;

  ngOnInit(): void {
    setTimeout(() => {
      this.loadDashboard();

      this.isLoading = false;

      this.cdr.detectChanges();
    }, 700);
  }

  private loadDashboard(): void {

    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      return;
    }

    this.account =
      this.accountService.getAccountByUserId(
        this.currentUser.id
      );

    this.checkingAccount = this.account;

    this.savingsAccount = null;

    if (this.checkingAccount) {
      // Call getTransactions and subscribe to the Observable
      this.transactionService.getTransactions(this.checkingAccount.id).subscribe({
        next: (response: any) => {
          // Adjust based on your API response wrapper (e.g., response.data or response directly)
          const transactions = Array.isArray(response) ? response : (response?.data || []);
          
          this.checkingTransactions = transactions;
          this.recentTransactions = transactions.slice(0, 5);
          
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error loading transactions:', err)
      });
    }

    this.savingsTransactions = [];
  }

  getTransactionIcon(transaction: Transaction): string {

    if (transaction.type === 'DEPOSIT') {
      return '+';
    }

    if (transaction.type === 'WITHDRAW') {
      return '−';
    }

    return '↗';
  }

  getTransactionClass(transaction: Transaction): string {

    if (transaction.type === 'DEPOSIT') {
      return 'deposit';
    }

    if (transaction.type === 'WITHDRAW') {
      return 'withdraw';
    }

    return 'transfer';
  }

  getTransactionAmount(transaction: Transaction): string {

    if (transaction.type === 'DEPOSIT') {
      return `+$${transaction.amount.toFixed(2)}`;
    }

    if (transaction.type === 'WITHDRAW') {
      return `-$${transaction.amount.toFixed(2)}`;
    }

    return `$${transaction.amount.toFixed(2)}`;
  }

  getBarHeight(
    value: number,
    maximum: number
  ): number {

    if (maximum <= 0) {
      return 0;
    }

    return Math.max(
      8,
      Math.min(100, (value / maximum) * 100)
    );
  }
}
