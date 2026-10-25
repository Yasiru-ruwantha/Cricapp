"use client";
import React from 'react';

export function LogoAvatar({ src, fallback, size = 40 }: { src?: string; fallback: string; size?: number }) {
  return (
    <div 
      style={{ width: size, height: size }}
      className="rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold overflow-hidden border shadow-sm shrink-0"
    >
      {src ? (
        <img src={src} alt={fallback} className="w-full h-full object-cover" />
      ) : (
        <span>{fallback.slice(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
}
