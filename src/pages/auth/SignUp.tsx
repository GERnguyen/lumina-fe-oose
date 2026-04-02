import { Apple, ArrowRight, EyeOff, Globe, Users } from "lucide-react";
import AuthHeader from "../../components/AuthHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function SignUp() {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      <AuthHeader
        promptText="Already have an account?"
        actionLabel="Sign In"
        actionTo="/login"
      />

      <main className="grid min-h-[calc(100vh-73px)] grid-cols-1 lg:grid-cols-2">
        <section className="relative hidden lg:block">
          <div className="absolute inset-0 bg-violet-100" />
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop"
            alt="Students collaborating"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/25 to-transparent" />
        </section>

        <section className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-2xl space-y-8">
            <h1 className="text-center text-3xl font-semibold leading-tight text-neutral-800 sm:text-4xl">
              Create your account
            </h1>

            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="First Name" placeholder="First name..." />
                <Input label="Last Name" placeholder="Last name" />
              </div>

              <Input label="Username" placeholder="Username..." />
              <Input label="Email" type="email" placeholder="Email address" />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Create password"
                  rightIcon={<EyeOff className="h-5 w-5 text-gray-400" />}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm password"
                  rightIcon={<EyeOff className="h-5 w-5 text-gray-400" />}
                />
              </div>

              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <label className="flex items-center gap-2 text-sm text-gray-500">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    defaultChecked
                  />
                  <span>
                    I Agree with all of your{" "}
                    <span className="text-secondary-500">
                      Terms &amp; Conditions
                    </span>
                  </span>
                </label>

                <Button colorScheme="primary" className="w-full sm:w-auto">
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>

            <div className="space-y-5">
              <div className="relative">
                <div className="h-px w-full bg-gray-200" />
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Sign up with
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
