import Link from "next/link";
import { Rocket } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="star-field flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2 font-display text-xl font-bold">
        <Rocket className="h-6 w-6 text-fuel" />
        Rocket Club <span className="text-foreground/50 font-normal">at Home</span>
      </Link>
      {children}
    </div>
  );
}
