import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl" />

      <div className="glass-card p-8 sm:p-12 text-center max-w-md relative z-10">
        <h1 className="text-7xl sm:text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Button asChild className="gap-2">
          <Link href="/">
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
