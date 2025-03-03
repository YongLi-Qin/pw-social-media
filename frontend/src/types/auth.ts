export interface AuthResponse {
    token: string;
    email: string;
    name: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest extends LoginRequest {
    name: string;
} 