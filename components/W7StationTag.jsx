"use client";

import React from 'react';
import Link from 'next/link';

export const W7StationTag = () => {
  return (
    <div className="flex justify-center py-8 opacity-45 [@media(hover:none)]:opacity-[0.65] hover:opacity-100 transition-opacity duration-700 ease-out">
      <Link
        href="https://waldo7labs.com"
        target="_blank"
        rel="noopener noreferrer"
        title="Built by Waldo7Labs | Custom Web Design"
        className="group relative inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-white/5 shadow-2xl border rounded transition-colors duration-700 ease-out hover:border-orange-500/50"
      >
        {/* Steam Puff Animation Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded">
           <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white/5 blur-xl rounded-full opacity-0 group-hover:animate-[steam_2s_infinite]" />
        </div>

        {/* Iron Rivets */}
        <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-white/10 rounded-full group-hover:bg-orange-500/50 transition-colors duration-700 ease-out" />
        <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-white/10 rounded-full group-hover:bg-orange-500/50 transition-colors duration-700 ease-out" />
        <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-white/10 rounded-full group-hover:bg-orange-500/50 transition-colors duration-700 ease-out" />
        <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-white/10 rounded-full group-hover:bg-orange-500/50 transition-colors duration-700 ease-out" />

        <img
          src="/branding/waldo7labs-tag.webp"
          alt="Waldo7Labs"
          aria-hidden="true"
          className="h-3.5 w-auto opacity-70 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(244,73,1,0.6)] transition-all duration-700 ease-out"
          loading="lazy"
        />

        <span className="text-[12px] uppercase font-black tracking-[0.2em] text-zinc-500 group-hover:text-zinc-300 transition-colors duration-700 ease-out">
          Built by Waldo<span className="text-orange-500">7</span>Labs
        </span>

        <style jsx>{`
          @keyframes steam {
            0% { transform: translate(-50%, 20px) scale(0.5); opacity: 0; }
            50% { opacity: 0.2; }
            100% { transform: translate(-50%, -40px) scale(2); opacity: 0; }
          }
        `}</style>
      </Link>
    </div>
  );
};
