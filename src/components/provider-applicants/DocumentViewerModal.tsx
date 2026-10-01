"use client";

import React from "react";
import { X, FileText, Download, ExternalLink } from "lucide-react";
import { baseURL } from "@/utils/BaseURL";

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export default function DocumentViewerModal({
  isOpen,
  onClose,
  title,
  url,
}: DocumentViewerModalProps) {
  if (!isOpen || !url) return null;

  const getFullUrl = (docUrl: string) => {
    if (!docUrl) return "";
    if (docUrl.startsWith("http://") || docUrl.startsWith("https://")) return docUrl;
    return `${baseURL}${docUrl.startsWith("/") ? "" : "/"}${docUrl}`;
  };

  const fullUrl = getFullUrl(url);
  const cleanUrl = url.toLowerCase();
  const isPdf = cleanUrl.endsWith(".pdf");
  const isImage = cleanUrl.endsWith(".png") || cleanUrl.endsWith(".jpg") || cleanUrl.endsWith(".jpeg") || cleanUrl.endsWith(".webp") || cleanUrl.endsWith(".gif");

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl flex flex-col max-h-[90vh] border border-gray-200 overflow-hidden relative">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-gray-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#8E25E3] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight truncate">
                {title || "Submitted Document"}
              </h3>
              <p className="text-xs text-gray-500 font-medium truncate mt-0.5">
                Dashboard Document Viewer
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="p-2 text-gray-500 hover:text-[#8E25E3] bg-gray-100 hover:bg-purple-50 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Open in new window / Download"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Open Original</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-auto bg-gray-900/5 p-4 flex items-center justify-center min-h-[50vh] max-h-[75vh]">
          {isImage ? (
            <img
              src={fullUrl}
              alt={title}
              className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-md bg-white p-2"
            />
          ) : isPdf ? (
            <iframe
              src={fullUrl}
              title={title}
              className="w-full h-[70vh] rounded-xl border border-gray-200 shadow-sm bg-white"
            />
          ) : (
            <iframe
              src={fullUrl}
              title={title}
              className="w-full h-[70vh] rounded-xl border border-gray-200 shadow-sm bg-white"
            />
          )}
        </div>
      </div>
    </div>
  );
}
