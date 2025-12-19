import { Link, useLocation } from "react-router-dom";
import { Shield, FileCheck, TrendingUp, Send, ArrowLeft, Lock, AlertTriangle } from "lucide-react";
import { EmptyState } from "@/components/web3";
import { useUserRole } from "@/hooks/useUserRole";
import { cn } from "@/lib/utils";
import { ProposalsTab, RevenueTab, DistributeTab } from "@/components/verifier";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const verifierTabs = [
  { href: "/verifier", label: "Proposals", icon: FileCheck },
  { href: "/verifier/revenue", label: "Revenue", icon: TrendingUp },
  { href: "/verifier/distribute", label: "Distribute", icon: Send },
];

function AccessDenied() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <Card className="p-8 bg-card border-warning/30 text-center">
            <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-warning" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">OtterGuard Access Only</h2>
            <p className="text-muted-foreground mb-4">
              The OtterGuard Console is restricted to verified guardians who help secure the protocol.
            </p>
            <div className="p-3 rounded-lg bg-muted mb-4">
              <div className="flex items-center justify-center gap-2 text-sm">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Required role: <strong className="text-warning">Verifier</strong></span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Verifiers are trusted guardians who validate revenue data and activate pools. On-chain role assignment is managed by protocol admins.
            </p>
            <Button asChild variant="outline">
              <Link to="/">Return Home</Link>
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifierConsole() {
  const { isVerifier, isAdmin, isConnected } = useUserRole();
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

  // Role-based access check
  if (!isVerifier && !isAdmin) {
    return <AccessDenied />;
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
