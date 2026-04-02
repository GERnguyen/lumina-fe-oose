import { useMutation, useQueryClient } from "@tanstack/react-query";
import cartService from "../../services/cart.service";

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) => cartService.removeFromCart(courseId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
