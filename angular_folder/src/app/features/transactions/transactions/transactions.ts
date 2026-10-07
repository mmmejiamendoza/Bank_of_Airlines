import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Account, ApiResponse, Transaction } from '../../../core/models';
import { TransactionService } from '../../../core/services/transaction.service';

type Mode = 'deposit' | 'withdraw' | 'transfer';

@Component({
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe],
  selector: 'app-transactions',
  styleUrl: './transactions.css',
  templateUrl: './transactions.html',
})
export class Transactions implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(TransactionService);

  readonly accountId = 'a1';

  mode = signal<Mode>('deposit');
  loading = signal(false);
  account = signal<Account | null>(null);
  transactions = signal<Transaction[]>([]);
  feedback = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  private amountRules = [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d{1, 2})?$/)];

  depositForm = this.fb.group({ amount: ['', this.amountRules], description: [''] });
  withdrawForm = this.fb.group({ amount: ['', this.amountRules], description: [''] });
  transferForm = this.fb.group({ toAccountNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], amount: ['', this.amountRules], description: [''], });

  ngOnInit() {
    this.refresh();
  }

  setMode(mode: Mode) {
    this.mode.set(mode);
    this.feedback.set(null);
  }

  isCredit(t: Transaction): boolean {
    return t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN';
  }

  onDeposit() {
    if(this.depositForm.invalid) return this.depositForm.markAllAsTouched();
    const{ amount, description } = this.depositForm.getRawValue();
    this.run(
      this.service.deposit({ accountId: this.accountId, amount: Number(amount), description: description || undefined}),
      this.depositForm,
    );
  }

  onWithdraw() {
    if(this.withdrawForm.invalid) return this.withdrawForm.markAllAsTouched();
    const{ amount, description } = this.withdrawForm.getRawValue();
    this.run(
      this.service.withdraw({ accountId: this.accountId, amount: Number(amount), description: description || undefined}),
      this.withdrawForm,
    );
  }

  onTransfer() {
    if(this.transferForm.invalid) return this.transferForm.markAllAsTouched();
    const{ toAccountNumber, amount, description} = this.transferForm.getRawValue();
    this.run(
      this.service.transfer({
        fromAccountId: this.accountId,
        toAccountNumber: toAccountNumber!,
        amount: Number(amount),
        description: description || undefined,
      }),
      this.transferForm,
    );
  }

  private run(request$: Observable<ApiResponse<Transaction>>, form: FormGroup) {
    this.loading.set(true);
    this.feedback.set(null);
    request$.subscribe({
      next: (res) => {
        this.loading.set(false);
        if(res.success) {
          this.feedback.set({ type: 'success', text: 'Transaction completed'});
          form.reset({ amount: '', description: '', toAccountNumber: ''});
          this.refresh();
        } else {
          this.feedback.set({ type: 'error', text: res.error?.message ?? 'something went wrong'});
        }
      },
      error: () => {
        this.loading.set(false);
        this.feedback.set({ type: 'error', text: 'service unavailable. please try again'});
      },
    });
  }

  private refresh() {
    this.service.getAccount(this.accountId).subscribe((res) => this.account.set(res.data ?? null));
    this.service.getTransactions(this.accountId).subscribe((res) => this.transactions.set(res.data ?? []));
  }
}
