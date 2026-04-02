export function formatCurrencyVnd(
  value: number | string | null | undefined,
): string {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "0 ₫";
  }

  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
}

export function getDiscountedPrice(
  price: number,
  discountPercent: number,
): number {
  if (discountPercent <= 0) {
    return price;
  }

  return price * (1 - discountPercent / 100);
}
