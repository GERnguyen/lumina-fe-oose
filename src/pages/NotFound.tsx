import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Button from "../components/ui/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      <Header />

      <main className="min-h-[calc(100vh-220px)] grid grid-cols-1 lg:grid-cols-2">
        <section className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-20 xl:px-24">
          <div className="space-y-6">
            <p className="text-6xl font-semibold leading-none text-gray-200 sm:text-7xl">
              Error 404
            </p>

            <h1 className="max-w-xl text-4xl font-semibold leading-tight text-neutral-800 sm:text-5xl">
              Oops! page not found
            </h1>

            <p className="max-w-xl text-lg leading-8 text-gray-600">
              Something went wrong. It looks like your requested page could not
              be found. The link might be broken or the page has been removed.
            </p>

            <Button
              colorScheme="primary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </Button>
          </div>
        </section>

        <section className="hidden items-center justify-center bg-violet-50 p-12 lg:flex">
          <img
            src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1400&auto=format&fit=crop"
            alt="Page not found illustration"
            className="h-full max-h-[720px] w-full max-w-2xl rounded-2xl object-cover"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
