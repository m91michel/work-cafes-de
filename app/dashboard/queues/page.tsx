'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface QueueStats {
  name: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

export default function QueuesPage() {
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/queues');
        if (!response.ok) {
          throw new Error('Failed to fetch queue stats');
        }
        const data = await response.json();
        if (data.queues && data.queues.length > 0) {
          setStats(data.queues[0]);
        }
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Queue Dashboard</h1>
        <p>Loading queue statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Queue Dashboard</h1>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Queue Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Monitor and manage background job queues
      </p>

      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Queue Name</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.name}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waiting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.waiting}</div>
              <p className="text-xs text-muted-foreground">Jobs in queue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Currently processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Successfully finished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.failed}</div>
              <p className="text-xs text-muted-foreground">Jobs that failed</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Note</CardTitle>
            <CardDescription>
              For full Bull Board UI with job management, consider using a separate Express server
              or embedding Bull Board via iframe. This dashboard shows basic queue statistics.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

