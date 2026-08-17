"use client";

import React, { useEffect } from "react";
import { X, Maximize2, ExternalLink, Camera } from "lucide-react";

export interface PhotoLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  title?: string;
  category?: string;
  authorName?: string;
  authorUsername?: string;
  exifCamera?: string;
  exifLens?: string;
}

export function PhotoLightboxModal({
  isOpen,
  onClose,
  image,
  title = "Photograph",
  category,
  authorName,
  authorUsername,
  exifCamera,
  exifLens,
}: PhotoLightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 font-sans animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Lightbox Header Bar */}
      <div
        className="flex items-center justify-between z-10 bg-zinc-950/80 border border-zinc-800 rounded-2xl p-3 sm:px-5 backdrop-blur-md max-w-7xl w-full mx-auto shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-1.5 bg-black border border-zinc-800 rounded-xl text-zinc-400 shrink-0">
            <Maximize2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-heading text-sm sm:text-base font-bold text-white truncate">{title}</h3>
            {category && (
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                {category} Archive
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={image}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl transition-all"
            title="Open original uncompressed image"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Original</span>
          </a>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl transition-colors"
            title="Close Lightbox (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Full Image Viewport */}
      <div
        className="flex-1 flex items-center justify-center py-4 my-auto relative w-full max-w-7xl mx-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="max-h-[82vh] max-w-[95vw] w-auto h-auto object-contain rounded-2xl shadow-2xl border border-zinc-800/80 transition-all"
        />
      </div>

      {/* Lightbox Footer Info Bar */}
      <div
        className="z-10 bg-zinc-950/80 border border-zinc-800 rounded-2xl p-3 sm:px-5 backdrop-blur-md max-w-7xl w-full mx-auto shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {authorName ? (
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-mono text-[11px]">Photographer:</span>
            <span className="font-semibold text-white font-heading">{authorName}</span>
            {authorUsername && <span className="font-mono text-[11px] text-zinc-500">(@{authorUsername})</span>}
          </div>
        ) : (
          <span className="text-[11px] font-mono text-zinc-500">Uncompressed High Resolution View</span>
        )}

        {exifCamera && (
          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-300">
            <Camera className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span>
              {exifCamera} {exifLens ? `• ${exifLens}` : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PhotoLightboxModal;
