# Bank of CLI - API Contract

## Overview

This document defines the data structures used by the Bank of CLI frontend.

The frontend currently uses mock JSON data. These contracts define the exact structure that a future backend API should use so that the frontend can be connected to the backend later without changing the application's data models.

---

## 1. User

Represents a registered banking customer.

### User Object

{
"id": "ML1001",
"firstName": "Molly",
"lastName": "Lee",
"email": "molly.lee@example.com"
}

### User Fields

| Field     | Type   | Required | Description          |
| --------- | ------ | -------- | -------------------- |
| id        | string | Yes      | Unique user ID       |
| firstName | string | Yes      | User's first name    |
| lastName  | string | Yes      | User's last name     |
| email     | string | Yes      | User's email address |

---

## 2. Login Request

Used when a user attempts to log into the application.

### Request

{
"identifier": "molly.lee@example.com",
"password": "1234"
}

The identifier can be either the user's email address or user ID.

### Fields

| Field      | Type   | Required | Description           |
| ---------- | ------ | -------- | --------------------- |
| identifier | string | Yes      | User email or user ID |
| password   | string | Yes      | User password         |

---

## 3. Register Request

Used when a new user creates an account.

### Request

{
"firstName": "Molly",
"lastName": "Lee",
"email": "molly.lee@example.com",
"password": "1234"
}

### Fields

| Field     | Type   | Required | Description          |
| --------- | ------ | -------- | -------------------- |
| firstName | string | Yes      | User's first name    |
| lastName  | string | Yes      | User's last name     |
| email     | string | Yes      | User's email address |
| password  | string | Yes      | User's password      |

After successful registration, the frontend returns the user to the Login page so the user can log in with the newly created credentials.

---

## 4. Authentication Response

Returned after a successful login.

### Response

{
"user": {
"id": "ML1001",
"firstName": "Molly",
"lastName": "Lee",
"email": "molly.lee@example.com"
},
"token": "mock-token-ML1001"
}

### Fields

| Field | Type   | Required | Description                      |
| ----- | ------ | -------- | -------------------------------- |
| user  | User   | Yes      | Authenticated user's information |
| token | string | Yes      | Authentication token             |

The current token is simulated for frontend development. A production backend should provide a secure authentication token.

---

## 5. Account

Represents a user's bank account.

### Account Object

{
"id": "AC1001",
"userId": "ML1001",
"accountNumber": "10001001",
"balance": 2450.00,
"currency": "USD"
}

### Account Fields

| Field         | Type   | Required | Description                    |
| ------------- | ------ | -------- | ------------------------------ |
| id            | string | Yes      | Unique account ID              |
| userId        | string | Yes      | ID of the account owner        |
| accountNumber | string | Yes      | Customer-facing account number |
| balance       | number | Yes      | Current account balance        |
| currency      | string | Yes      | Account currency               |

---

## 6. Transaction

Represents a completed banking transaction.

### Transaction Object

{
"id": "TX1001",
"accountId": "AC1001",
"type": "DEPOSIT",
"amount": 1000.00,
"description": "Direct deposit",
"balanceAfter": 2500.00,
"createdAt": "2026-10-07T14:30:00Z"
}

### Transaction Fields

| Field        | Type   | Required | Description                                      |
| ------------ | ------ | -------- | ------------------------------------------------ |
| id           | string | Yes      | Unique transaction ID                            |
| accountId    | string | Yes      | Account associated with the transaction          |
| type         | string | Yes      | Transaction type: DEPOSIT, WITHDRAW, or TRANSFER |
| amount       | number | Yes      | Transaction amount                               |
| description  | string | No       | Optional transaction description                 |
| balanceAfter | number | Yes      | Account balance after the transaction            |
| createdAt    | string | Yes      | Transaction date and time in ISO 8601 format     |

---

## 7. Deposit Request

Used to deposit money into an account.

### Request

{
"accountId": "AC1001",
"amount": 100.00,
"description": "Cash deposit"
}

### Fields

| Field       | Type   | Required | Description                      |
| ----------- | ------ | -------- | -------------------------------- |
| accountId   | string | Yes      | Account receiving the deposit    |
| amount      | number | Yes      | Amount to deposit                |
| description | string | No       | Optional transaction description |

The deposit amount must be greater than zero.

---

## 8. Withdraw Request

Used to withdraw money from an account.

### Request

{
"accountId": "AC1001",
"amount": 50.00,
"description": "ATM withdrawal"
}

### Fields

| Field       | Type   | Required | Description                      |
| ----------- | ------ | -------- | -------------------------------- |
| accountId   | string | Yes      | Account making the withdrawal    |
| amount      | number | Yes      | Amount to withdraw               |
| description | string | No       | Optional transaction description |

The withdrawal amount must be greater than zero.

The account must have enough funds to complete the withdrawal.

---

## 9. Transfer Request

Used to transfer money from one account to another account.

### Request

{
"fromAccountId": "AC1001",
"toAccountNumber": "10001002",
"amount": 200.00,
"description": "Transfer to savings"
}

### Fields

| Field           | Type   | Required | Description                      |
| --------------- | ------ | -------- | -------------------------------- |
| fromAccountId   | string | Yes      | Account sending the money        |
| toAccountNumber | string | Yes      | Account receiving the money      |
| amount          | number | Yes      | Amount to transfer               |
| description     | string | No       | Optional transaction description |

The transfer amount must be greater than zero.

The sending account must have enough funds to complete the transfer.

---

## 10. API Response

The frontend uses a common response structure for successful and failed operations.

### Successful Response

{
"success": true,
"data": {}
}

### Error Response

{
"success": false,
"error": {
"code": "INVALID_CREDENTIALS",
"message": "Invalid email, user ID, or password."
}
}

### Error Fields

| Field   | Type    | Required | Description                              |
| ------- | ------- | -------- | ---------------------------------------- |
| success | boolean | Yes      | Indicates whether the request succeeded  |
| data    | object  | No       | Data returned after a successful request |
| error   | object  | No       | Error information when a request fails   |

### Error Object

{
"code": "INVALID_CREDENTIALS",
"message": "Invalid email, user ID, or password."
}

### Error Codes

| Code                | Description                              |
| ------------------- | ---------------------------------------- |
| VALIDATION_ERROR    | Request contains invalid or missing data |
| INVALID_CREDENTIALS | Login credentials are incorrect          |
| EMAIL_ALREADY_TAKEN | Email is already registered              |
| ACCOUNT_NOT_FOUND   | Requested account does not exist         |
| INSUFFICIENT FUNDS  | Account does not have enough money       |
| UNAUTHORIZED        | User is not authorized                   |

---

## 11. Frontend Validation Requirements

The frontend validates user input before submitting requests.

### Authentication Validation

- Required fields cannot be empty.
- Email must use a valid email format.
- Password must meet the application's minimum length.
- Registration passwords must match.
- Duplicate email addresses cannot be registered.

### Transaction Validation

- Amount cannot be empty.
- Amount must be greater than zero.
- Required account fields cannot be empty.
- Transfer destination cannot be empty.
- Withdrawals cannot exceed the available account balance.
- Transfers cannot exceed the available account balance.

---

## 12. Mock Data

The frontend currently uses local JSON files instead of a backend API.

Mock data is stored in:

src/app/core/mock/

The current mock files are:

- users.json
- credentials.json
- accounts.json
- transactions.json

The mock JSON data must follow the structures defined in this API contract.

---

## 13. TypeScript Contract Layer

The TypeScript interfaces used by the frontend are stored in:

src/app/core/models/

The current model files are:

- user.model.ts
- account.model.ts
- transaction.model.ts
- api-response.model.ts

These interfaces define the expected data structures used throughout the Angular application.

---

## 14. Service Layer

The service layer is responsible for handling application data and communicating with the mock data during frontend development.

Current services include:

src/app/core/services/auth.service.ts

src/app/core/services/account.service.ts

Components should communicate with services instead of directly accessing mock data.

This allows the mock data source to be replaced by backend API calls later.

---

## 15. Authentication Flow

### Login

1. User enters their email or user ID.
2. User enters their password.
3. Frontend validates that required fields are present.
4. AuthService checks the mock credentials.
5. If credentials are valid, the user is authenticated.
6. The user is redirected to the Dashboard.
7. The current user is stored in browser local storage for the frontend session.

### Invalid Login

If the credentials are incorrect:

{
"success": false,
"error": {
"code": "INVALID_CREDENTIALS",
"message": "Invalid email, user ID, or password."
}
}

The user remains on the Login page and receives an error message.

### Registration

1. User enters first name.
2. User enters last name.
3. User enters email.
4. User enters password.
5. User confirms their password.
6. Frontend validates the information.
7. AuthService creates a new mock user.
8. A unique user ID is generated.
9. The user is redirected to the Login page.
10. The user can log in using the newly created credentials.

---

## 16. User ID Generation

User IDs are generated using:

First Initial + Last Initial + Four Digit Number

Example:

Molly Lee → ML1001

James Smith → JS1002

The numeric portion increases for each newly created mock user.

---

## 17. Route Protection

Authenticated pages are protected by the application's authentication guard.

Protected routes currently include:

/dashboard

/transactions

Unauthenticated users attempting to access a protected route are redirected to:

/login

---

## 18. Future Backend Integration

The current frontend uses mock JSON data for development.

When the backend is implemented, the mock data can be replaced with HTTP API requests.

The backend should return data that follows the structures defined in this document.

The frontend component layer should not directly communicate with the backend.

Instead:

Component
↓
Service
↓
Backend API
↓
Database

During the current mock-data phase:

Component
↓
Service
↓
Mock JSON Data

This allows the frontend to be developed and tested before the backend is available.

---

## 19. Contract Compatibility

Any future backend implementation should maintain the field names, data types, and general structures defined in this document.

Changes to the contract should be communicated between the frontend and backend teams before implementation.

The goal is to allow the frontend to transition from mock data to real API data with minimal changes to the component layer.s
