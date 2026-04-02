import { useMutation } from "@tanstack/react-query";
import orderService from "../../services/order.service";

export function useCheckout() {
  return useMutation({
    mutationFn: (data: { useRewardPoints: boolean }) =>
      orderService.checkout(data),
  });
}
