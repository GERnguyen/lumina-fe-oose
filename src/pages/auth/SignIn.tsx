import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthHeader from "../../components/AuthHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import authService from "../../services/auth.service";
import { useAuthStore } from "../../stores/useAuthStore";
import type { LoginCredentials } from "../../types";

// Validation schema với Zod
const signInSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignIn() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Setup form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  // Setup mutation
  const { mutate: login, isPending } = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (response) => {
      setErrorMessage("");
      // Lưu auth state
      setAuth(response.user, response.accessToken);

      // Chuyển hướng dựa trên role
      if (response.user.role === "instructor") {
        navigate("/instructor/courses", { replace: true });
      } else {
        navigate("/student", { replace: true });
      }
    },
    onError: (error: unknown) => {
      const fallbackMessage = "Login failed. Please check your credentials.";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: unknown }).response === "object" &&
        (error as { response?: { data?: { message?: string } } }).response
      ) {
        const message = (
          error as { response?: { data?: { message?: string } } }
        ).response?.data?.message;
        setErrorMessage(message || fallbackMessage);
        return;
      }

      setErrorMessage(fallbackMessage);
    },
  });

  // Handle form submission
  const onSubmit = (data: SignInFormValues) => {
    login(data);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      <AuthHeader
        promptText="Don't have an account?"
        actionLabel="Create Account"
        actionTo="/register"
      />

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center p-6 sm:p-8 lg:p-12">
        <section className="w-full max-w-2xl">
          <div className="space-y-8">
            <h1 className="text-center text-3xl font-semibold leading-tight text-neutral-800 sm:text-4xl">
              Sign in to your account
            </h1>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {errorMessage ? (
                <div className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
                  {errorMessage}
                </div>
              ) : null}

              <Input
                label="Email"
                type="email"
                placeholder="Username or email address..."
                {...register("email")}
                error={errors.email?.message}
              />

              <Input
                label="Password"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Password"
                rightIcon={
                  isPasswordVisible ? (
                    <Eye className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  )
                }
                onRightIconClick={() =>
                  setIsPasswordVisible((visible) => !visible)
                }
                rightIconAriaLabel={
                  isPasswordVisible ? "Hide password" : "Show password"
                }
                {...register("password")}
                error={errors.password?.message}
              />

              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  Remember me
                </label>

                <Button
                  type="submit"
                  colorScheme="primary"
                  className="w-full sm:w-auto"
                  disabled={isPending}
                >
                  {isPending ? "Signing In..." : "Sign In"}
                </Button>
              </div>
            </form>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-neutral-800">
                New to Cinx? Choose how you want to register
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link to="/register?role=student" className="block">
                  <Button
                    variant="outline"
                    colorScheme="primary"
                    className="w-full"
                  >
                    Register as Student
                  </Button>
                </Link>
                <Link to="/register?role=instructor" className="block">
                  <Button
                    variant="outline"
                    colorScheme="secondary"
                    className="w-full"
                  >
                    Register as Instructor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
