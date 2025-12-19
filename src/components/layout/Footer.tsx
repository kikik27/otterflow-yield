import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-junior flex items-center justify-center">
                <span className="text-lg">🦦</span>
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                OtterFlow
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Tokenizing cashflow claims into yield vaults with transparent,
              on-chain revenue distribution. Real assets, real yield.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/vaults"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Explore Vaults
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  to="/portfolio"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/otterflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://sepolia-blockscout.lisk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  Block Explorer
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Disclaimer:</strong> This is a hackathon demo. Cashflow
            claims are not legal ownership. Yield depends on verified revenue.
            Always do your own research.
          </p>
          <p className="text-xs text-muted-foreground text-center mt-2">
            © {new Date().getFullYear()} OtterFlow. Built with 🦦 for the
            blockchain.
          </p>
        </div>
      </div>
    </footer>
  );
}
