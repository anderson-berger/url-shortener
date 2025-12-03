import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from 'src/schemas/auth.schemas';
import api from './api';

class AuthService {
  async register(input: RegisterRequest) {
    const { data } = await api.post<RegisterResponse>('/register', input);
    return data;
  }

  async login(input: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/login', input);
    localStorage.setItem('auth', JSON.stringify(data));
    return data;
  }

  logout() {
    localStorage.removeItem('auth');
  }
}
export default new AuthService();
