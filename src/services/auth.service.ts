import axiosClient, { ACCESS_TOKEN_KEY } from "../api/axiosClient";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  SendOtpPayload,
  User,
} from "../types";

const authService = {
  async sendOtp(payload: SendOtpPayload): Promise<{ message: string }> {
    return axiosClient.post<{ message: string }, { message: string }>(
      "/auth/send-otp",
      payload,
    );
  },

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

  async updateProfile(payload: {
    fullName?: string;
    avatar?: string;
    bio?: string;
  }): Promise<User> {
    return axiosClient.put<User, User>("/users/profile", payload);
  },

  async sendUpdateOtp(): Promise<{ message: string }> {
    return axiosClient.post<{ message: string }, { message: string }>(
      "/users/send-update-otp",
      {},
    );
  },

  async updateSensitive(payload: {
    otp: string;
    newPassword?: string;
    newEmail?: string;
    newPhone?: string;
  }): Promise<User> {
    return axiosClient.put<User, User>("/users/update-sensitive", payload);
  },
};

export default authService;
