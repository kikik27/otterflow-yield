import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { config } from "@/lib/wagmi";
import { MainLayout } from "@/components/layout";
import Landing from "@/pages/Landing";
import Explore from "@/pages/Explore";
import VaultDetail from "@/pages/VaultDetail";
import Portfolio from "@/pages/Portfolio";
import HowItWorks from "@/pages/HowItWorks";
import VerifierConsole from "@/pages/VerifierConsole";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/vaults" element={<Explore />} />
              <Route path="/vaults/:poolId" element={<VaultDetail />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/verifier" element={<VerifierConsole />} />
              <Route path="/verifier/revenue" element={<VerifierConsole />} />
              <Route path="/verifier/distribute" element={<VerifierConsole />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
