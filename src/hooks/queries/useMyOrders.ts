import { useQuery } from "@tanstack/react-query";
import orderService from "../../services/order.service";

export function useMyOrders() {
  return useQuery({
    queryKey: ["orders", "my-orders"],
    queryFn: () => orderService.getMyOrders(),
  });
}
