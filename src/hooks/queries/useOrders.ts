import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import orderService from "../../services/order.service";

export const MY_ORDERS_QUERY_KEY = ["orders", "my-orders"] as const;

export function useOrders() {
  return useQuery({
    queryKey: MY_ORDERS_QUERY_KEY,
    queryFn: () => orderService.getMyOrders(),
  });
}

export function usePendingOrder() {
  const ordersQuery = useOrders();

  const pendingOrder = (ordersQuery.data ?? []).find(
    (order) => order.status === "PENDING",
  );

  return {
    ...ordersQuery,
    pendingOrder,
  };
}

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { useRewardPoints: boolean }) =>
      orderService.checkout(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MY_ORDERS_QUERY_KEY });
    },
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string | number;
      data: { useRewardPoints: boolean };
    }) => orderService.confirmPayment(orderId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MY_ORDERS_QUERY_KEY });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string | number) => orderService.cancelOrder(orderId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MY_ORDERS_QUERY_KEY });
    },
  });
}
