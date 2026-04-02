import { useMutation, useQueryClient } from "@tanstack/react-query";
import cartService from "../../services/cart.service";

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) => cartService.addToCart(courseId),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
