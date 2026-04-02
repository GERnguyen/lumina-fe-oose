import { ChevronRight, Clock3, Lock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Alert, { type AlertVariant } from "../components/ui/Alert";
import Footer from "../components/Footer";
import Header from "../components/Header";
import OrderSummaryItem from "../components/OrderSummaryItem";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";
import {
  useCancelOrder,
  useCart,
  useCheckout,
  useConfirmPayment,
  usePendingOrder,
} from "../hooks/queries";
import { useAuth } from "../hooks/useAuth";
import { formatCurrencyVnd } from "../utils/price.ts";

interface CheckoutLocationState {
  useRewardPoints?: boolean;
}

interface ToastState {
  variant: AlertVariant;
  message: string;
}

const ORDER_PENDING_TTL_MS = 30 * 60 * 1000;

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

function formatCountdown(remainingMs: number): string {
  const safeMs = Math.max(remainingMs, 0);
  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const {
    pendingOrder,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = usePendingOrder();
  const shouldLoadCart = !isOrdersLoading && !pendingOrder;
  const {
    data: cart,
    isLoading: isCartLoading,
    isError: isCartError,
  } = useCart(shouldLoadCart);

  const checkoutMutation = useCheckout();
  const confirmPaymentMutation = useConfirmPayment();
  const cancelOrderMutation = useCancelOrder();

  const [toast, setToast] = useState<ToastState | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [remainingMs, setRemainingMs] = useState<number>(0);

  const initialUseRewardPoints = Boolean(
    (location.state as CheckoutLocationState | null)?.useRewardPoints,
  );
  const [useRewardPoints, setUseRewardPoints] = useState(
    initialUseRewardPoints,
  );

  const cartItems = cart?.items ?? [];

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + Number(item.unit_price) * item.quantity,
        0,
      ),
    [cartItems],
  );

  const rewardPoints = user?.rewardPoints ?? 0;
  const usableRewardPoints = useMemo(
    () => Math.min(rewardPoints, Math.floor(subtotal / 1000)),
    [rewardPoints, subtotal],
  );
  const rewardDiscount = useMemo(
    () => (useRewardPoints ? usableRewardPoints * 1000 : 0),
    [usableRewardPoints, useRewardPoints],
  );
  const totalAfterRewardPoints = Math.max(subtotal - rewardDiscount, 0);

  const pendingOrderSubtotal = useMemo(
    () =>
      pendingOrder
        ? Number(pendingOrder.total_amount) +
          Number(pendingOrder.discount_amount)
        : 0,
    [pendingOrder],
  );

  const pendingOrderTotal = useMemo(
    () => Number(pendingOrder?.total_amount ?? 0),
    [pendingOrder],
  );

  const pendingOrderDiscount = useMemo(
    () => Number(pendingOrder?.discount_amount ?? 0),
    [pendingOrder],
  );

  const isCreatingOrder = checkoutMutation.isPending;
  const isConfirmingOrder = confirmPaymentMutation.isPending;
  const isCancellingOrder = cancelOrderMutation.isPending;

  const isPendingOrderExpired = pendingOrder ? remainingMs <= 0 : false;

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toast]);

  useEffect(() => {
    if (!pendingOrder) {
      setRemainingMs(0);
      return;
    }

    const createdAtMs = Date.parse(pendingOrder.created_at);
    if (!Number.isFinite(createdAtMs)) {
      setRemainingMs(0);
      return;
    }

    const updateCountdown = () => {
      const expiresAt = createdAtMs + ORDER_PENDING_TTL_MS;
      setRemainingMs(expiresAt - Date.now());
    };

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [pendingOrder]);

  const handleCreateOrder = async () => {
    try {
      await checkoutMutation.mutateAsync({ useRewardPoints });

      // Refetch latest orders after successful checkout to switch UI to pending state.
      void refetchOrders();
    } catch (error) {
      const message = extractErrorMessage(error, "Khong the tao don hang.");
      const normalizedMessage = message.toLowerCase();
      const isPendingConflict =
        normalizedMessage.includes("don hang cho thanh toan") ||
        normalizedMessage.includes("pending");

      setToast({
        variant: "error",
        message: isPendingConflict
          ? "Ban dang co don hang cho thanh toan."
          : message,
      });

      await refetchOrders();
    }
  };

  const handleConfirmPayment = async () => {
    if (!pendingOrder || isPendingOrderExpired) {
      return;
    }

    try {
      await confirmPaymentMutation.mutateAsync({
        orderId: pendingOrder.id,
        data: { useRewardPoints },
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
        queryClient.invalidateQueries({ queryKey: ["my-courses"] }),
        queryClient.invalidateQueries({ queryKey: ["learning", "my-courses"] }),
      ]);

      setIsSuccessModalOpen(true);
    } catch (error) {
      setToast({
        variant: "error",
        message: extractErrorMessage(error, "Xac nhan thanh toan that bai."),
      });
    }
  };

  const handleCancelOrder = async () => {
    if (!pendingOrder) {
      return;
    }

    try {
      await cancelOrderMutation.mutateAsync(pendingOrder.id);
      await refetchOrders();
      setToast({
        variant: "success",
        message: "Da huy don hang cho thanh toan.",
      });
    } catch (error) {
      setToast({
        variant: "error",
        message: extractErrorMessage(error, "Khong the huy don hang."),
      });
    }
  };

  if (isOrdersLoading || (shouldLoadCart && isCartLoading)) {
    return (
      <div className="min-h-screen bg-white font-sans text-neutral-800">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="h-96 animate-pulse rounded-xl bg-gray-100 lg:col-span-8" />
            <div className="h-96 animate-pulse rounded-xl bg-gray-100 lg:col-span-4" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isOrdersError) {
    return (
      <div className="min-h-screen bg-white font-sans text-neutral-800">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-danger-200 bg-danger-50 p-6 text-danger-700">
            Unable to load order state. Please try again.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!pendingOrder && isCartError) {
    return (
      <div className="min-h-screen bg-white font-sans text-neutral-800">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-danger-200 bg-danger-50 p-6 text-danger-700">
            Unable to load cart for checkout. Please try again.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!pendingOrder && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white font-sans text-neutral-800">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <h1 className="text-2xl font-semibold text-neutral-800">
              Giỏ hàng của bạn đang trống
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Bạn cần thêm khóa học vào giỏ hàng trước khi thanh toán.
            </p>
            <Button
              className="mt-6"
              colorScheme="primary"
              onClick={() => navigate("/courses")}
            >
              Khám phá khóa học
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

      {isSuccessModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold text-neutral-800">
              Thanh toan thanh cong
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Khoa hoc da duoc them vao thu vien cua ban.
            </p>

            <Button
              className="mt-6 w-full"
              colorScheme="primary"
              onClick={() => {
                setIsSuccessModalOpen(false);
                navigate("/student/courses");
              }}
            >
              Bat dau hoc ngay
            </Button>
          </div>
        </div>
      ) : null}

      <Header />

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-neutral-800">Checkout</h1>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            {[
              { label: "Home", to: "/" },
              { label: "Shopping Cart", to: "/cart" },
              { label: "Checkout", to: "/checkout" },
            ].map((item, index, array) => (
              <div key={item.label} className="flex items-center gap-2">
                {index < array.length - 1 ? (
                  <Link to={item.to}>{item.label}</Link>
                ) : (
                  <span className="text-neutral-800">{item.label}</span>
                )}
                {index < array.length - 1 ? (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-8">
            {pendingOrder ? (
              <>
                <div className="rounded-xl border border-warning-200 bg-warning-100 p-5 text-warning-800">
                  <h2 className="text-xl font-semibold">
                    Ban dang co mot don hang cho thanh toan.
                  </h2>
                  <p className="mt-1 text-sm">
                    Ban khong the tao don moi cho den khi hoan tat hoac huy don
                    nay.
                  </p>
                </div>

                <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-neutral-800">
                      Don hang cho thanh toan #{pendingOrder.id}
                    </h3>
                    <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-neutral-700">
                      <Clock3 className="h-4 w-4" />
                      {isPendingOrderExpired
                        ? "Don hang da het han"
                        : `Con lai: ${formatCountdown(remainingMs)}`}
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {pendingOrder.order_details.map((detail) => (
                      <div
                        key={detail.id}
                        className="flex items-center gap-4 rounded-lg border border-gray-100 px-4 py-3"
                      >
                        <img
                          src={detail.course.thumbnail_url}
                          alt={detail.course.title}
                          className="h-14 w-20 rounded-md object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-neutral-800">
                            {detail.course.title}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Gia: {formatCurrencyVnd(detail.final_price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      colorScheme="gray"
                      isLoading={isCancellingOrder}
                      disabled={isCancellingOrder || isConfirmingOrder}
                      onClick={handleCancelOrder}
                    >
                      Huy don hang
                    </Button>
                    <Button
                      colorScheme="primary"
                      isLoading={isConfirmingOrder}
                      disabled={
                        isPendingOrderExpired ||
                        isConfirmingOrder ||
                        isCancellingOrder
                      }
                      onClick={handleConfirmPayment}
                    >
                      Xac nhan thanh toan
                    </Button>
                  </div>

                  {isPendingOrderExpired ? (
                    <p className="mt-4 rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
                      Don hang da het han. Hay huy don de tao don moi.
                    </p>
                  ) : null}
                </section>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-neutral-800">
                  Tao don moi tu gio hang
                </h2>

                <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <OrderSummaryItem key={item.id} item={item} />
                    ))}
                  </div>

                  <div className="mt-6 rounded-xl border border-gray-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-800">
                          Su dung reward points
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Ban co {rewardPoints.toLocaleString()} points. Muc
                          giam toi da la 1,000 VND / point va khong vuot tong
                          tam tinh.
                        </p>
                      </div>

                      <Checkbox
                        label="Use reward points"
                        count={rewardPoints}
                        checked={useRewardPoints}
                        onChange={setUseRewardPoints}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                    <Lock className="h-4 w-4" />
                    <span>Thong tin thanh toan duoc bao mat.</span>
                  </div>

                  <Button
                    colorScheme="primary"
                    className="mt-6"
                    size="lg"
                    isLoading={isCreatingOrder}
                    disabled={isCreatingOrder}
                    onClick={handleCreateOrder}
                  >
                    Tien hanh dat hang
                  </Button>
                </section>
              </>
            )}
          </section>

          <aside className="lg:col-span-4">
            <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-2xl font-semibold text-neutral-800">
                Order Summary
              </h2>

              <div className="my-5 h-px bg-gray-200" />

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>
                    {formatCurrencyVnd(
                      pendingOrder ? pendingOrderSubtotal : subtotal,
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Reward points</span>
                  <span>
                    {pendingOrder
                      ? pendingOrderDiscount > 0
                        ? `-${formatCurrencyVnd(pendingOrderDiscount)}`
                        : "-"
                      : useRewardPoints
                        ? `-${formatCurrencyVnd(rewardDiscount)}`
                        : "-"}
                  </span>
                </div>
                <div className="my-3 h-px bg-gray-200" />
                <div className="flex items-center justify-between text-lg font-semibold text-neutral-800">
                  <span>Total</span>
                  <span>
                    {formatCurrencyVnd(
                      pendingOrder ? pendingOrderTotal : totalAfterRewardPoints,
                    )}
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
