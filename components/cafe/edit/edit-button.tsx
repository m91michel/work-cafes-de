"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/libs/supabase/client";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { MLink } from "@/components/general/link";
import Paths from "@/libs/paths";

interface EditButtonProps {
  slug: string | null;
}

export function EditButton({ slug }: EditButtonProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (isLoading || !isAuthenticated || !slug) {
    return null;
  }

  return (
    <Button variant="secondary" size="sm" asChild title="Edit">
      <MLink href={Paths.cafeEdit(slug)}>
        <Edit className="w-4 h-4" />
      </MLink>
    </Button>
  );
}

