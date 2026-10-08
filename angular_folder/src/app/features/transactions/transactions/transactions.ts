import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Account, ApiResponse, Recipient, Transaction } from '../../../core/models';
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
  recipients = signal<Recipient[]>([]);
  selectedAccountNumber = signal<string | null>(null);
  feedback = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  private amountRules = [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d{1, 2})?$/)];

  depositForm = this.fb.group({ amount: ['', this.amountRules], description: [''] });
  withdrawForm = this.fb.group({ amount: ['', this.amountRules], description: [''] });
  transferForm = this.fb.group({ toAccountNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], amount: ['', this.amountRules], description: [''], });

  totals = computed(() => {
    let income = 0;
    let expenses = 0;
    for (const t of this.transactions()) {
      if (this.isCredit(t)) income += t.amount;
      else expenses += t.amount;
    }
    return { income, expenses };
  });

  chart = computed(() => {
    const txs = this.transactions();
    const end = txs.length ? new Date(txs[0].createdAt) : new Date();

    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(end);
      date.setDate(end.getDate() - (6 - i));
      return { date, key: this.dayKey(date), income: 0, expenses: 0 };
    });

    for (const t of txs) {
      const day = days.find((d) => d.key === this.dayKey(new Date(t.createdAt)));
      if (!day) continue;
      if (this.isCredit(t)) day.income += t.amount;
      else day.expenses += t.amount;
    }

    const max = Math.max(1, ...days.flatMap((d) => [d.income, d.expenses]));
    const slot = 50; // the width
    const barW = 14;
    const base = 140;
    const usable = 130;

    return days.map((d, i) => {
      const incomeH = (d.income / max) * usable;
      const expenseH = (d.expenses / max) * usable;
      const x = i * slot + (slot - (barW * 2 + 4)) / 2;
      return {
        label: d.date.toLocaleDateString('en-US', { weekday: 'short' }),
        labelX: i * slot + slot / 2,
        income: d.income,
        expenses: d.expenses,
        incomeX: x,
        incomeY: base - incomeH,
        incomeH,
        expenseX: x + barW + 4,
        expenseY: base - expenseH,
        expenseH,
      };
    });
  });

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

  initials(r: Recipient): string {
    return (r.firstName[0] + r.lastName[0]).toUpperCase();
  }

  pickRecipient(r: Recipient) {
    this.setMode('transfer');
    this.transferForm.patchValue({ toAccountNumber: r.accountNumber});
    this.selectedAccountNumber.set(r.accountNumber);
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
    this.service.getRecipients(this.accountId).subscribe((res) => this.recipients.set(res.data ?? []));
  }

  private dayKey(d: Date): string {
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }
}
