import OrderAccordion, {
  type OrderItem,
} from "../../components/ui/OrderAccordion";

const orderHistory: OrderItem[] = [
  {
    id: "order-001",
    date: "Nov 22, 2021 at 11:45 PM",
    totalCourses: 3,
    totalAmount: 61.97,
    paymentMethod: "Credit Card",
    cardLast4: "4632",
    billingLabel: "Master Card",
    courses: [
      {
        id: "c-101",
        title: "Learn Ethical Hacking From Scratch",
        author: "Kevin Gilbert",
        price: 13.99,
        imageUrl:
          "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=600&auto=format&fit=crop",
      },
      {
        id: "c-102",
        title: "Machine Learning A-Z: Hands-On Python & R",
        author: "Dianne Russell",
        price: 11.99,
        imageUrl:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
      },
      {
        id: "c-103",
        title: "Data Structures & Algorithms Essentials",
        author: "Robert Fox",
        price: 35.99,
        imageUrl:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "order-002",
    date: "Nov 21, 2021 at 11:45 PM",
    totalCourses: 1,
    totalAmount: 13.99,
    paymentMethod: "Credit Card",
    cardLast4: "4632",
    billingLabel: "Master Card",
    courses: [
      {
        id: "c-104",
        title: "Angular - The Complete Guide",
        author: "Esther Howard",
        price: 13.99,
        imageUrl:
          "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=600&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "order-003",
    date: "Nov 20, 2021 at 10:45 PM",
    totalCourses: 2,
    totalAmount: 32.99,
    paymentMethod: "PayPal",
    billingLabel: "PayPal Account",
    courses: [
      {
        id: "c-105",
        title: "Complete Blender Creator",
        author: "Cody Fisher",
        price: 19.99,
        imageUrl:
          "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600&auto=format&fit=crop",
      },
      {
        id: "c-106",
        title: "Instagram Marketing 2021",
        author: "Jenny Wilson",
        price: 13,
        imageUrl:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "order-004",
    date: "Nov 15, 2021 at 08:20 PM",
    totalCourses: 4,
    totalAmount: 74.96,
    paymentMethod: "Credit Card",
    cardLast4: "1190",
    billingLabel: "Visa",
    courses: [
      {
        id: "c-107",
        title: "Complete Web Development Bootcamp",
        author: "Kristin Watson",
        price: 24.99,
        imageUrl:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
      },
      {
        id: "c-108",
        title: "SEO Complete Training",
        author: "Marvin McKinney",
        price: 16.99,
        imageUrl:
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop",
      },
      {
        id: "c-109",
        title: "Automate the Boring Stuff with Python",
        author: "Bessie Cooper",
        price: 14.99,
        imageUrl:
          "https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=600&auto=format&fit=crop",
      },
      {
        id: "c-110",
        title: "Digital Marketing Masterclass",
        author: "Jane Cooper",
        price: 17.99,
        imageUrl:
          "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=600&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "order-005",
    date: "Nov 12, 2021 at 09:05 PM",
    totalCourses: 1,
    totalAmount: 9.99,
    paymentMethod: "Bank Transfer",
    billingLabel: "Direct Bank Payment",
    courses: [
      {
        id: "c-111",
        title: "Premiere Pro CC for Beginners",
        author: "Cameron Williamson",
        price: 9.99,
        imageUrl:
          "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop",
      },
    ],
  },
];

export default function StudentPurchaseHistory() {
  return (
    <section className="w-full space-y-6">
      <h2 className="text-3xl font-semibold text-neutral-800">
        Purchase History
      </h2>

      <div className="space-y-4">
        {orderHistory.map((order, index) => (
          <OrderAccordion
            key={order.id}
            order={order}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
