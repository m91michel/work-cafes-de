import { NextResponse } from "next/server";
import { fetchOutscraperBalance } from "@/libs/apis/outscraper";
import { createClient } from "@/libs/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Try to fetch balance from Outscraper API
    const balanceData = await fetchOutscraperBalance();

    // Also try to get recent quota usage from webhook logs if we're tracking them
    // For now, we'll return the balance data if available
    // In the future, we could track webhook quota_usage in a database table

    const response: {
      balance?: number;
      quota?: {
        [productName: string]: {
          limit?: number;
          used?: number;
          remaining?: number;
        };
      };
      recentUsage?: {
        today: number;
        thisMonth: number;
        byProduct: { [productName: string]: number };
      };
    } = {};

    if (balanceData) {
      response.balance = balanceData.balance;
      response.quota = balanceData.quota;
    }

    // Calculate recent usage from webhook data if we have a table for it
    // For now, we'll return empty recent usage
    response.recentUsage = {
      today: 0,
      thisMonth: 0,
      byProduct: {},
    };

    return NextResponse.json({
      message: "success",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching outscraper quota:", error);
    return NextResponse.json(
      { error: "Failed to fetch quota information" },
      { status: 500 }
    );
  }
}

