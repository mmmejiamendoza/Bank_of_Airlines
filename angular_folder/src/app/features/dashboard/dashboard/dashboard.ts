import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CurrencyPipe,
  DatePipe
} from '@angular/common';

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
    DatePipe
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
  recentTransactions: Transaction[] = [];

  isLoading = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.currentUser = this.authService.getCurrentUser();

      if (this.currentUser) {
        this.account =
          this.accountService.getAccountByUserId(
            this.currentUser.id
          );

        if (this.account) {
          this.recentTransactions =
            this.transactionService.getRecentTransactions(
              this.account.id,
              5
            );
        }
      }

      this.isLoading = false;

      this.cdr.detectChanges();
    }, 700);
  }
}
