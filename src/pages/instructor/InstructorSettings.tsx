import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Alert, { type AlertVariant } from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import authService from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";

interface ToastState {
  variant: AlertVariant;
  message: string;
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data
  ) {
    const message = (error.response as { data?: { message?: unknown } }).data
      ?.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

export default function InstructorSettings() {
  const queryClient = useQueryClient();
  const { token, setAuth } = useAuth();

  const [toast, setToast] = useState<ToastState | null>(null);

  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const profileQuery = useQuery({
    queryKey: ["users", "me"],
    queryFn: () => authService.getProfile(),
  });

  useEffect(() => {
    const me = profileQuery.data;
    if (!me) {
      return;
    }

    setFullName(me.profile?.fullName ?? "");
    setAvatar(me.profile?.avatar ?? "");
    setBio(me.profile?.bio ?? "");
  }, [profileQuery.data]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toast]);

  const updateProfileMutation = useMutation({
    mutationFn: () =>
      authService.updateProfile({
        fullName,
        avatar,
        bio,
      }),
    onSuccess: async (updatedUser) => {
      if (token) {
        setAuth(updatedUser, token);
      }

      setToast({
        variant: "success",
        message: "Profile updated successfully.",
      });

      await queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    },
    onError: (error) => {
      setToast({
        variant: "error",
        message: extractErrorMessage(error, "Failed to update profile."),
      });
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: () => authService.sendUpdateOtp(),
    onSuccess: (response) => {
      setIsOtpModalOpen(true);
      setToast({
        variant: "success",
        message: response.message || "OTP sent successfully.",
      });
    },
    onError: (error) => {
      setToast({
        variant: "error",
        message: extractErrorMessage(error, "Failed to send OTP."),
      });
    },
  });

  const updateSensitiveMutation = useMutation({
    mutationFn: () => {
      const trimmedPassword = newPassword.trim();

      return authService.updateSensitive({
        otp: otp.trim(),
        newPassword: trimmedPassword || undefined,
      });
    },
    onSuccess: async (updatedUser) => {
      if (token) {
        setAuth(updatedUser, token);
      }

      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
      setIsOtpModalOpen(false);

      setToast({
        variant: "success",
        message: "Sensitive information updated successfully.",
      });

      await queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    },
    onError: (error) => {
      setToast({
        variant: "error",
        message: extractErrorMessage(
          error,
          "Failed to update sensitive information.",
        ),
      });
    },
  });

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate();
  };

  const handleUpdateSensitive = () => {
    const trimmedPassword = newPassword.trim();

    if (!otp.trim()) {
      setToast({
        variant: "warning",
        message: "Please enter OTP.",
      });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setToast({
        variant: "warning",
        message: "New password and confirm password do not match.",
      });
      return;
    }

    if (!trimmedPassword) {
      setToast({
        variant: "warning",
        message: "Please enter new password.",
      });
      return;
    }

    updateSensitiveMutation.mutate();
  };

  return (
    <section className="space-y-10 px-4 py-6 sm:px-6 lg:px-10">
      {toast ? (
        <div className="fixed right-4 top-4 z-50 w-[min(92vw,460px)]">
          <Alert
            variant={toast.variant}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      ) : null}

      <h2 className="text-2xl font-semibold text-neutral-800">
        Instructor settings
      </h2>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className="w-full max-w-4xl space-y-5">
          {profileQuery.isLoading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
              Loading profile...
            </div>
          ) : null}

          {profileQuery.isError ? (
            <div className="rounded-xl border border-danger-200 bg-danger-50 p-4 text-sm text-danger-700">
              Unable to load profile information.
            </div>
          ) : null}

          <Input
            label="Username"
            placeholder="Enter your username"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />

          <Input
            label="Avatar URL"
            placeholder="https://..."
            value={avatar}
            onChange={(event) => setAvatar(event.target.value)}
          />

          <Input
            label="Bio"
            placeholder="Tell us something about you"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
          />

          <Button
            colorScheme="primary"
            size="md"
            isLoading={updateProfileMutation.isPending}
            onClick={handleUpdateProfile}
          >
            Save changes
          </Button>
        </div>
      </div>

      <hr className="my-10 border-gray-200" />

      <div className="w-full max-w-4xl space-y-5">
        <h3 className="text-2xl font-semibold text-neutral-800">
          Change password (OTP required)
        </h3>

        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
          <h4 className="text-base font-semibold text-neutral-800">Password</h4>
          <Input
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            placeholder="Password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            rightIcon={
              showNewPassword ? (
                <Eye className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeOff className="h-5 w-5 text-gray-400" />
              )
            }
            onRightIconClick={() => setShowNewPassword((current) => !current)}
            rightIconAriaLabel="Toggle new password visibility"
          />
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            rightIcon={
              showConfirmPassword ? (
                <Eye className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeOff className="h-5 w-5 text-gray-400" />
              )
            }
            onRightIconClick={() =>
              setShowConfirmPassword((current) => !current)
            }
            rightIconAriaLabel="Toggle confirm password visibility"
          />
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            colorScheme="gray"
            size="md"
            isLoading={sendOtpMutation.isPending}
            onClick={() => sendOtpMutation.mutate()}
          >
            Send OTP
          </Button>
        </div>
      </div>

      {isOtpModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-neutral-800">
                Confirm OTP
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                Enter OTP sent to your email to confirm password change.
              </p>
            </div>

            <Input
              label="OTP"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
            />

            <div className="mt-5 flex justify-end gap-3">
              <Button
                variant="outline"
                colorScheme="gray"
                onClick={() => {
                  setIsOtpModalOpen(false);
                  setOtp("");
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="primary"
                isLoading={updateSensitiveMutation.isPending}
                onClick={handleUpdateSensitive}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
