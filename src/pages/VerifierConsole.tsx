import { useState } from "react";
import { motion } from "framer-motion";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Shield, FileCheck, TrendingUp, Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge, DisclosureBox, EmptyState } from "@/components/web3";
import { useUserRole } from "@/hooks/useUserRole";
import { cn } from "@/lib/utils";

const verifierTabs = [
  { href: "/verifier", label: "Proposals", icon: FileCheck },
  { href: "/verifier/revenue", label: "Revenue", icon: TrendingUp },
  { href: "/verifier/distribute", label: "Distribute", icon: Send },
];

export default function VerifierConsole() {
  const { isVerifier, isConnected } = useUserRole();
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

  // For demo purposes, show the console even without verifier role
  // In production, uncomment this check:
  // if (!isVerifier) {
  //   return (
  //     <div className="min-h-screen py-12">
  //       <div className="container mx-auto px-4">
  //         <EmptyState
  //           icon="file"
  //           title="Access Denied"
  //           description="You don't have the VERIFIER_ROLE required to access this console."
  //         />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-8 bg-warning/5 border-b border-warning/20">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
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

function ProposalsTab() {
  const mockProposals = [
    { id: 1, issuer: "0x1234...5678", metadataCID: "QmXyz...", status: "pending" },
  ];

  return (
    <div className="space-y-6">
      <DisclosureBox variant="info" title="Proposal Review">
        Review pending pool proposals. Activate to create vaults or reject invalid proposals.
      </DisclosureBox>

      {mockProposals.length === 0 ? (
        <EmptyState icon="inbox" title="No pending proposals" description="All proposals have been reviewed." />
      ) : (
        <div className="space-y-4">
          {mockProposals.map((proposal) => (
            <Card key={proposal.id} className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Pool #{proposal.id}</p>
                  <p className="text-sm text-muted-foreground font-mono">{proposal.issuer}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-success hover:bg-success/90">Activate</Button>
                  <Button size="sm" variant="destructive">Reject</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function RevenueTab() {
  const [poolId, setPoolId] = useState("");
  const [epoch, setEpoch] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="space-y-6 max-w-xl">
      <DisclosureBox variant="info" title="Revenue Management">
        Post verified revenue and deposit funds into escrow.
      </DisclosureBox>

      <Card className="p-6 bg-card border-border space-y-4">
        <h3 className="font-semibold text-foreground">Post Revenue</h3>
        <Input placeholder="Pool ID" value={poolId} onChange={(e) => setPoolId(e.target.value)} />
        <Input placeholder="Epoch" value={epoch} onChange={(e) => setEpoch(e.target.value)} />
        <Input placeholder="Amount (mUSDC)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <div className="flex gap-2">
          <Button className="flex-1">Post to Oracle</Button>
          <Button variant="outline" className="flex-1">Deposit to Escrow</Button>
        </div>
      </Card>
    </div>
  );
}

function DistributeTab() {
  const readyEpochs = [{ poolId: 1, epoch: 2, amount: "1,200" }];

  return (
    <div className="space-y-6">
      <DisclosureBox variant="info" title="Distribution">
        Trigger yield distribution for epochs with escrowed funds.
      </DisclosureBox>

      {readyEpochs.length === 0 ? (
        <EmptyState icon="inbox" title="No epochs ready" description="No epochs have sufficient escrowed funds." />
      ) : (
        <div className="space-y-4">
          {readyEpochs.map((item) => (
            <Card key={`${item.poolId}-${item.epoch}`} className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Pool #{item.poolId} - Epoch {item.epoch}</p>
                  <p className="text-sm text-muted-foreground">{item.amount} mUSDC escrowed</p>
                </div>
                <Button size="sm">Distribute</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
