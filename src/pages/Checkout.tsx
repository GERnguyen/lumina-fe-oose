import { ChevronRight, CreditCard, Lock } from "lucide-react";
import { useMemo, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import OrderSummaryItem from "../components/OrderSummaryItem";
import PaymentMethodCard from "../components/PaymentMethodCard";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";
import Input from "../components/ui/Input";
import {
  checkoutPriceSummary,
  orderSummaryCourses,
  paymentMethods,
} from "../data/checkout.mock";

export default function Checkout() {
  const [selectedPaymentId, setSelectedPaymentId] = useState(
    paymentMethods[0].id,
  );
  const [rememberCard, setRememberCard] = useState(true);

  const selectedPayment = useMemo(
    () => paymentMethods.find((method) => method.id === selectedPaymentId),
    [selectedPaymentId],
  );

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      <Header />

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-neutral-800">Checkout</h1>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            {["Home", "Shopping Cart", "Checkout"].map((item, index, array) => (
              <div key={item} className="flex items-center gap-2">
                <span>{item}</span>
                {index < array.length - 1 ? (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-8">
            <h2 className="text-2xl font-semibold text-neutral-800">
              Payment Method
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {paymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  title={method.title}
                  details={method.details}
                  type={method.type}
                  isActive={selectedPaymentId === method.id}
                  onClick={() => setSelectedPaymentId(method.id)}
                />
              ))}
            </div>

            <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-2 text-neutral-800">
                <CreditCard className="h-5 w-5 text-primary-500" />
                <h3 className="text-lg font-semibold">Card Information</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    label="Name on card"
                    placeholder="Kevin Gilbert"
                    defaultValue={
                      selectedPayment?.type === "new-card"
                        ? ""
                        : "Kevin Gilbert"
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    defaultValue={
                      selectedPayment?.type === "card"
                        ? "**** **** **** 4632"
                        : ""
                    }
                  />
                </div>

                <Input label="MM/YY" placeholder="04/24" defaultValue="04/24" />
                <Input label="CVC" placeholder="123" type="password" />
              </div>

              <div className="mt-5 max-w-xs">
                <Checkbox
                  label="Remember this card"
                  checked={rememberCard}
                  onChange={setRememberCard}
                />
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                <Lock className="h-4 w-4" />
                <span>Your payment information is encrypted and secure.</span>
              </div>
            </section>
          </section>

          <aside className="lg:col-span-4">
            <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-2xl font-semibold text-neutral-800">
                Order Summary
              </h2>

              <div className="mt-5 space-y-4">
                {orderSummaryCourses.map((item) => (
                  <OrderSummaryItem key={item.id} item={item} />
                ))}
              </div>

              <div className="my-5 h-px bg-gray-200" />

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${checkoutPriceSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Coupon Discount</span>
                  <span>
                    -${checkoutPriceSummary.couponDiscount.toFixed(2)}
                  </span>
                </div>
                <div className="my-3 h-px bg-gray-200" />
                <div className="flex items-center justify-between text-lg font-semibold text-neutral-800">
                  <span>Total</span>
                  <span>${checkoutPriceSummary.total.toFixed(2)}</span>
                </div>
              </div>

              <Button colorScheme="primary" className="mt-6 w-full" size="lg">
                Complete Payment
              </Button>
            </section>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
