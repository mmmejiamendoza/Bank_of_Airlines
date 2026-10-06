// CONTRACT LAYER (just a draft to start it)
//must sync it w/API_CONTRACT.md and the mock JSON in mock


//id will stay string since the form inputs in a url value are alr strings
// it avoids conversions/bugs.

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface AuthRequest {
    user: User;
    token: string;
}