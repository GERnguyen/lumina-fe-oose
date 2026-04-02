import { Apple, ArrowRight, EyeOff, Globe, Users } from "lucide-react";
import AuthHeader from "../../components/AuthHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function SignIn() {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      <AuthHeader
        promptText="Don't have an account?"
        actionLabel="Create Account"
        actionTo="/register"
      />

      <main className="grid min-h-[calc(100vh-73px)] grid-cols-1 lg:grid-cols-2">
        <section className="relative hidden lg:block">
          <div className="absolute inset-0 bg-violet-100" />
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop"
            alt="Team working together"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/25 to-transparent" />
        </section>

        <section className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-2xl space-y-8">
            <h1 className="text-center text-3xl font-semibold leading-tight text-neutral-800 sm:text-4xl">
              Sign in to your account
            </h1>

            <form className="space-y-6">
              <Input
                label="Email"
                type="email"
                placeholder="Username or email address..."
              />

              <Input
                label="Password"
                type="password"
                placeholder="Password"
                rightIcon={<EyeOff className="h-5 w-5 text-gray-400" />}
              />

              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  Remember me
                </label>

                <Button colorScheme="primary" className="w-full sm:w-auto">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>

            <div className="space-y-5">
              <div className="relative">
                <div className="h-px w-full bg-gray-200" />
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Sign in with
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Button variant="outline" colorScheme="gray" className="w-full">
                  <Globe className="h-4 w-4" />
                  Google
                </Button>
                <Button variant="outline" colorScheme="gray" className="w-full">
                  <Users className="h-4 w-4" />
                  Facebook
                </Button>
                <Button variant="outline" colorScheme="gray" className="w-full">
                  <Apple className="h-4 w-4" />
                  Apple
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
