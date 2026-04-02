import { ArrowRight, Eye, EyeOff, ShieldCheck, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import AuthHeader from "../../components/AuthHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import authService from "../../services/auth.service";
import { useAuthStore } from "../../stores/useAuthStore";
import type { RegisterPayload } from "../../types";

const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm password"),
    role: z.enum(["student", "instructor"]),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [searchParams] = useSearchParams();
  const roleFromQuery = searchParams.get("role");
  const defaultRole = roleFromQuery === "instructor" ? "instructor" : "student";

  const [otpValue, setOtpValue] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<Omit<
    RegisterPayload,
    "otp"
  > | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: defaultRole,
    },
  });

  const selectedRole = watch("role");

  const otpHelpText = useMemo(() => {
    if (!pendingPayload?.email) {
      return "";
    }

    return `An OTP has been sent to ${pendingPayload.email}. Enter it to complete registration.`;
  }, [pendingPayload?.email]);

  const parseErrorMessage = (error: unknown, fallback: string) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: unknown }).response === "object"
    ) {
      const message = (error as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      if (message) {
        return message;
      }
    }

    return fallback;
  };

  const sendOtpMutation = useMutation({
    mutationFn: (email: string) =>
      authService.sendOtp({
        email,
        purpose: "REGISTER",
      }),
    onSuccess: (response) => {
      setErrorMessage("");
      setOtpMessage(response.message || "OTP sent successfully.");
      setIsOtpModalOpen(true);
    },
    onError: (error: unknown) => {
      setErrorMessage(parseErrorMessage(error, "Failed to send OTP."));
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onError: (error: unknown) => {
      setOtpMessage(
        parseErrorMessage(error, "Invalid OTP or register failed."),
      );
    },
  });

  const loginAfterRegisterMutation = useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      authService.login(payload),
    onSuccess: (response) => {
      setAuth(response.user, response.accessToken);
      if (response.user.role === "instructor") {
        navigate("/instructor/courses", { replace: true });
      } else {
        navigate("/student", { replace: true });
      }
    },
    onError: (error: unknown) => {
      setOtpMessage(
        parseErrorMessage(
          error,
          "Registration succeeded but auto login failed.",
        ),
      );
    },
  });

  const onSubmit = (values: SignUpFormValues) => {
    setErrorMessage("");
    setOtpMessage("");
    setOtpValue("");

    const payload = {
      email: values.email.trim(),
      password: values.password,
      fullName: values.fullName.trim(),
      role: values.role,
    } as Omit<RegisterPayload, "otp">;

    setPendingPayload(payload);
    sendOtpMutation.mutate(payload.email);
  };

  const handleConfirmOtp = async () => {
    if (!pendingPayload) {
      return;
    }

    const otp = otpValue.trim();
    if (!otp) {
      setOtpMessage("Please enter OTP.");
      return;
    }

    try {
      await registerMutation.mutateAsync({
        ...pendingPayload,
        otp,
      });

      await loginAfterRegisterMutation.mutateAsync({
        email: pendingPayload.email,
        password: pendingPayload.password,
      });
    } catch {
      // handled by mutation callbacks
    }
  };

  const closeOtpModal = () => {
    if (registerMutation.isPending || loginAfterRegisterMutation.isPending) {
      return;
    }

    setIsOtpModalOpen(false);
    setOtpValue("");
  };

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      <AuthHeader
        promptText="Already have an account?"
        actionLabel="Sign In"
        actionTo="/login"
      />

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center p-6 sm:p-8 lg:p-12">
        <section className="w-full max-w-2xl">
          <div className="space-y-8">
            <h1 className="text-center text-3xl font-semibold leading-tight text-neutral-800 sm:text-4xl">
              Create your account
            </h1>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {errorMessage ? (
                <div className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
                  {errorMessage}
                </div>
              ) : null}

              <Input
                label="Full Name"
                placeholder="Your full name"
                {...register("fullName")}
                error={errors.fullName?.message}
              />

              <Input
                label="Email"
                type="email"
                placeholder="Email address"
                {...register("email")}
                error={errors.email?.message}
              />

              <div className="space-y-2">
                <p className="text-sm font-medium text-neutral-800">
                  Register as
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                      selectedRole === "student"
                        ? "border-primary-400 bg-primary-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      value="student"
                      className="h-4 w-4"
                      {...register("role")}
                    />
                    <span className="text-sm font-medium text-neutral-800">
                      Student
                    </span>
                  </label>
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                      selectedRole === "instructor"
                        ? "border-secondary-400 bg-secondary-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      value="instructor"
                      className="h-4 w-4"
                      {...register("role")}
                    />
                    <span className="text-sm font-medium text-neutral-800">
                      Instructor
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Create password"
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
                <Input
                  label="Confirm Password"
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm password"
                  rightIcon={
                    isConfirmPasswordVisible ? (
                      <Eye className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    )
                  }
                  onRightIconClick={() =>
                    setIsConfirmPasswordVisible((visible) => !visible)
                  }
                  rightIconAriaLabel={
                    isConfirmPasswordVisible
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  {...register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                />
              </div>

              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <label className="flex items-center gap-2 text-sm text-gray-500">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    defaultChecked
                  />
                  <span>
                    I Agree with all of your{" "}
                    <span className="text-secondary-500">
                      Terms &amp; Conditions
                    </span>
                  </span>
                </label>

                <Button
                  type="submit"
                  colorScheme="primary"
                  className="w-full sm:w-auto"
                  isLoading={sendOtpMutation.isPending}
                >
                  Send OTP
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {isOtpModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-neutral-800">
                  Verify OTP
                </h2>
                <p className="mt-1 text-sm text-gray-600">{otpHelpText}</p>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                onClick={closeOtpModal}
                aria-label="Close OTP modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {otpMessage ? (
              <div className="mt-4 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-700">
                {otpMessage}
              </div>
            ) : null}

            <div className="mt-5 space-y-4">
              <Input
                label="OTP Code"
                value={otpValue}
                onChange={(event) => setOtpValue(event.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  colorScheme="gray"
                  className="flex-1"
                  onClick={closeOtpModal}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="primary"
                  className="flex-1"
                  onClick={handleConfirmOtp}
                  isLoading={
                    registerMutation.isPending ||
                    loginAfterRegisterMutation.isPending
                  }
                >
                  <ShieldCheck className="h-4 w-4" />
                  Verify & Register
                </Button>
              </div>

              <p className="text-xs text-gray-500">
                Didn&apos;t receive OTP?{" "}
                <button
                  type="button"
                  className="font-semibold text-primary-600 hover:underline"
                  onClick={() => {
                    if (pendingPayload?.email) {
                      sendOtpMutation.mutate(pendingPayload.email);
                    }
                  }}
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
