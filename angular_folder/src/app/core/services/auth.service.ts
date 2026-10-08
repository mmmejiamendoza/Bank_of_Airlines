import { Injectable } from '@angular/core';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse
} from '../models';

import users from '../mock/users.json';
import credentials from '../mock/credentials.json';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private users: User[] = users;

  private credentials: {
    userId: string;
    password: string;
  }[] = credentials;

  private currentUser: User | null = null;

  login(request: LoginRequest): ApiResponse<AuthResponse> {

    const credential = this.credentials.find(
      (item) =>
        item.userId === request.identifier ||
        this.findUserById(item.userId)?.email === request.identifier
    );

    if (!credential || credential.password !== request.password) {
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email, user ID, or password.'
        }
      };
    }

    const user = this.findUserById(credential.userId);

    if (!user) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User could not be found.'
        }
      };
    }

    this.currentUser = user;

    // Save the logged-in user in the browser for route protection.
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }

    return {
      success: true,
      data: {
        user,
        token: `mock-token-${user.id}`
      }
    };
  }

  register(request: RegisterRequest): ApiResponse<User> {

    const emailExists = this.users.some(
      (user) => user.email.toLowerCase() === request.email.toLowerCase()
    );

    if (emailExists) {
      return {
        success: false,
        error: {
          code: 'EMAIL_ALREADY_TAKEN',
          message: 'An account with this email already exists.'
        }
      };
    }

    const newUserId = this.generateUserId(
      request.firstName,
      request.lastName
    );

    const newUser: User = {
      id: newUserId,
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email
    };

    this.users.push(newUser);

    this.credentials.push({
      userId: newUserId,
      password: request.password
    });

    return {
      success: true,
      data: newUser
    };
  }

  getCurrentUser(): User | null {

    if (this.currentUser) {
      return this.currentUser;
    }

    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');

      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }

    return this.currentUser;
  }

  logout(): void {
    this.currentUser = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  }

  private findUserById(userId: string): User | undefined {
    return this.users.find((user) => user.id === userId);
  }

  private generateUserId(
    firstName: string,
    lastName: string
  ): string {

    const nextNumber = 1001 + this.users.length;

    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();

    return `${firstInitial}${lastInitial}${nextNumber}`;
  }
}
