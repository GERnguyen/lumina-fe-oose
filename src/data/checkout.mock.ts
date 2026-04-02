export type PaymentMethodType = "card" | "paypal" | "new-card";

export interface PaymentMethodOption {
  id: string;
  title: string;
  details: string[];
  type: PaymentMethodType;
}

export interface OrderSummaryCourse {
  id: string;
  imageUrl: string;
  author: string;
  title: string;
  price: number;
}

export const paymentMethods: PaymentMethodOption[] = [
  {
    id: "visa-4632",
    title: "Credit Card",
    details: ["Master Card", "**** **** **** 4632", "Expire: 04/24"],
    type: "card",
  },
  {
    id: "paypal",
    title: "Paypal",
    details: ["kevin.gilbert@email.com", "Fast checkout"],
    type: "paypal",
  },
  {
    id: "new-card",
    title: "Add New Payment Card",
    details: ["Use another card for this order"],
    type: "new-card",
  },
];

export const orderSummaryCourses: OrderSummaryCourse[] = [
  {
    id: "order-1",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
    author: "Kevin Gilbert",
    title: "Complete Website Responsive Design",
    price: 13.99,
  },
  {
    id: "order-2",
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
    author: "Dianne Russell",
    title: "Webflow UI Masterclass",
    price: 11.99,
  },
  {
    id: "order-3",
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
    author: "Robert Fox",
    title: "Freelance Design Business Essentials",
    price: 19.99,
  },
];

export const checkoutPriceSummary = {
  subtotal: 45.97,
  couponDiscount: 8.0,
  total: 37.97,
};
