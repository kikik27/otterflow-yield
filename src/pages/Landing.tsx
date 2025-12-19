import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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
  Sparkles,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const floatAnimation = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const steps = [
  { icon: FileCheck, title: "Issuer proposes pool", description: "Submit cashflow claim with metadata" },
  { icon: CheckCircle2, title: "Verifier activates", description: "Manual review and activation" },
  { icon: Wallet, title: "Investors deposit", description: "Choose Otter Safe or Boost" },
  { icon: TrendingUp, title: "Revenue posted", description: "Verifier posts epoch revenue" },
  { icon: Lock, title: "Revenue locked", description: "Funds secured in escrow" },
  { icon: Send, title: "Distribution", description: "Yield split to tranches" },
  { icon: Coins, title: "Harvest yield", description: "Investors claim rewards" },
];

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background gradients */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 gradient-hero"
        />
        
        {/* Magical orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-junior/20 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute top-1/2 right-1/3 w-64 h-64 bg-success/15 rounded-full blur-[80px]"
          />
        </div>

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            style={{ y: textY, opacity }}
            className="max-w-5xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-junior/20 border border-primary/30 backdrop-blur-sm">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl"
                >
                  🦦
                </motion.span>
                <span className="text-sm font-medium text-primary">
                  RWA Yield Vaults on Lisk
                </span>
                <Sparkles className="h-4 w-4 text-junior" />
              </div>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={fadeInUp}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
            >
              <span className="text-foreground block">Real cashflow.</span>
              <motion.span
                className="text-gradient-brand block"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                On-chain yield.
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              OtterFlow tokenizes cashflow claims into yield vaults with two
              risk tranches. Choose your risk profile, earn transparent,
              revenue-backed returns.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="gap-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-base rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
              >
                <Link to="/vaults">
                  <Globe className="h-5 w-5" />
                  Explore Otter Vaults
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 border-border/50 hover:bg-secondary/50 backdrop-blur-sm px-8 py-6 text-base rounded-xl hover:border-primary/50 transition-all"
              >
                <Link to="/how-it-works">How OtterFlow Works</Link>
              </Button>
            </motion.div>

            {/* Stats preview */}
            <motion.div
              variants={fadeInUp}
              className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            >
              {[
                { value: "2", label: "Tranche Types" },
                { value: "100%", label: "On-chain" },
                { value: "Real", label: "Yield" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </section>

      {/* Value Props */}
      <section className="py-32 bg-gradient-to-b from-card/30 to-background relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why OtterFlow?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlike speculative DeFi, OtterFlow backs yield with real cashflow
              claims, verified and locked before distribution.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Cashflow-backed, not hype-driven",
                description: "Yield comes from verified revenue streams, not token emissions or ponzinomics.",
                color: "primary",
                gradient: "from-primary/20 to-primary/5",
              },
              {
                icon: Layers,
                title: "Choose your risk: Safe vs Boost",
                description: "Otter Safe gets priority payout. Otter Boost absorbs risk first but earns higher yield.",
                color: "junior",
                gradient: "from-junior/20 to-junior/5",
              },
              {
                icon: Lock,
                title: "Revenue locked before distribution",
                description: "Funds are verified and escrowed on-chain before any yield is distributed.",
                color: "success",
                gradient: "from-success/20 to-success/5",
              },
            ].map((prop, index) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
              >
                <Card className={`p-8 bg-gradient-to-br ${prop.gradient} border-border hover:border-${prop.color}/50 transition-all duration-500 h-full group hover:scale-[1.02]`}>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                      prop.color === "primary"
                        ? "bg-primary/20"
                        : prop.color === "junior"
                        ? "bg-junior/20"
                        : "bg-success/20"
                    }`}
                  >
                    <prop.icon
                      className={`h-7 w-7 ${
                        prop.color === "primary"
                          ? "text-primary"
                          : prop.color === "junior"
                          ? "text-junior"
                          : "text-success"
                      }`}
                    />
                  </motion.div>
                  <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                    {prop.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {prop.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tranches Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Two Tranches, Your Choice
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the risk profile that matches your investment strategy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Senior Tranche */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-senior/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative gradient-senior p-10 rounded-3xl border border-senior/30 hover:border-senior/60 transition-all duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 rounded-2xl bg-senior/20 flex items-center justify-center"
                  >
                    <Shield className="h-8 w-8 text-senior" />
                  </motion.div>
                  <div>
                    <h3 className="font-display font-bold text-3xl text-foreground">
                      Otter Safe
                    </h3>
                    <p className="text-senior font-semibold">Senior Tranche</p>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "Priority payout from revenue",
                    "Lower risk profile",
                    "Stable, predictable returns",
                    "Protected by junior absorption",
                  ].map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 text-muted-foreground"
                    >
                      <CheckCircle2 className="h-5 w-5 text-senior flex-shrink-0" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ideal for conservative investors seeking steady yield with
                  downside protection.
                </p>
              </div>
            </motion.div>

            {/* Junior Tranche */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-junior/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative gradient-junior p-10 rounded-3xl border border-junior/30 hover:border-junior/60 transition-all duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 rounded-2xl bg-junior/20 flex items-center justify-center"
                  >
                    <Zap className="h-8 w-8 text-junior" />
                  </motion.div>
                  <div>
                    <h3 className="font-display font-bold text-3xl text-foreground">
                      Otter Boost
                    </h3>
                    <p className="text-junior font-semibold">Junior Tranche</p>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "Higher yield potential",
                    "Absorbs losses first",
                    "Greater risk exposure",
                    "Rewards for risk-taking",
                  ].map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 text-muted-foreground"
                    >
                      <CheckCircle2 className="h-5 w-5 text-junior flex-shrink-0" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ideal for risk-tolerant investors seeking higher returns with
                  more volatility.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 bg-gradient-to-b from-background to-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Built on Transparency
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every action is verifiable on-chain. Trust, but verify.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Users,
                title: "Manual Verification (MVP)",
                description: "In this hackathon demo, verifiers manually review and activate pools. This demonstrates the governance layer that ensures only legitimate cashflow claims become vaults.",
              },
              {
                icon: Lock,
                title: "On-chain Escrow",
                description: "Revenue funds are locked in a smart contract escrow before any distribution occurs. View all transactions and contract states on the block explorer.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Card className="p-8 bg-card/50 border-border hover:border-primary/30 transition-all duration-300 backdrop-blur-sm h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Mini */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From pool proposal to yield harvest in 7 steps.
            </p>
          </motion.div>

          <div className="relative max-w-6xl mx-auto">
            {/* Connection line */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <div className="grid grid-cols-2 md:grid-cols-7 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  className="flex flex-col items-center text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-card to-secondary border border-border flex items-center justify-center mb-4 shadow-lg"
                  >
                    <step.icon className="h-8 w-8 text-primary" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  </motion.div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Button asChild variant="outline" size="lg" className="gap-2 rounded-xl">
              <Link to="/how-it-works">
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 gradient-hero" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]"
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-8"
            >
              🦦
            </motion.div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Ready to earn real yield?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Connect your wallet and explore revenue-backed vaults on OtterFlow.
            </p>
            <Button
              asChild
              size="lg"
              className="gap-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 py-7 text-lg rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
            >
              <Link to="/vaults">
                <Sparkles className="h-5 w-5" />
                Explore Vaults
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
