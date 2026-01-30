'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const ScrollingBackground = React.memo(function ScrollingBackground() {
    // 1. Initialize with empty state (renders null on server/first client pass)
    // This solves the hydration mismatch because server and client initial render are both empty.
    const [rows, setRows] = useState([]);

    useEffect(() => {
        // 2. Generate random values ONLY on the client after mount
        const newRows = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            speed: 60 + (i % 3) * 20 + Math.random() * 20, // 60s to ~100s duration (Very slow)
            direction: i % 2 === 0 ? 'normal' : 'reverse',
            opacity: 0.1 + (Math.random() * 0.1),
            delay: -(Math.random() * 100) // Ensure large enough offset to properly randomize positions
        }));
        setRows(newRows);
    }, []);

    // Return null during SSR and initial hydration to match
    if (rows.length === 0) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Tilted Container */}
            <div
                className="absolute inset-[-50%] flex flex-col gap-8 justify-center items-center transform -rotate-12 scale-150"
                style={{ width: '200%', height: '200%' }}
            >
                {rows.map((row) => (
                    <div
                        key={row.id}
                        className="flex gap-8 whitespace-nowrap w-full"
                        style={{
                            opacity: row.opacity,
                        }}
                    >
                        {/* Inner Marquee Container */}
                        <div
                            className="flex gap-8 items-center shrink-0"
                            style={{
                                animation: `marquee${row.direction === 'reverse' ? '-reverse' : ''} ${row.speed}s linear infinite`,
                                animationDelay: `${row.delay}s`
                            }}
                        >
                            {[...Array(20)].map((_, itemIndex) => (
                                <div key={itemIndex} className="flex items-center gap-4">
                                    <span className="text-4xl md:text-6xl font-black text-cat-yellow tracking-widest font-mono">
                                        $catcoin
                                    </span>
                                    <div className="relative w-8 h-8 md:w-12 md:h-12">
                                        <Image
                                            src="/assets/catcoin-logo.png"
                                            alt="Catcoin Logo"
                                            fill
                                            className="object-contain"
                                            sizes="10vw"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Duplicate for continuity */}
                        <div
                            className="flex gap-8 items-center shrink-0"
                            style={{
                                animation: `marquee${row.direction === 'reverse' ? '-reverse' : ''} ${row.speed}s linear infinite`,
                                animationDelay: `${row.delay}s`
                            }}
                        >
                            {[...Array(20)].map((_, itemIndex) => (
                                <div key={`dup-${itemIndex}`} className="flex items-center gap-4">
                                    <span className="text-4xl md:text-6xl font-black text-cat-yellow tracking-widest font-mono">
                                        $catcoin
                                    </span>
                                    <div className="relative w-8 h-8 md:w-12 md:h-12">
                                        <Image
                                            src="/assets/catcoin-logo.png"
                                            alt="Catcoin Logo"
                                            fill
                                            className="object-contain"
                                            sizes="10vw"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default ScrollingBackground;
