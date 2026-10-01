import type { Metadata } from "next";
import OptimusSidebar from "@/components/appSidebar/AppsideBar";
import Header from "@/components/header/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "../globals.css";

export const metadata: Metadata = {
  title: "ProjexPro Super Admin Dashboard",
  description: "ProjexPro Super Admin Management Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <OptimusSidebar />
      <SidebarInset className="bg-gray-100 h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-[#F8F9FA] p-4 sm:p-6 md:p-8 overflow-auto min-w-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
