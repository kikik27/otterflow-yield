import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Zap,
  Lock,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  Wallet,
  Layers,
  Send,
  Coins,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const steps = [
  {
    icon: FileCheck,
    title: "Issuer proposes pool",
    description: "Submit cashflow claim with metadata",
  },
  {
    icon: CheckCircle2,
    title: "Verifier activates",
    description: "Manual review and activation",
  },
  {
    icon: Wallet,
    title: "Investors deposit",
    description: "Choose Otter Safe or Boost",
  },
  {
    icon: TrendingUp,
    title: "Revenue posted",
    description: "Verifier posts epoch revenue",
  },
  {
    icon: Lock,
    title: "Revenue locked",
    description: "Funds secured in escrow",
  },
  {
    icon: Send,
    title: "Distribution",
    description: "Yield split to tranches",
  },
  {
    icon: Coins,
    title: "Harvest yield",
    description: "Investors claim rewards",
  },
];

export default function Landing() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />

        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-junior/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <span className="text-2xl">🦦</span>
              <span className="text-sm font-medium text-primary">
                RWA Yield Vaults on Lisk
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="text-foreground">Real cashflow.</span>
              <br />
              <span className="text-gradient-brand">On-chain yield.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              OtterFlow tokenizes cashflow claims into yield vaults with two
              risk tranches. Choose your risk profile, earn transparent,
              revenue-backed returns.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
              >
                <Link to="/vaults">
                  Explore Otter Vaults
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 border-border hover:bg-secondary"
              >
                <Link to="/how-it-works">How OtterFlow Works</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why OtterFlow?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Unlike speculative DeFi, OtterFlow backs yield with real cashflow
              claims, verified and locked before distribution.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Cashflow-backed, not hype-driven",
                description:
                  "Yield comes from verified revenue streams, not token emissions or ponzinomics.",
                color: "primary",
              },
              {
                icon: Layers,
                title: "Choose your risk: Safe vs Boost",
                description:
                  "Otter Safe gets priority payout. Otter Boost absorbs risk first but earns higher yield.",
                color: "junior",
              },
              {
                icon: Lock,
                title: "Revenue locked before distribution",
                description:
                  "Funds are verified and escrowed on-chain before any yield is distributed.",
                color: "success",
              },
            ].map((prop, index) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 h-full">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      prop.color === "primary"
                        ? "bg-primary/20"
                        : prop.color === "junior"
                        ? "bg-junior/20"
                        : "bg-success/20"
                    }`}
                  >
                    <prop.icon
                      className={`h-6 w-6 ${
                        prop.color === "primary"
                          ? "text-primary"
                          : prop.color === "junior"
                          ? "text-junior"
                          : "text-success"
                      }`}
                    />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    {prop.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {prop.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tranches Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Two Tranches, Your Choice
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the risk profile that matches your investment strategy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="gradient-senior p-8 rounded-2xl border border-senior/30 hover:border-senior/50 transition-all duration-300 hover:glow-senior"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-senior/20 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-senior" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl text-foreground">
                    Otter Safe
                  </h3>
                  <p className="text-senior font-medium">Senior Tranche</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Priority payout from revenue",
                  "Lower risk profile",
                  "Stable, predictable returns",
                  "Protected by junior absorption",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-senior flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">
                Ideal for conservative investors seeking steady yield with
                downside protection.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="gradient-junior p-8 rounded-2xl border border-junior/30 hover:border-junior/50 transition-all duration-300 hover:glow-junior"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-junior/20 flex items-center justify-center">
                  <Zap className="h-7 w-7 text-junior" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl text-foreground">
                    Otter Boost
                  </h3>
                  <p className="text-junior font-medium">Junior Tranche</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Higher yield potential",
                  "Absorbs losses first",
                  "Greater risk exposure",
                  "Rewards for risk-taking",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-junior flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">
                Ideal for risk-tolerant investors seeking higher returns with
                more volatility.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built on Transparency
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every action is verifiable on-chain. Trust, but verify.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  Manual Verification (MVP)
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                In this hackathon demo, verifiers manually review and activate
                pools. This demonstrates the governance layer that ensures only
                legitimate cashflow claims become vaults.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="h-5 w-5 text-success" />
                <h3 className="font-semibold text-foreground">
                  On-chain Escrow
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Revenue funds are locked in a smart contract escrow before any
                distribution occurs. View all transactions and contract states
                on the block explorer.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Mini */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From pool proposal to yield harvest in 7 steps.
            </p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connection line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative z-10 w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mb-3">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-xs font-medium text-foreground mb-1">
                    {step.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/how-it-works">
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to earn real yield?
            </h2>
            <p className="text-muted-foreground mb-8">
              Connect your wallet and explore revenue-backed vaults on OtterFlow.
            </p>
            <Button
              asChild
              size="lg"
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
            >
              <Link to="/vaults">
                Explore Vaults
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
