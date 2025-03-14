import { getSEOTags } from "@/libs/seo";
import LoginForm from "@/components/auth/login-form";
import { redirect } from 'next/navigation';
import { createClient } from "@/libs/supabase/server";

export const metadata = getSEOTags({
  title: `Login`,
  description: "Login to access the dashboard",
  canonicalUrlRelative: "/login",
  robots: "noindex, nofollow",
});

export default async function LoginPage() {
  // Check if user is already logged in
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // If already logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to access the dashboard
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
} 