"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";

interface OutscraperQuotaData {
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
}

interface OutscraperQuotaResponse {
  message: string;
  data: OutscraperQuotaData;
}

export function OutscraperQuota() {
  const [data, setData] = useState<OutscraperQuotaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuota = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch("/api/admin/outscraper-quota");
      if (!response.ok) {
        throw new Error("Failed to fetch quota data");
      }
      const result: OutscraperQuotaResponse = await response.json();
      if (result.message === "success" && result.data) {
        setData(result.data);
      }
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQuota(false);
    const interval = setInterval(() => fetchQuota(false), 60000); // Refresh every minute

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Outscraper Quota</h3>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Outscraper Quota</h3>
        <p className="text-sm text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Outscraper Quota</h3>
        <p className="text-muted-foreground">No quota data available</p>
      </div>
    );
  }

  const hasBalance = data.balance !== undefined && data.balance !== null;
  const hasQuota = data.quota && Object.keys(data.quota).length > 0;
  const hasRecentUsage =
    data.recentUsage &&
    (data.recentUsage.today > 0 ||
      data.recentUsage.thisMonth > 0 ||
      Object.keys(data.recentUsage.byProduct).length > 0);

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Outscraper Quota</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fetchQuota(true)}
          disabled={refreshing || loading}
          className="h-8 w-8"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="space-y-4">
        {hasBalance && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Balance</p>
            <p className="text-2xl font-bold">
              ${data.balance?.toFixed(2) || "0.00"}
            </p>
          </div>
        )}

        {hasQuota && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-2">Quota by Product</p>
            {Object.entries(data.quota || {}).map(([productName, quota]) => (
              <div key={productName} className="text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{productName}</span>
                  {quota.remaining !== undefined && quota.limit !== undefined && (
                    <span className="text-muted-foreground">
                      {quota.remaining} / {quota.limit}
                    </span>
                  )}
                </div>
                {quota.limit !== undefined && quota.used !== undefined && (
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${(quota.used / quota.limit) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {hasRecentUsage && data.recentUsage && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-sm text-muted-foreground mb-2">Recent Usage</p>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Today:</span>
                <span className="font-medium">{data.recentUsage.today}</span>
              </div>
              <div className="flex justify-between">
                <span>This Month:</span>
                <span className="font-medium">
                  {data.recentUsage.thisMonth}
                </span>
              </div>
            </div>
          </div>
        )}

        {!hasBalance && !hasQuota && !hasRecentUsage && (
          <p className="text-sm text-muted-foreground">
            Quota information not available. Check Outscraper dashboard for
            details.
          </p>
        )}
      </div>
    </div>
  );
}

