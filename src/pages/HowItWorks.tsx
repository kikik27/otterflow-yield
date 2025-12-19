import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileCheck,
  CheckCircle2,
  Wallet,
  TrendingUp,
  Lock,
  Send,
  Coins,
  Shield,
  Zap,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const steps = [
  {
    icon: FileCheck,
    title: "1. Issuer Proposes Pool",
    description:
      "An issuer submits a pool proposal with metadata (IPFS CID), epoch duration, start time, and senior/junior split ratio. The pool starts in PENDING status.",
    color: "primary",
  },
  {
    icon: CheckCircle2,
    title: "2. Verifier Activates Pool",
    description:
      "A designated verifier reviews the proposal, verifies the underlying cashflow claim, and activates the pool. This creates two vault contracts: Senior (Otter Safe) and Junior (Otter Boost).",
    color: "success",
  },
  {
    icon: Wallet,
    title: "3. Investors Deposit",
    description:
      "Investors choose their risk preference and deposit mUSDC into either the Senior or Junior vault. They receive vault shares representing their position.",
    color: "senior",
  },
  {
    icon: TrendingUp,
    title: "4. Revenue Posted",
    description:
      "At the end of each epoch, the verifier posts the verified revenue amount to the Revenue Oracle contract. This is the off-chain revenue translated on-chain.",
    color: "junior",
  },
  {
    icon: Lock,
    title: "5. Revenue Escrowed",
    description:
      "The verifier deposits the actual mUSDC funds into the Revenue Escrow contract. Funds are locked on-chain before any distribution occurs.",
    color: "warning",
  },
  {
    icon: Send,
    title: "6. Distribution",
    description:
      "Anyone can trigger the distribution once funds are escrowed. The Yield Distributor splits revenue between tranches based on the split ratio and sends it to the vaults.",
    color: "primary",
  },
  {
    icon: Coins,
    title: "7. Harvest Yield",
    description:
      "Investors call harvest() on their vault to claim accumulated rewards. They can also withdraw() their principal at any time by burning vault shares.",
    color: "success",
  },
];

const faqs = [
  {
    question: "What is a cashflow claim?",
    answer:
      "A cashflow claim is a legal or contractual right to receive payments from a revenue-generating asset. In OtterFlow, these claims are tokenized and represented as yield vaults. Important: This is NOT legal ownership of the underlying asset—it's a claim on the cashflows it produces.",
  },
  {
    question: "What's the difference between Senior and Junior tranches?",
    answer:
      "Senior tranche (Otter Safe) gets paid first from revenue, making it lower risk with more stable returns. Junior tranche (Otter Boost) absorbs losses first but earns higher yield when revenue is strong. Think of it like a waterfall: Senior gets filled first, then Junior gets the rest.",
  },
  {
    question: "What is an epoch?",
    answer:
      "An epoch is a time period (e.g., 7 days, 30 days) during which revenue accumulates. At the end of each epoch, the verifier posts the revenue amount, locks funds in escrow, and triggers distribution to vault holders.",
  },
  {
    question: "Who are the verifiers?",
    answer:
      "Verifiers are trusted parties (in this MVP, manually designated) who review pool proposals, verify off-chain revenue, and manage the on-chain revenue posting and escrow process. In production, this could be decentralized or automated with oracles.",
  },
  {
    question: "What are the risks?",
    answer:
      "Key risks include: (1) Revenue underperformance—if the underlying asset produces less revenue than expected, Junior tranche absorbs losses first. (2) Verification risk—verifiers must honestly report revenue. (3) Smart contract risk—bugs could affect fund security. Always do your own research.",
  },
  {
    question: "What is mUSDC?",
    answer:
      "mUSDC (Mock USDC) is a test token used for this hackathon demo. It has a faucet function so you can get test tokens. In production, this would be replaced with real stablecoins like USDC.",
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 gradient-hero border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              How OtterFlow Works
            </h1>
            <p className="text-lg text-muted-foreground">
              A step-by-step guide to revenue-backed yield vaults with
              transparent, on-chain distribution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 mb-8"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      step.color === "primary"
                        ? "bg-primary/20"
                        : step.color === "success"
                        ? "bg-success/20"
                        : step.color === "senior"
                        ? "bg-senior/20"
                        : step.color === "junior"
                        ? "bg-junior/20"
                        : "bg-warning/20"
                    }`}
                  >
                    <step.icon
                      className={`h-6 w-6 ${
                        step.color === "primary"
                          ? "text-primary"
                          : step.color === "success"
                          ? "text-success"
                          : step.color === "senior"
                          ? "text-senior"
                          : step.color === "junior"
                          ? "text-junior"
                          : "text-warning"
                      }`}
                    />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-px h-full bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tranche Diagram */}
      <section className="py-16 bg-card/30 border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">
              Understanding Tranches
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6 gradient-senior border-senior/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-senior/20 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-senior" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-foreground">
                      Otter Safe
                    </h3>
                    <p className="text-senior">Senior Tranche</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Priority:</strong> Gets
                    paid first from revenue
                  </p>
                  <p>
                    <strong className="text-foreground">Risk:</strong> Lower—only
                    loses if revenue is severely short
                  </p>
                  <p>
                    <strong className="text-foreground">Yield:</strong> More
                    stable, typically 5-8% APY
                  </p>
                  <p>
                    <strong className="text-foreground">Best for:</strong>{" "}
                    Conservative investors seeking predictable returns
                  </p>
                </div>
              </Card>

              <Card className="p-6 gradient-junior border-junior/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-junior/20 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-junior" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-foreground">
                      Otter Boost
                    </h3>
                    <p className="text-junior">Junior Tranche</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Priority:</strong> Gets
                    paid after Senior is satisfied
                  </p>
                  <p>
                    <strong className="text-foreground">Risk:</strong>{" "}
                    Higher—absorbs first losses
                  </p>
                  <p>
                    <strong className="text-foreground">Yield:</strong> Higher
                    upside, typically 12-20% APY
                  </p>
                  <p>
                    <strong className="text-foreground">Best for:</strong>{" "}
                    Risk-tolerant investors seeking higher returns
                  </p>
                </div>
              </Card>
            </div>

            {/* Waterfall Diagram */}
            <Card className="mt-8 p-6 bg-card border-border">
              <h4 className="font-semibold text-foreground mb-4 text-center">
                Revenue Waterfall
              </h4>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center mb-2">
                    <TrendingUp className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <div className="text-center">
                  <div className="w-24 h-16 bg-senior/20 rounded-lg flex items-center justify-center mb-2 border border-senior/30">
                    <Shield className="h-6 w-6 text-senior" />
                  </div>
                  <p className="text-xs text-senior">Senior First</p>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <div className="text-center">
                  <div className="w-24 h-16 bg-junior/20 rounded-lg flex items-center justify-center mb-2 border border-junior/30">
                    <Zap className="h-6 w-6 text-junior" />
                  </div>
                  <p className="text-xs text-junior">Junior Gets Rest</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex items-center gap-3 justify-center mb-8">
              <HelpCircle className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-card border border-border rounded-lg px-4"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet and explore available vaults.
            </p>
            <Button
              asChild
              size="lg"
              className="gap-2 bg-primary hover:bg-primary/90"
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
