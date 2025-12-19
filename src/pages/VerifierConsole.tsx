import { Link, useLocation } from "react-router-dom";
import { Shield, FileCheck, TrendingUp, Send, ArrowLeft } from "lucide-react";
import { EmptyState } from "@/components/web3";
import { useUserRole } from "@/hooks/useUserRole";
import { cn } from "@/lib/utils";
import { ProposalsTab, RevenueTab, DistributeTab } from "@/components/verifier";

const verifierTabs = [
  { href: "/verifier", label: "Proposals", icon: FileCheck },
  { href: "/verifier/revenue", label: "Revenue", icon: TrendingUp },
  { href: "/verifier/distribute", label: "Distribute", icon: Send },
];

export default function VerifierConsole() {
  const { isConnected } = useUserRole();
  const location = useLocation();

  if (!isConnected) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <EmptyState
            icon="inbox"
            title="Connect Wallet"
            description="Connect your wallet to access the OtterGuard Console."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-8 bg-warning/5 border-b border-warning/20">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-warning" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                OtterGuard Console
              </h1>
              <p className="text-sm text-muted-foreground">
                Verifier management dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {verifierTabs.map((tab) => (
              <Link
                key={tab.href}
                to={tab.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  location.pathname === tab.href
                    ? "border-warning text-warning"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {location.pathname === "/verifier" && <ProposalsTab />}
          {location.pathname === "/verifier/revenue" && <RevenueTab />}
          {location.pathname === "/verifier/distribute" && <DistributeTab />}
        </div>
      </section>
    </div>
  );
}
