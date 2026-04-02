import { ArrowRight, ChevronRight } from "lucide-react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Button from "../components/ui/Button";
import CartItemCard from "../components/ui/CartItemCard";
import Input from "../components/ui/Input";
import { cartItems, cartSummary } from "../data/cart.mock";

export default function Cart() {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      <Header />

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-neutral-800">
            Shopping Cart
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <span>Home</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-neutral-800">Shopping Cart</span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="space-y-4 lg:col-span-8">
            <h2 className="text-2xl leading-8 text-neutral-800">
              <span className="font-semibold">Shopping Cart </span>
              <span className="font-normal">({cartItems.length})</span>
            </h2>

            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="hidden border-b border-gray-200 px-5 py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_160px_180px] lg:gap-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Course
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Prices
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 lg:text-right">
                  Action
                </p>
              </div>

              <div className="px-5">
                {cartItems.map((course, index) => (
                  <div key={course.id}>
                    <CartItemCard course={course} />
                    {index < cartItems.length - 1 ? (
                      <hr className="border-gray-200" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6 lg:col-span-4">
            <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-800">
                    ${cartSummary.subtotal.toFixed(2)} USD
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Coupon Discount</span>
                  <span className="font-medium text-neutral-800">
                    {cartSummary.couponDiscountPercent}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-medium text-neutral-800">
                    ${cartSummary.tax.toFixed(2)} USD
                  </span>
                </div>

                <hr className="my-3 border-gray-200" />

                <div className="flex items-center justify-between">
                  <span className="text-base text-neutral-800">Total:</span>
                  <span className="text-2xl font-semibold text-neutral-800">
                    ${cartSummary.total.toFixed(2)} USD
                  </span>
                </div>
              </div>

              <Button colorScheme="primary" size="lg" className="mt-6 w-full">
                Proceed to checkout
                <ArrowRight className="h-5 w-5" />
              </Button>

              <hr className="my-6 border-gray-200" />

              <div className="space-y-3">
                <p className="text-sm font-medium text-neutral-800">
                  Apply coupon code
                </p>
                <Input placeholder="Coupon code" />
                <Button colorScheme="gray" size="sm">
                  Apply
                </Button>
              </div>
            </section>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
