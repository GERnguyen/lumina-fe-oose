import OrderAccordion, {
  type OrderItem,
} from "../../components/ui/OrderAccordion";
import { useMemo } from "react";
import { useMyOrders } from "../../hooks/queries";

function formatOrderDate(value?: string): string {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StudentPurchaseHistory() {
  const { data: myOrders = [], isLoading, isError } = useMyOrders();
  const paidOrders = useMemo(
    () => myOrders.filter((order) => order.status === "PAID"),
    [myOrders],
  );

  const orderHistory = useMemo<OrderItem[]>(
    () =>
      paidOrders.map((order) => ({
        id: `order-${order.id}`,
        date: formatOrderDate(order.paid_at),
        totalCourses: order.order_details.length,
        totalAmount: order.final_price,
        paymentMethod: order.payment_method || "N/A",
        courses: order.order_details.map((detail) => ({
          id: `${detail.id}`,
          title: detail.course.title,
          author: detail.course.instructor?.profile?.fullName ?? "Unknown",
          price: detail.final_price,
          imageUrl: detail.course.thumbnail_url,
        })),
      })),
    [paidOrders],
  );

  return (
    <section className="w-full space-y-6">
      <h2 className="text-3xl font-semibold text-neutral-800">
        Purchase History
      </h2>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-danger-200 bg-danger-50 p-5 text-danger-700">
          Unable to load your purchase history.
        </div>
      ) : orderHistory.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-sm text-gray-600">
          No purchase history yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orderHistory.map((order, index) => (
            <OrderAccordion
              key={order.id}
              order={order}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      )}
    </section>
  );
}
