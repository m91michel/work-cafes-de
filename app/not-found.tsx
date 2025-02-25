import { Button } from "@/components/ui/button";
import Paths from "@/libs/paths";
import { Coffee, Home, Search, Wifi } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Animated background pattern */}
      <div className="absolute inset-0">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 blur-[100px] animate-pulse-slow" />
        <div className="opacity-80 transition-colors bg-primary hero-shadow" />
      </div>

      <div className="container relative flex min-h-[calc(100vh-4rem)] mx-auto flex-col items-center justify-center">
        <div className="mx-auto flex max-w-[800px] flex-col items-center justify-center text-center">
          {/* 404 Icon */}
          <div className="animate-float-slow mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 backdrop-blur-sm">
            <Coffee className="h-12 w-12 text-primary" />
          </div>

          {/* Error Message */}
          <h1 className="animate-fade-up mb-2 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Oops! Page Not Found
          </h1>
          <p className="animate-fade-up animation-delay-100 mb-8 max-w-[600px] text-lg text-muted-foreground">
            Looks like this page took a coffee break! Don&apos;t worry, you can
            head back home or search for work-friendly cafes in your city.
          </p>

          {/* Action Buttons */}
          <div className="animate-fade-up animation-delay-200 flex flex-col gap-4 sm:flex-row">
            <Button variant="default" asChild size="lg">
              <Link href={Paths.home}>
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href={Paths.cities}>
                <Search className="mr-2 h-5 w-5" />
                Find Cafes
              </Link>
            </Button>
          </div>

          {/* Decorative Coffee Icons */}
          <div className="absolute left-1/4 top-1/4 hidden animate-float md:block">
            <div className="relative h-8 w-8 rounded-xl bg-primary/10 p-2 backdrop-blur-sm">
              <Coffee className="h-full w-full text-primary" />
            </div>
          </div>
          <div className="absolute right-1/4 top-2/3 hidden animate-float-slow md:block">
            <div className="relative h-8 w-8 rounded-xl bg-primary/10 p-2 backdrop-blur-sm">
              <Wifi className="h-full w-full text-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
