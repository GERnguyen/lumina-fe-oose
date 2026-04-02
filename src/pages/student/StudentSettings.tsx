import { EyeOff, Upload } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function StudentSettings() {
  return (
    <section className="space-y-10">
      <h2 className="text-2xl font-semibold text-neutral-800">
        Account settings
      </h2>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src="https://placehold.co/560x560"
              alt="Profile avatar"
              className="aspect-square w-full object-cover"
            />

            <div className="absolute inset-x-0 bottom-0 bg-black/50 p-3">
              <Button
                variant="ghost"
                colorScheme="gray"
                className="h-auto w-full justify-center rounded-none px-0 py-0 text-white hover:bg-transparent"
              >
                <Upload className="h-4 w-4" />
                Upload Photo
              </Button>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-gray-500">
            Image size should be under 1MB and image ratio needs to be 1:1
          </p>
        </div>

        <div className="w-full max-w-4xl space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input label="First name" placeholder="First name" />
            <Input label="Last name" placeholder="Last name" />
          </div>

          <Input label="Username" placeholder="Enter your username" />
          <Input label="Email" placeholder="Email address" type="email" />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-neutral-800">
                Title
              </label>
              <span className="text-sm text-gray-600">0/50</span>
            </div>
            <Input
              placeholder="Your title, profession or small biography"
              maxLength={50}
            />
          </div>

          <Button colorScheme="primary" size="md">
            Save changes
          </Button>
        </div>
      </div>

      <hr className="my-10 border-gray-200" />

      <div className="w-full max-w-xl space-y-5">
        <h3 className="text-2xl font-semibold text-neutral-800">
          Change password
        </h3>

        <Input
          label="Current Password"
          type="password"
          placeholder="Password"
          rightIcon={<EyeOff className="h-5 w-5 text-gray-400" />}
        />
        <Input
          label="New Password"
          type="password"
          placeholder="Password"
          rightIcon={<EyeOff className="h-5 w-5 text-gray-400" />}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm new password"
          rightIcon={<EyeOff className="h-5 w-5 text-gray-400" />}
        />

        <Button colorScheme="primary" size="md">
          Change Password
        </Button>
      </div>
    </section>
  );
}
