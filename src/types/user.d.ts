type User = {
    _id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    admin?:boolean;
    staff?:boolean;
    active?:boolean;
}

interface AuthResponse {
    user: User;
    token: string;
}

interface LoginFormData {
    email: string;
    password: string;
}

interface UserFormData {
    email: string;
    password?: string;
    staff: boolean;
    admin: boolean;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}