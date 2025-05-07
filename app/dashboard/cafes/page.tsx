import { QueueStatusCard } from "@/components/dashboard/queue-status";
import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { CafeTable } from "@/components/cafe/cafe-table";
import supabase from "@/libs/supabase/supabaseClient";

export default async function DashboardCafesPage() {
  const { data: cafes } = await supabase
    .from("cafes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Cafes"
        text="Manage your cafes and their status."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <QueueStatusCard />
      </div>
      <div>
        <CafeTable data={cafes || []} />
      </div>
    </DashboardShell>
  );
}
