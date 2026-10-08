import { computed, Injectable, signal } from '@angular/core';
import { User } from '../models';

// TEMPORARY stand-in until login is merged. Once the login feature calls setUser(),
// change this default to null and delete TEMP_USER.
const TEMP_USER: User = { id: 'RP1001', firstName: 'Rose', lastName: 'Perez', email: 'rosep@gmail.com' };

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private readonly current = signal<User | null>(TEMP_USER);

  readonly user = this.current.asReadonly();

  readonly fullName = computed(() => {
    const u = this.current();
    return u ? `${u.firstName} ${u.lastName}` : '';
  });

  setUser(user: User | null): void {
    this.current.set(user);
  }
}