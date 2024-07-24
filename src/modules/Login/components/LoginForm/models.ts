export interface LoginFormFields {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    expires_in: number;
    role: string | null; // TODO: Really string?
    token_type: string;
}
