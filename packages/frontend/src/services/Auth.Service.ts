import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from 'src/schemas/auth.schemas';
import api from './api';

class AuthService {
  private readonly AUTH_KEY = 'auth';

  async register(input: RegisterRequest): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>('/api/register', input);
    return data;
  }

  async login(input: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/api/login', input);
    this.setAuth(data);
    return data;
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
  }

  isAuthenticated(): boolean {
    return this.getAuth() !== null;
  }

  getAuth(): LoginResponse | null {
    const authData = localStorage.getItem(this.AUTH_KEY);
    if (!authData) return null;

    try {
      return JSON.parse(authData);
    } catch {
      this.logout();
      return null;
    }
  }

  private setAuth(data: LoginResponse): void {
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(data));
  }
}

export default new AuthService();
