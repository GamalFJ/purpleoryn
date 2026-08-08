"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { getSupabaseClient } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { Loader2, LogOut, Download, Users, Calendar, TrendingUp, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface WaitlistSignup {
  id: string;
  email: string;
  product: string;
  created_at: string;
}

function AdminDashboard() {
  const { user, isLoading, isAdmin, signOut } = useAuth();
  const router = useRouter();
  const [signups, setSignups] = useState<WaitlistSignup[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!isLoading && user && !isAdmin) {
      toast({ title: "Access Denied", description: "You do not have admin privileges.", variant: "destructive" });
      router.push("/");
    }
  }, [isAdmin, isLoading, user, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchSignups();
    }
  }, [user, isAdmin]);

  const fetchSignups = async () => {
    setLoadingData(true);
    const { data, error } = await getSupabaseClient().from("waitlist_signups").select("*").order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch waitlist signups.", variant: "destructive" });
    } else {
      setSignups(data || []);
    }
    setLoadingData(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const exportToCSV = () => {
    if (signups.length === 0) {
      toast({ title: "No Data", description: "There are no signups to export.", variant: "destructive" });
      return;
    }

    const headers = ["Email", "Product", "Signed Up"];
    const csvContent = [
      headers.join(","),
      ...signups.map((s) => [s.email, s.product, new Date(s.created_at).toLocaleDateString()].join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-signups-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: "Export Complete", description: `Exported ${signups.length} signups to CSV.` });
  };

  const totalSignups = signups.length;
  const today = new Date().toDateString();
  const signupsToday = signups.filter((s) => new Date(s.created_at).toDateString() === today).length;
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const signupsThisWeek = signups.filter((s) => new Date(s.created_at) >= weekAgo).length;

  if (isLoading || (!isAdmin && user)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm">Manage waitlist signups</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Signups</p>
                <p className="text-2xl font-bold text-foreground">{totalSignups}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/20">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold text-foreground">{signupsToday}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold text-foreground">{signupsThisWeek}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Waitlist Signups</h2>
            <Button onClick={exportToCSV} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>

          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : signups.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No waitlist signups yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Signed Up</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {signups.map((signup) => (
                    <TableRow key={signup.id}>
                      <TableCell className="font-medium">{signup.email}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">{signup.product}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(signup.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <AuthProvider>
      <Toaster />
      <AdminDashboard />
    </AuthProvider>
  );
}
