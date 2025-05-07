"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlayCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QueueStats {
  queue: {
    name: string;
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    total: number;
  };
  worker: {
    status: string;
    active: number;
  };
}

export function QueueStatusCard() {
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [startingWorker, setStartingWorker] = useState(false);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/queue/status");
      if (!response.ok) {
        throw new Error("Failed to fetch queue status");
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching queue status:", error);
      toast({
        title: "Error",
        description: "Failed to fetch queue status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startWorker = async () => {
    try {
      setStartingWorker(true);
      const response = await fetch("/api/queue/worker");
      if (!response.ok) {
        throw new Error("Failed to start worker");
      }
      const data = await response.json();
      toast({
        title: "Success",
        description: `Worker ${data.status}`,
      });
      fetchStats();
    } catch (error) {
      console.error("Error starting worker:", error);
      toast({
        title: "Error",
        description: "Failed to start worker",
        variant: "destructive",
      });
    } finally {
      setStartingWorker(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Queue Status</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchStats}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </Button>
        </CardTitle>
        <CardDescription>
          Cafe processing queue statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stats ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Worker Status:</span>
                <Badge
                  variant={stats.worker.status === "running" ? "default" : "destructive"}
                >
                  {stats.worker.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted rounded-md p-2">
                  <div className="text-xs text-muted-foreground">Waiting</div>
                  <div className="text-2xl font-bold">{stats.queue.waiting}</div>
                </div>
                <div className="bg-muted rounded-md p-2">
                  <div className="text-xs text-muted-foreground">Active</div>
                  <div className="text-2xl font-bold">{stats.queue.active}</div>
                </div>
                <div className="bg-muted rounded-md p-2">
                  <div className="text-xs text-muted-foreground">Completed</div>
                  <div className="text-2xl font-bold">{stats.queue.completed}</div>
                </div>
                <div className="bg-muted rounded-md p-2">
                  <div className="text-xs text-muted-foreground">Failed</div>
                  <div className="text-2xl font-bold">{stats.queue.failed}</div>
                </div>
              </div>
              
              {stats.worker.status !== "running" && (
                <Button
                  onClick={startWorker}
                  disabled={startingWorker}
                  className="w-full mt-2"
                >
                  {startingWorker ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PlayCircle className="mr-2 h-4 w-4" />
                  )}
                  Start Worker
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

