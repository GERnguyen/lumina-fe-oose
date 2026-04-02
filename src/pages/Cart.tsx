import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Alert, { type AlertVariant } from "../components/ui/Alert";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Button from "../components/ui/Button";
import CartItemCard from "../components/ui/CartItemCard";
import {
  useCart,
  useCheckout,
  useConfirmPayment,
  useRemoveFromCart,
} from "../hooks/queries";
import { useAuth } from "../hooks/useAuth";
import { formatCurrencyVnd } from "../utils/price.ts";

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

export default function Cart() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: cart, isLoading, isError } = useCart();
  const removeMutation = useRemoveFromCart();
  const checkoutMutation = useCheckout();
  const confirmPaymentMutation = useConfirmPayment();
  const [useRewardPoints, setUseRewardPoints] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const cartItems = cart?.items ?? [];
  const rewardPoints = user?.rewardPoints ?? 0;

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + Number(item.unit_price) * item.quantity,
        0,
      ),
    [cartItems],
  );

  const usableRewardPoints = useMemo(
    () => Math.min(rewardPoints, Math.floor(subtotal / 1000)),
    [rewardPoints, subtotal],
  );

  const rewardDiscount = useMemo(
    () => (useRewardPoints ? usableRewardPoints * 1000 : 0),
    [usableRewardPoints, useRewardPoints],
  );

  const totalAfterRewardPoints = Math.max(subtotal - rewardDiscount, 0);

  const handleRemove = (courseId: number) => {
    removeMutation.mutate(courseId);
  };

  const handleBuyNow = async () => {
    if (cartItems.length === 0) {
      return;
    }

    setToast(null);

    try {
      const order = await checkoutMutation.mutateAsync({ useRewardPoints });

      await confirmPaymentMutation.mutateAsync({
        orderId: order.id,
        data: { useRewardPoints },
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
        queryClient.invalidateQueries({ queryKey: ["my-courses"] }),
        queryClient.invalidateQueries({ queryKey: ["learning", "my-courses"] }),
      ]);

      navigate("/student/courses");
    } catch (error) {
      setToast({
        variant: "error",
        message: extractErrorMessage(error, "Thanh toan that bai."),
      });
    }
  };

  const isRemovingCourse = (courseId: number) =>
    removeMutation.isPending && removeMutation.variables === courseId;
  const isBuying =
    checkoutMutation.isPending || confirmPaymentMutation.isPending;

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      {toast ? (
        <div className="fixed right-4 top-4 z-50 w-[min(92vw,520px)]">
          <Alert
            variant={toast.variant}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      ) : null}

      <Header />

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-neutral-800">
            Shopping Cart
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <Link to="/">Home</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-neutral-800">Shopping Cart</span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-danger-200 bg-danger-50 p-6 text-danger-700">
            Unable to load cart. Please try again.
          </div>
        ) : cartItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <h2 className="text-2xl font-semibold text-neutral-800">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Hãy khám phá thêm các khóa học để bắt đầu hành trình học tập.
            </p>
            <Button
              className="mt-6"
              colorScheme="primary"
              onClick={() => navigate("/courses")}
            >
              Khám phá khóa học
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <section className="space-y-4 lg:col-span-8">
              <h2 className="text-2xl leading-8 text-neutral-800">
                <span className="font-semibold">Shopping Cart </span>
                <span className="font-normal">({cartItems.length})</span>
              </h2>

              <div className="rounded-xl border border-gray-200 bg-white">
                <div className="hidden border-b border-gray-200 px-5 py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_160px_180px] lg:gap-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Course
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Prices
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 lg:text-right">
                    Action
                  </p>
                </div>

                <div className="px-5">
                  {cartItems.map((item, index) => (
                    <div key={item.id}>
                      <CartItemCard
                        item={item}
                        onRemove={handleRemove}
                        isRemoving={isRemovingCourse(item.courseId)}
                      />
                      {index < cartItems.length - 1 ? (
                        <hr className="border-gray-200" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="space-y-6 lg:col-span-4">
              <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-neutral-800">
                      {formatCurrencyVnd(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span>Reward Point Discount</span>
                    <span className="font-medium text-neutral-800">
                      -{formatCurrencyVnd(rewardDiscount)}
                    </span>
                  </div>

                  <hr className="my-3 border-gray-200" />

                  <div className="flex items-center justify-between">
                    <span className="text-base text-neutral-800">
                      Total after discount:
                    </span>
                    <span className="text-2xl font-semibold text-neutral-800">
                      {formatCurrencyVnd(totalAfterRewardPoints)}
                    </span>
                  </div>
                </div>

                <Button
                  colorScheme="primary"
                  size="lg"
                  className="mt-6 w-full"
                  onClick={handleBuyNow}
                  isLoading={isBuying}
                  disabled={isBuying || removeMutation.isPending}
                >
                  Mua ngay
                </Button>

                <hr className="my-6 border-gray-200" />

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-6">
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-neutral-800">
                        Use reward points
                      </p>
                      <p className="text-xs text-gray-500">
                        You have {rewardPoints.toLocaleString()} points. Max
                        discount applies at 1,000 VND per point and is capped by
                        the subtotal.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setUseRewardPoints((current) => !current)}
                      aria-pressed={useRewardPoints}
                      aria-label="Toggle reward points"
                      className={
                        useRewardPoints
                          ? "inline-flex h-10 min-w-24 items-center justify-center rounded-lg bg-primary-500 px-4 text-sm font-semibold text-white transition-colors"
                          : "inline-flex h-10 min-w-24 items-center justify-center rounded-lg bg-gray-300 px-4 text-sm font-semibold text-gray-700 transition-colors"
                      }
                    >
                      {useRewardPoints ? "ON" : "OFF"}
                    </button>
                  </div>

                  {useRewardPoints && subtotal < 1000 ? (
                    <p className="text-xs text-warning-700">
                      Số tiền hiện tại chưa đủ để quy đổi reward points.
                    </p>
                  ) : null}
                </div>
              </section>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
