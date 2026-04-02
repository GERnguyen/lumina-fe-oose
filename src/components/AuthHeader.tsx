import { Link } from "react-router-dom";
import luminaLogo from "../assets/lumina.svg";
import Button from "./ui/Button";

interface AuthHeaderProps {
  promptText?: string;
  actionLabel?: string;
  actionTo?: string;
}

export default function AuthHeader({
  promptText = "Already have an account?",
  actionLabel = "Sign In",
  actionTo = "/login",
}: AuthHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
            <img src={luminaLogo} alt="Lumina logo" className="h-5 w-5" />
          </div>
          <span className="text-2xl font-semibold text-neutral-800">
            Lumina
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <p className="hidden text-sm text-gray-600 sm:block">{promptText}</p>
          <Link to={actionTo}>
            <Button variant="outline" colorScheme="primary" size="sm">
              {actionLabel}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
