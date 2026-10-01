"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Building2,
  ChartBarStacked,
  ClipboardCheck,
  CreditCard,
  HardHat,
  LayoutGrid,
  LogOut,
  Settings,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { removeToken } from "@/utils/storage";
import Image from "next/image";

function ProjexProLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <Image
        src="/logo/logo.png"
        alt="ProjexPro Logo"
        width={220}
        height={60}
        className="h-15 w-auto object-contain"
        priority
      />
    </div>
  );
}

type SidebarItem = {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
};

const sidebars: SidebarItem[] = [
  { name: "Dashboard", path: "/", icon: LayoutGrid },
  { name: "Overview Metrics", path: "/overview-metrics", icon: Users },
  { name: "Team Management", path: "/user-management", icon: Users },
  { name: "Partner Approvals", path: "/property-manager-approval", icon: ClipboardCheck },
  { name: "Property Partners", path: "/property-managers", icon: Building2 },
  // { name: "Property Review", path: "/property-review", icon: Home },
  { name: "Provider Management", path: "/provider", icon: HardHat },
  { name: "Request & Orders", path: "/request", icon: Wrench },
  { name: "Invoices & Payments", path: "/invoices", icon: CreditCard },
  { name: "Category", path: "/category", icon: ChartBarStacked },
  { name: "Subscription", path: "/subscription", icon: Sparkles },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function OptimusSidebar() {
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const confirmLogout = () => {
    removeToken();
    document.cookie = "cat-admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    toast.success("Logged out successfully");
    setShowLogoutModal(false);
    router.push("/auth/login");
  };

  return (
    <>
      <Sidebar className="border-r border-[#E5E7EB] bg-[#FFFFFF]">
        {/* Header Logo */}
        <SidebarHeader className="h-[81px] px-4 sm:px-5 border-b border-[#E5E7EB] bg-[#FFFFFF] flex items-center justify-start shrink-0">
          <Link href="/" className="block">
            <ProjexProLogo />
          </Link>
        </SidebarHeader>

        {/* Main Menu items */}
        <SidebarContent className="bg-[#FFFFFF] p-3">
          <SidebarMenu className="space-y-1.5">
            {sidebars.map((item) => {
              const active = isActive(item.path);
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    className={`h-11 px-4 rounded-lg transition-all duration-200 flex items-center justify-between w-full cursor-pointer ${active
                      ? "bg-[#E1D4F4] text-[#8E25E3] font-semibold hover:bg-[#E1D4F4] hover:text-[#8E25E3]"
                      : "text-gray-600 hover:bg-gray-200/70 hover:text-gray-900 font-medium"
                      }`}
                  >
                    <Link href={item.path} className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-5 w-5 ${active ? "text-[#8E25E3]" : "text-gray-600"}`} />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      {active && <span className="w-2 h-2 rounded-full bg-[#8E25E3]" />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        {/* Footer Logout Button */}
        <SidebarFooter className="p-3 border-t border-[#E5E7EB] bg-[#FFFFFF]">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-[#E53935] hover:bg-red-50/80 font-semibold text-sm transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5 text-[#E53935]" />
            <span>Logout</span>
          </button>
        </SidebarFooter>
      </Sidebar>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 ease-out">
            {/* Warning Icon Circle */}
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4 text-[#E53935]">
              <LogOut className="w-8 h-8 text-[#E53935]" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Logout</h3>
            <p className="text-sm text-gray-500 mb-6 font-normal">
              Are you sure you want to log out of your ProjexPro account?
            </p>

            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="flex-1 py-3 px-4 bg-[#E53935] hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}