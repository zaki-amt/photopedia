"use client";

import React, { useState, ReactNode } from "react";
import { AuthProvider, useAuth } from "@/app/hooks/useAuth";
import { HeaderNav } from "@/app/components/layout/HeaderNav";
import { SidebarNav } from "@/app/components/layout/SidebarNav";
import { Footer } from "@/app/components/layout/Footer";
import { Loader2 } from "lucide-react";

// Re-export useUser hook for backward compatibility with existing components
export { useUser } from "@/app/hooks/useAuth";

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const { loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#ededed] flex flex-col items-center justify-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
        <p className="text-xs font-mono text-zinc-400">Loading session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#ededed] flex flex-col md:flex-row font-sans selection:bg-white selection:text-black">
      {/* Sidebar Navigation */}
      <SidebarNav
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header Bar */}
        <HeaderNav
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Platform Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </AuthProvider>
  );
}
