import RouteGuard from "@/components/RouteGuard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard requireAuth={false} redirectTo="/">
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        {children}
      </main>
    </RouteGuard>
  );
}
