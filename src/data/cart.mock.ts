export interface CartCourseItem {
  id: string;
  imageUrl: string;
  category: string;
  rating: number;
  reviewCount: number;
  title: string;
  instructors: string[];
  salePrice: number;
  originalPrice?: number;
}

export const cartItems: CartCourseItem[] = [
  {
    id: "cart-1",
    imageUrl:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
    category: "Development",
    rating: 4.7,
    reviewCount: 451444,
    title: "The Python Mega Course: Build 10 Real World Applications",
    instructors: ["Leslie Alexander", "Guy Hawkins"],
    salePrice: 37.99,
    originalPrice: 49,
  },
  {
    id: "cart-2",
    imageUrl:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=1200&auto=format&fit=crop",
    category: "Data Science",
    rating: 4.3,
    reviewCount: 451444,
    title: "Machine Learning A-Z: Hands-On Python & R in Data Science",
    instructors: ["Bessie Cooper"],
    salePrice: 9.99,
  },
  {
    id: "cart-3",
    imageUrl:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
    category: "Security",
    rating: 4.7,
    reviewCount: 451444,
    title: "Learn Ethical Hacking From Scratch",
    instructors: ["Marvin McKinney"],
    salePrice: 13.99,
  },
];

export const cartSummary = {
  subtotal: 61.97,
  couponDiscountPercent: 8,
  tax: 17.99,
  total: 75,
};
