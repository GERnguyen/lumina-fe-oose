import axiosClient, { ACCESS_TOKEN_KEY } from "../api/axiosClient";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  User,
} from "../types";

const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await axiosClient.post<LoginResponse, LoginResponse>(
      "/auth/login",
      credentials,
    );

    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    return response;
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    return axiosClient.post<RegisterResponse, RegisterResponse>(
      "/auth/register",
      payload,
    );
  },

  async getProfile(): Promise<User> {
    return axiosClient.get<User, User>("/users/me");
  },
};

export default authService;
