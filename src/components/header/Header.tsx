"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Bell, ChevronDown, LogOut, User, X } from "lucide-react";
import toast from "react-hot-toast";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { removeToken } from "../../utils/storage";

const AUTH_COOKIE_NAME = "cat-admin-token";

export default function Header() {
  const userName = "Alex Morgan";
  const userInitials = "AM";
  const userRole = "Super Admin";
  const notificationCount = 2;

  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMyProfile = () => {
    router.push("/settings");
    setIsDropdownOpen(false);
  };

  const handleNotificationClick = () => {
    setIsDropdownOpen(false);
    router.push("/notifications");
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setShowLogoutConfirmModal(true);
  };

  const handleConfirmLogout = () => {
    removeToken();
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    document.cookie = `cat-admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    toast.success("Logged out successfully");
    setShowLogoutConfirmModal(false);
    router.push("/auth/login");
  };

  return (
    <>
      <header className="flex h-[81px] items-center justify-between px-3 sm:px-6 bg-[#FFFFFF] border-b border-[#E5E7EB] w-full shrink-0">
        {/* Left side - Sidebar Toggle & Slogan Header */}
        <div className="flex items-center gap-2 sm:gap-3">
          <SidebarTrigger className="p-2 text-gray-700 hover:bg-gray-200/80 rounded-xl cursor-pointer" />
        </div>

        {/* Right side - Notification and Profile */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Notification Bell Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={handleNotificationClick}
              className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-[#FFFFFF] hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-[#E5E7EB] shadow-2xs"
              title="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF9F00] text-white font-bold text-[10px] rounded-full flex items-center justify-center border border-white">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>

          {/* User Profile Pill with Dropdown */}
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              type="button"
              onClick={handleProfileClick}
              className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 bg-[#FFFFFF] hover:bg-gray-50 rounded-lg border border-[#E5E7EB] transition-colors cursor-pointer shadow-2xs w-full"
            >
              {/* Initial Avatar Badge */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#8E25E3] text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                {userInitials}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-xs sm:text-sm font-bold text-gray-900">{userName}</span>
                <span className="text-[10px] font-semibold text-[#8E25E3]">{userRole}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 ml-0.5 shrink-0" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 w-full min-w-full rounded-lg border border-gray-200 bg-white py-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                <button
                  type="button"
                  onClick={handleMyProfile}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs sm:text-sm font-medium cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="truncate">My Profile</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs sm:text-sm font-semibold cursor-pointer text-[#E53935] hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-[#E53935] shrink-0" />
                  <span className="truncate">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-base">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
                <span>Confirm Logout</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
              Are you sure you want to log out of ProjexPro Super Admin Dashboard? You will need to enter your credentials again to access your account.
            </p>

            <div className="pt-2 border-t border-gray-200 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium text-xs rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-md shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Yes, Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}