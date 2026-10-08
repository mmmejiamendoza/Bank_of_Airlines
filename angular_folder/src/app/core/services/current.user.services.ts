import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../models';

const USER_KEY = 'bank-of-airlines-current-user-v1';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly current = signal<User | null>(this.restore());

  readonly user = this.current.asReadonly();

  readonly fullName = computed(() => {
    const u = this.current();
    return u ? `${u.firstName} ${u.lastName}` : '';
  });

  setUser(user: User | null): void {
    this.current.set(user);
    if (!this.isBrowser) return;
    try {
      if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      else sessionStorage.removeItem(USER_KEY);
    } catch {
      /* storage unavailable: keep going in memory */
    }
  }

  private restore(): User | null {
    if (!this.isBrowser) return null; // the server has no sessionStorage
    try {
      const raw = sessionStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}