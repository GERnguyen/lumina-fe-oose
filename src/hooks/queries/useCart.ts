import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import cartService from "../../services/cart.service";

export function useCart(enabled = true) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
    enabled: enabled && isAuthenticated,
  });
}
