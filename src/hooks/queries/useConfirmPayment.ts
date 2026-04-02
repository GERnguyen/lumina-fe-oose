import { useMutation } from "@tanstack/react-query";
import orderService from "../../services/order.service";

export function useConfirmPayment() {
  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string | number;
      data: { useRewardPoints: boolean };
    }) => orderService.confirmPayment(orderId, data),
  });
}
