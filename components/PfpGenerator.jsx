'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { attributesConfig } from '@/data/attributes';
import ScrollingBackground from './ScrollingBackground';
import { Download, Share2, Copy, Check, Shuffle, Camera, Play, Pause, SkipForward, SkipBack, Music, Trash2 } from 'lucide-react';

export default function PfpGenerator() {
    // Initialize state with random items
    // Initialize state deterministically first to prevent hydration mismatch
    const [selectedAttributes, setSelectedAttributes] = useState(() => {
        const initial = {};
        attributesConfig.forEach(cat => {
            if (cat.id === 'body') {
                // Ensure default body is 'body_1' (Basic) or first non-hidden
                initial[cat.id] = cat.items.find(i => !i.hidden) || cat.items[0];
            } else {
                initial[cat.id] = cat.items[0];
            }
        });
        return initial;
    });

    // Shape state: 'circle' | 'square'
    const [pfpShape, setPfpShape] = useState('circle');
    const [shirtDirection, setShirtDirection] = useState('left');
    const [bodyDirection, setBodyDirection] = useState('left');
    const [costumeDirection, setCostumeDirection] = useState('left');
    const [animatingLayer, setAnimatingLayer] = useState(null);
    const [isExploding, setIsExploding] = useState(false);
    const [showCopyCheck, setShowCopyCheck] = useState(false);
    const [customBackground, setCustomBackground] = useState({
        color1: '#7c3aed',
        color2: '#1e3a8a',
        type: 'linear', // 'solid', 'linear', 'radial'
    });

    // Music Player State
    const songs = [
        { title: 'Catcoin Army', src: '/music/Catcoin Army.mp3' },
        { title: 'Claws Out (Catcoin Anthem)', src: '/music/Claws Out (Catcoin Anthem).mp3' },
        { title: 'Digital Whiskers', src: '/music/Digital Whiskers in a Neon Glow.mp3' },
        { title: 'Keep It Catcoin', src: '/music/Keep It Catcoin.mp3' },
        { title: 'The History & The King', src: '/music/The History & The King.mp3' }
    ];
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Playback error", e));
        }
        setIsPlaying(!isPlaying);
    };

    const skipForward = () => {
        const nextIndex = (currentSongIndex + 1) % songs.length;
        setCurrentSongIndex(nextIndex);
        // Play automatically if was playing
        if (isPlaying) {
            setTimeout(() => audioRef.current.play(), 100);
        }
    };

    const skipBack = () => {
        const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        setCurrentSongIndex(prevIndex);
        // Play automatically if was playing
        if (isPlaying) {
            setTimeout(() => audioRef.current.play(), 100);
        }
    };

    // Randomize on mount (Client-side only)
    useEffect(() => {
        randomize();
        setAnimatingLayer('all');
        const timer = setTimeout(() => setAnimatingLayer(null), 800);
        return () => clearTimeout(timer);
    }, []);
    const canvasRef = useRef(null);

    // Handle attribute selection
    const handleAttributeSelect = (categoryId, item) => {
        setSelectedAttributes(prev => {
            // TOGGLE LOGIC: If clicking the same item that's already selected
            if (prev[categoryId]?.id === item.id) {
                const category = attributesConfig.find(c => c.id === categoryId);
                const noneItem = category.items.find(i => i.type === 'none' || i.id.includes('none'));

                // For categories that REQUIRE a selection (like background/body), 
                // falling back to 'none' might be invalid or undesirable.
                // Revert to first item for these, or 'none' for others.
                if (categoryId === 'background' || categoryId === 'body') {
                    const fallback = category.items.find(i => !i.hidden) || category.items[0];
                    // Only toggle if we aren't already on the fallback
                    if (prev[categoryId].id !== fallback.id) {
                        return { ...prev, [categoryId]: fallback };
                    }
                    return prev; // Stay as is if clicking the fallback
                }

                if (noneItem) {
                    return { ...prev, [categoryId]: noneItem };
                }
            }

            const next = { ...prev, [categoryId]: item };

            // COSTUME LOGIC
            if (categoryId === 'costume' && item.type !== 'none') {
                // If selecting a costume, clear all other body/accessory layers
                attributesConfig.forEach(cat => {
                    if (['body', 'eyes', 'shirt', 'chain', 'glasses', 'hat', 'mouth'].includes(cat.id)) {
                        next[cat.id] = cat.items.find(i => i.type === 'none') || cat.items[0];
                    }
                });
                // Trigger explosion
                setIsExploding(true);
                setTimeout(() => setIsExploding(false), 600);
            } else if (['body', 'eyes', 'shirt', 'chain', 'glasses', 'hat', 'mouth'].includes(categoryId)) {
                // If selecting an accessory/body while a costume is active, remove costume
                // And ensure we have a valid body if it was previously 'none' (though our logic sets it to 'none' above?)
                // Actually, if we set body to 'none' in costume mode, we need to restore it.
                // Let's restore to 'body_1' (Basic) if body is currently none/cleared.
                if (prev.costume?.type !== 'none') {
                    next.costume = attributesConfig.find(c => c.id === 'costume').items[0]; // Set to None
                    if (categoryId !== 'body') {
                        // If we are changing a hat, we need a body backing it up.
                        // Find the first visible body (not the hidden 'None' one)
                        const bodyCat = attributesConfig.find(c => c.id === 'body');
                        next.body = bodyCat.items.find(i => !i.hidden) || bodyCat.items[0];
                    }
                }
            }

            return next;
        });

        // Trigger animation
        setAnimatingLayer(categoryId);
        if (categoryId === 'shirt') {
            setShirtDirection(Math.random() > 0.5 ? 'left' : 'right');
        }
        if (categoryId === 'body') {
            setBodyDirection(Math.random() > 0.5 ? 'left' : 'right');
        }
        if (categoryId === 'costume') {
            setCostumeDirection(Math.random() > 0.5 ? 'left' : 'right');
        }
        setTimeout(() => setAnimatingLayer(null), 500); // Reset after animation duration
    };

    // Randomize all attributes
    const randomize = () => {
        const newSelection = {};
        attributesConfig.forEach(cat => {
            // Exclude costume and vibes from standard randomization if preferred, or include them?
            // Let's include Vibes but maybe not costume.
            if (cat.id === 'costume') {
                newSelection[cat.id] = cat.items[0]; // Always None
                return;
            }
            if (cat.id === 'body') {
                const validItems = cat.items.filter(i => !i.hidden);
                newSelection[cat.id] = validItems[Math.floor(Math.random() * validItems.length)];
            } else {
                newSelection[cat.id] = cat.items[Math.floor(Math.random() * cat.items.length)];
            }
        });
        setSelectedAttributes(newSelection);
        setAnimatingLayer('all');
        setShirtDirection(Math.random() > 0.5 ? 'left' : 'right');
        setBodyDirection(Math.random() > 0.5 ? 'left' : 'right');
        setTimeout(() => setAnimatingLayer(null), 500);
    };

    const handleClear = () => {
        const newSelection = {};
        attributesConfig.forEach(cat => {
            if (cat.id === 'background') {
                newSelection[cat.id] = cat.items[0]; // Midnight
            } else if (cat.id === 'body') {
                newSelection[cat.id] = cat.items.find(i => i.id === 'body_1') || cat.items[1]; // Basic
            } else {
                newSelection[cat.id] = cat.items.find(i => i.type === 'none' || i.id.includes('none')) || cat.items[0];
            }
        });
        setSelectedAttributes(newSelection);
        setAnimatingLayer('all');
        setTimeout(() => setAnimatingLayer(null), 500);
    };

    // Themed Randomizer
    const shuffleThemed = (theme) => {
        const newSelection = { ...selectedAttributes };
        attributesConfig.forEach(cat => {
            let pool = cat.items;
            if (theme === 'cosmic') {
                if (cat.id === 'background') pool = cat.items.filter(i => ['Midnight', 'Sunset Drive', 'Neon Cyber', 'Midnight City', 'Lava Flow'].includes(i.label));
                if (cat.id === 'body') pool = cat.items.filter(i => ['Chrome', 'Ghost', 'Alien', 'Robot'].includes(i.label));
                if (cat.id === 'vibe') pool = cat.items.filter(i => ['Matrix', 'Dreamy'].includes(i.label));
                if (cat.id === 'eyes') pool = cat.items.filter(i => ['White', 'Teal', 'Yellow'].includes(i.label));
            } else if (theme === 'tough') {
                if (cat.id === 'background') pool = cat.items.filter(i => ['Midnight', 'Charcoal', 'Crimson', 'Lava Flow'].includes(i.label));
                if (cat.id === 'body') pool = cat.items.filter(i => ['Black', 'Tiger', 'Camo', 'Zombie'].includes(i.label));
                if (cat.id === 'shirt') pool = cat.items.filter(i => ['Biker', 'SWAT', 'Hilfiger'].includes(i.label));
                if (cat.id === 'hat') pool = cat.items.filter(i => ['Army', 'Police', 'Viking'].includes(i.label));
                if (cat.id === 'vibe') pool = cat.items.filter(i => ['Noir'].includes(i.label));
            } else if (theme === 'party') {
                if (cat.id === 'background') pool = cat.items.filter(i => ['Cat Yellow', 'Emerald', 'Hot Pink', 'Cotton Candy'].includes(i.label));
                if (cat.id === 'body') pool = cat.items.filter(i => ['Rainbow', 'Gold'].includes(i.label));
                if (cat.id === 'vibe') pool = cat.items.filter(i => ['Vibrant'].includes(i.label));
                if (cat.id === 'speech') pool = cat.items.filter(i => ['GM', 'WAGMI', 'Meow'].includes(i.label));
            }

            if (pool.length > 0) {
                newSelection[cat.id] = pool[Math.floor(Math.random() * pool.length)];
            }
        });
        setSelectedAttributes(newSelection);
        setAnimatingLayer('all');
        setIsExploding(true);
        setTimeout(() => setIsExploding(false), 600);
        setTimeout(() => setAnimatingLayer(null), 500);
    };

    // Helper to load image for canvas
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            // img.crossOrigin = 'anonymous'; // Removed to avoid potential local asset CORS issues
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(e);
        });
    };

    // Draw to canvas for download/copy (High Res 2048x2048)
    const drawToCanvas = async (ctx) => {
        // Clear canvas (assuming 2048x2048 size, logic scale 4x)
        // We will scale the context so 512 units = 2048 pixels
        // But first clear in pixel space
        const canvas = ctx.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.scale(4, 4); // Scale everything up 4x (512 -> 2048)

        // Apply Vibe filter if selected
        const vibe = selectedAttributes['vibe'];
        if (vibe && vibe.type !== 'none') {
            if (vibe.id === 'vibe_8bit' && ctx.canvas.width > 1000) {
                ctx.filter = 'url(#pixelate-highres)';
            } else {
                ctx.filter = vibe.value;
            }
        }

        // Create clipping path based on shape (Scaled Space)
        ctx.beginPath();
        if (pfpShape === 'circle') {
            ctx.arc(256, 256, 256, 0, Math.PI * 2);
        } else {
            // Perfect Square (no rounding)
            ctx.rect(0, 0, 512, 512);
        }
        ctx.clip();

        // 1. Background Layer (zIndex 10)
        const bgItem = selectedAttributes['background'];
        if (bgItem) {
            if (bgItem.canvasGradient) {
                const cg = bgItem.canvasGradient;
                let gradient;
                if (cg.type === 'linear') {
                    gradient = ctx.createLinearGradient(cg.x0, cg.y0, cg.x1, cg.y1);
                } else if (cg.type === 'radial') {
                    gradient = ctx.createRadialGradient(cg.x0, cg.y0, cg.r0, cg.x1, cg.y1, cg.r1);
                }

                if (gradient && cg.stops) {
                    cg.stops.forEach(stop => gradient.addColorStop(stop[0], stop[1]));
                    ctx.fillStyle = gradient;
                } else if (bgItem.color) {
                    ctx.fillStyle = bgItem.color;
                }
            } else if (bgItem.color) {
                ctx.fillStyle = bgItem.color;
            } else if (bgItem.id === 'bg_custom') {
                // Handle Custom Background
                if (customBackground.type === 'solid') {
                    ctx.fillStyle = customBackground.color1;
                } else if (customBackground.type === 'linear') {
                    const grad = ctx.createLinearGradient(0, 0, 0, 512);
                    grad.addColorStop(0, customBackground.color1);
                    grad.addColorStop(1, customBackground.color2);
                    ctx.fillStyle = grad;
                } else {
                    const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 360);
                    grad.addColorStop(0, customBackground.color1);
                    grad.addColorStop(1, customBackground.color2);
                    ctx.fillStyle = grad;
                }
            }
            if (ctx.fillStyle) ctx.fillRect(0, 0, 512, 512);
        }

        // 2. Base Cat Layer (zIndex 20) - Deprecated, now handled by dynamic "body" attribute (zIndex 20)
        // If no body is selected (rare), render nothing or fallback?
        // We rely on attributesConfig loop.


        // 3. Accessory Layers (sorted zIndex > 20)
        const sortedCategories = [...attributesConfig].sort((a, b) => a.zIndex - b.zIndex);

        for (const cat of sortedCategories) {
            if (cat.id === 'background') continue; // Handled

            const item = selectedAttributes[cat.id];
            if (!item || (item.type === 'none' && !item.src)) continue;

            // Draw Image Assets (Shirt, Glasses, etc.)
            if (item.src) {
                let imgToDraw = null;
                try {
                    // Try loading high-res original
                    imgToDraw = await loadImage(item.src);
                } catch (e) {
                    console.warn(`Failed to load high-res image for ${cat.label}, falling back to visible element`, e);
                }

                // Fallback to visible DOM element if high-res failed
                if (!imgToDraw) {
                    const visibleImg = document.querySelector(`img[alt="${cat.id}-${item.label}"]`);
                    if (visibleImg && visibleImg.complete && visibleImg.naturalWidth > 0) {
                        imgToDraw = visibleImg;
                    }
                }

                if (imgToDraw) {
                    ctx.drawImage(imgToDraw, 0, 0, 512, 512);
                } else {
                    console.error('Could not draw image for:', cat.label);
                }
            }

            // Draw Placeholder shapes (Legacy Colors only if NO src)
            if (item.color && !item.src && !['background', 'border', 'border_color'].includes(cat.id)) {
                ctx.fillStyle = item.color;
                // Simple shape logic
                const size = 300 - (cat.zIndex > 20 ? (cat.zIndex - 20) : 0) * 2;
                const offset = (512 - size) / 2;
                if (cat.id === 'glasses') {
                    ctx.fillRect(offset, offset, size, size / 3 + 20);
                } else {
                    ctx.beginPath();
                    ctx.roundRect(offset, offset, size, size, 20);
                    ctx.fill();
                }
            }

            // Draw Border (zIndex 80)
            // Draw Border (zIndex 80)
            // Draw Border (zIndex 90 - now combined from components)
            if (cat.id === 'border_color') { // Use border_color as the trigger
                const bColor = selectedAttributes['border_color'];
                const bStyle = selectedAttributes['border_style']?.value || 'solid';
                const bWidth = selectedAttributes['border_width']?.value || 10;

                if (bColor && bColor.type !== 'none' && bColor.color) {
                    const drawPath = (inset = 0) => {
                        ctx.beginPath();
                        if (pfpShape === 'circle') {
                            ctx.arc(256, 256, 256 - inset, 0, Math.PI * 2);
                        } else {
                            ctx.rect(inset, inset, 512 - inset * 2, 512 - inset * 2);
                        }
                    };

                    ctx.save();
                    ctx.strokeStyle = bColor.color;
                    ctx.lineWidth = bWidth;
                    ctx.lineCap = pfpShape === 'circle' ? 'round' : 'square';
                    ctx.lineJoin = pfpShape === 'circle' ? 'round' : 'miter';

                    if (bStyle === 'neon') {
                        ctx.shadowBlur = bWidth + 10;
                        ctx.shadowColor = bColor.color;
                    }

                    if (bStyle === 'dashed') ctx.setLineDash([bWidth * 3, bWidth * 1.5]);
                    if (bStyle === 'dotted') {
                        ctx.setLineDash([0, bWidth * 2]);
                        ctx.lineCap = 'round';
                    }

                    if (bStyle === 'double') {
                        const gap = bWidth;
                        // Outer
                        ctx.lineWidth = bWidth / 2;
                        drawPath(bWidth / 4);
                        ctx.stroke();
                        // Inner
                        drawPath(bWidth * 1.5);
                        ctx.stroke();
                    } else if (bStyle === 'jagged') {
                        // Custom Jagged Path
                        ctx.beginPath();
                        const cx = 256, cy = 256;
                        // Approximate jagged path radius
                        const r = 256 - bWidth;
                        const spikes = 60;
                        const outerR = r;
                        const innerR = r - bWidth;

                        if (pfpShape === 'circle') {
                            for (let i = 0; i < spikes; i++) {
                                const step = Math.PI * 2 / spikes;
                                const angle = i * step;
                                const x1 = cx + Math.cos(angle) * outerR;
                                const y1 = cy + Math.sin(angle) * outerR;
                                ctx.lineTo(x1, y1);
                                const x2 = cx + Math.cos(angle + step / 2) * innerR;
                                const y2 = cy + Math.sin(angle + step / 2) * innerR;
                                ctx.lineTo(x2, y2);
                            }
                            ctx.closePath();
                            ctx.stroke();
                        } else {
                            // Square ZigZag (Simplified Dash fallback for complexity)
                            drawPath(bWidth / 2);
                            ctx.setLineDash([bWidth, bWidth]);
                            ctx.stroke();
                        }
                    } else if (bStyle === 'wave') {
                        drawPath(bWidth / 2);
                        // Waves are hard without path2d manipulation libraries or complex loops
                        // Fallback to stylized dash
                        ctx.setLineDash([bWidth * 2, bWidth]);
                        ctx.stroke();
                    }
                    else {
                        // Standard Solid
                        drawPath(bWidth / 2); // Center stroke on the inset line
                        ctx.stroke();
                    }

                    ctx.restore();
                }
            }

            // Draw Speech Bubbles (Emoji Only)
            if (cat.id === 'speech' && item.emoji) {
                ctx.save();
                ctx.font = '50px Arial'; // Larger font for single emoji
                const bubbleSize = 70;
                const bx = 420; // Positioned near mouth
                const by = 260;

                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 3;

                ctx.beginPath();
                ctx.roundRect(bx, by, bubbleSize, bubbleSize, 18);
                ctx.fill();
                ctx.stroke();

                // Pointer
                ctx.beginPath();
                ctx.moveTo(bx + 15, by + bubbleSize);
                ctx.lineTo(bx + 0, by + bubbleSize + 12);
                ctx.lineTo(bx + 30, by + bubbleSize);
                ctx.fill();
                ctx.stroke();

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(item.emoji, bx + bubbleSize / 2, by + bubbleSize / 2 + 4);
                ctx.restore();
            }
        }
        ctx.restore(); // Restore scale
    };

    const handleDownload = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Temporarily resize canvas to High Res for export
        canvas.width = 2048;
        canvas.height = 2048;

        const ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'source-over';

        await drawToCanvas(ctx);

        canvas.toBlob((blob) => {
            if (!blob) {
                console.error('Blob generation failed');
                return;
            }
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `catcoin-pfp-${Date.now()}.png`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Cleanup
            setTimeout(() => {
                URL.revokeObjectURL(url);
                canvas.width = 512;
                canvas.height = 512;
            }, 100);
        }, 'image/png', 1.0);
    };

    const handleCopy = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = 2048;
        canvas.height = 2048;

        const ctx = canvas.getContext('2d');
        await drawToCanvas(ctx); // await needed now

        canvas.toBlob(blob => {
            if (blob) {
                navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
                    .then(() => {
                        setShowCopyCheck(true);
                        setTimeout(() => setShowCopyCheck(false), 2000);
                    })
                    .catch(err => console.error('Copy failed', err));
                // Restore size
                canvas.width = 512;
                canvas.height = 512;
            }
        });
    };

    // Render Control Wing (Now a horizontal category stack)
    const renderControls = (categories) => (
        <div className="flex flex-col gap-6 lg:gap-2 py-4 lg:py-2 px-2 lg:px-4 w-full">
            {categories.map(cat => (
                <div key={cat.id} className="space-y-2 lg:space-y-1 group/category">
                    <div className="flex items-center gap-2 px-1">
                        <div className="w-1 h-3 bg-cat-yellow rounded-full"></div>
                        <h3 className="text-white font-black uppercase tracking-tight text-xs lg:text-[10px]">{cat.label}</h3>
                    </div>

                    {/* Horizontal Scrollable Row */}
                    <div
                        className="flex gap-2 items-center overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
                        onWheel={(e) => {
                            if (e.deltaY !== 0) {
                                // Map vertical scroll to horizontal scroll
                                e.currentTarget.scrollLeft += e.deltaY;
                                e.preventDefault();
                            }
                        }}
                    >
                        {/* Render actual items, filtering out hidden ones */}
                        {cat.items.filter(i => !i.hidden).map(item => (
                            <React.Fragment key={item.id}>
                                <button
                                    onClick={() => handleAttributeSelect(cat.id, item)}
                                    className={`
                                    flex-shrink-0 w-[23%] lg:w-[72px] aspect-square border transition-all hover:scale-105 active:scale-95 relative overflow-hidden rounded-xl snap-start
                                    ${selectedAttributes[cat.id]?.id === item.id
                                            ? 'border-cat-yellow ring-2 ring-cat-yellow/20 shadow-[0_0_15px_rgba(250,210,5,0.2)] bg-white/5'
                                            : 'border-white/10 bg-[#1e1e24] hover:border-white/30'}
                                `}
                                    title={item.label}
                                >
                                    {/* BASE LAYER */}
                                    {cat.id === 'background' || cat.id === 'speech' ? (
                                        <div
                                            className="absolute inset-0"
                                            style={{ background: item.color || '#2a2a2e' }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-black/20">
                                            <Image
                                                src="/assets/body/basic.png"
                                                alt="Base"
                                                fill
                                                className="object-contain opacity-40 grayscale group-hover/category:opacity-60 transition-opacity"
                                                sizes="120px"
                                                unoptimized
                                            />
                                        </div>
                                    )}

                                    {/* OVERLAY LAYER (The Item) */}
                                    {cat.id === 'background' ? (
                                        item.type === 'custom' ? (
                                            <div className="absolute inset-0 flex items-center justify-center text-2xl z-20">
                                                🎨
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 pointer-events-none">
                                                <Image
                                                    src="/assets/body/basic.png"
                                                    alt="Cat Preview"
                                                    fill
                                                    className="object-contain"
                                                    sizes="120px"
                                                    unoptimized
                                                />
                                            </div>
                                        )
                                    ) : (cat.id.startsWith('border') || cat.id === 'vibe' || cat.id === 'speech') ? (
                                        <div className="absolute inset-0">
                                            {cat.id === 'border_color' && item.color && (
                                                <div className="w-full h-full rounded border-[6px]" style={{ borderColor: item.color }} />
                                            )}
                                            {cat.id === 'border_style' && (
                                                <div className="w-full h-full rounded border-white"
                                                    style={{
                                                        border: (() => {
                                                            const s = item.value;
                                                            if (['double', 'dashed', 'dotted', 'groove', 'ridge', 'inset', 'outset'].includes(s)) {
                                                                return `4px ${s} #fff`;
                                                            }
                                                            return '4px solid #fff';
                                                        })(),
                                                        boxShadow: item.value === 'neon' ? '0 0 10px #fff' : 'none',
                                                    }}
                                                />
                                            )}
                                            {cat.id === 'border_width' && (
                                                <div className="w-full h-full border-white/80"
                                                    style={{
                                                        borderWidth: Math.max(2, item.value / 3) + 'px',
                                                        borderStyle: 'solid'
                                                    }}
                                                />
                                            )}
                                            {cat.id === 'vibe' && item.type !== 'none' && (
                                                <div className="absolute inset-0 z-20">
                                                    <Image
                                                        src="/assets/body/basic.png"
                                                        alt={item.label}
                                                        fill
                                                        style={{ filter: item.value }}
                                                        className="object-contain"
                                                        sizes="120px"
                                                        unoptimized
                                                    />
                                                    <div className="absolute bottom-1 inset-x-1 bg-black/80 text-[7px] font-black py-0.5 rounded tracking-tighter uppercase whitespace-nowrap overflow-hidden">
                                                        {item.label}
                                                    </div>
                                                </div>
                                            )}
                                            {cat.id === 'speech' && item.type !== 'none' && (
                                                <div className="absolute inset-0 flex items-center justify-center text-3xl z-20">
                                                    {item.emoji || '💬'}
                                                </div>
                                            )}
                                            {item.type === 'none' && (
                                                <div className="absolute inset-0 z-20">
                                                    <div className="w-full h-full border-2 border-red-500/40 rounded-full relative overflow-hidden">
                                                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500/40 rotate-45"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            {item.type === 'none' ? (
                                                <div className="absolute inset-0 z-20">
                                                    <div className="w-full h-full border-2 border-red-500/40 rounded-full relative overflow-hidden">
                                                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500/40 rotate-45"></div>
                                                    </div>
                                                </div>
                                            ) : item.src ? (
                                                <div className="absolute inset-0 z-20">
                                                    <Image
                                                        src={item.src}
                                                        alt={item.label}
                                                        fill
                                                        className="object-contain"
                                                        sizes="120px"
                                                        unoptimized
                                                    />
                                                </div>
                                            ) : item.color ? (
                                                <div className="absolute inset-0 z-20 flex items-center justify-center">
                                                    <div
                                                        style={{ backgroundColor: item.color }}
                                                        className={`w-2/3 h-2/3 shadow-lg ${cat.id === 'glasses' ? '' : 'rounded-full'}`}
                                                    />
                                                </div>
                                            ) : null}
                                        </>
                                    )}
                                </button>

                                {/* Custom Mixer Inline - Appears immediately after the Custom button when selected */}
                                {cat.id === 'background' && item.id === 'bg_custom' && selectedAttributes['background']?.id === 'bg_custom' && (
                                    <div className="flex-shrink-0 w-[200px] lg:w-[240px] h-[72px] lg:h-[72px] flex items-center gap-2 p-1.5 lg:p-2 bg-white/5 rounded-xl border border-cat-yellow/30 animate-in slide-in-from-left-2 fade-in duration-300 snap-start">
                                        <div className="flex flex-col gap-1 w-[45px] lg:w-[55px]">
                                            {['solid', 'linear', 'radial'].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => setCustomBackground(prev => ({ ...prev, type }))}
                                                    className={`text-[7px] lg:text-[8px] font-black py-1 rounded transition-colors uppercase ${customBackground.type === type ? 'bg-cat-yellow text-black shadow-lg shadow-cat-yellow/20' : 'bg-white/5 hover:bg-white/10 text-white/50'}`}
                                                >
                                                    {type.slice(0, 3)}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="w-px h-4/5 bg-white/10"></div>
                                        <div className="flex-1 flex gap-2 lg:gap-3 justify-center items-center">
                                            <div className="flex flex-col items-center gap-0.5">
                                                <input
                                                    type="color"
                                                    value={customBackground.color1}
                                                    onChange={(e) => setCustomBackground(prev => ({ ...prev, color1: e.target.value }))}
                                                    className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-transparent border-2 border-white/20 cursor-pointer overflow-hidden p-0"
                                                />
                                                <span className="text-[6px] lg:text-[7px] font-bold text-white/30 uppercase">Primary</span>
                                            </div>
                                            {customBackground.type !== 'solid' && (
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <input
                                                        type="color"
                                                        value={customBackground.color2}
                                                        onChange={(e) => setCustomBackground(prev => ({ ...prev, color2: e.target.value }))}
                                                        className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-transparent border-2 border-white/20 cursor-pointer overflow-hidden p-0"
                                                    />
                                                    <span className="text-[6px] lg:text-[7px] font-bold text-white/30 uppercase">Second</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    // Split categories for desktop wings with specific order
    const leftIds = ['background', 'border_color', 'border_style', 'border_width', 'speech', 'vibe', 'costume'];
    const rightIds = ['body', 'shirt', 'hat', 'eyes', 'glasses', 'mouth', 'chain'];

    const leftCategories = leftIds.map(id => attributesConfig.find(c => c.id === id)).filter(Boolean);
    const rightCategories = rightIds.map(id => attributesConfig.find(c => c.id === id)).filter(Boolean);

    return (
        <div className="flex flex-col h-[100dvh] bg-[#18181c] text-white overflow-hidden font-sans">

            {/* UNIFIED HEADER (Logo | Catcoin + Music) */}
            <header className="flex items-center justify-between px-4 py-2 lg:py-3 bg-[#18181c] border-b border-white/10 shrink-0 z-[100] w-full shadow-2xl">
                {/* Left: Logo | CATCOIN */}
                <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 lg:w-10 lg:h-10">
                        <Image
                            src="/assets/catcoin-logo.png"
                            alt="Logo"
                            fill
                            className="object-contain rounded-full border border-white/10"
                        />
                    </div>
                    <div className="w-px h-6 bg-white/20 mx-1 hidden xs:block" />
                    <span className="text-cat-yellow font-black tracking-tighter text-lg lg:text-2xl uppercase select-none">
                        CATCOIN | Cat-O-Matic
                    </span>
                </div>

                {/* Right: Music Player */}
                <div className="flex items-center gap-2 lg:gap-4 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/5 transition-all shadow-lg overflow-hidden max-w-[60%] sm:max-w-none">
                    <div className="flex items-center gap-1.5 lg:gap-3">
                        <button
                            onClick={skipBack}
                            className="text-white/30 hover:text-cat-yellow transition-colors"
                        >
                            <SkipBack size={14} fill="currentColor" />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center bg-cat-yellow text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shrink-0"
                        >
                            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                        </button>

                        <button
                            onClick={skipForward}
                            className="text-white/30 hover:text-cat-yellow transition-colors"
                        >
                            <SkipForward size={14} fill="currentColor" />
                        </button>
                    </div>

                    <div className="hidden sm:flex flex-col min-w-[100px] lg:min-w-[150px] max-w-[200px] border-l border-white/10 pl-3">
                        <div className="flex items-center gap-1.5 text-[8px] font-bold text-cat-yellow tracking-widest opacity-60 uppercase">
                            <Music size={8} />
                            Radio
                        </div>
                        <div className="text-[10px] lg:text-[11px] font-bold text-white truncate animate-pulse leading-none mt-0.5">
                            {songs[currentSongIndex].title}
                        </div>
                    </div>

                    <audio
                        ref={audioRef}
                        src={songs[currentSongIndex].src}
                        onEnded={skipForward}
                    />
                </div>
            </header>

            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                {/* LEFT WING (Desktop) */}
                <div className="hidden lg:block w-1/4 border-r border-white/10 bg-[#18181c]/50 backdrop-blur-sm z-10 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    {renderControls(leftCategories)}
                </div>

                {/* CENTER COLUMN (Preview + Mobile Controls) */}
                <div className="flex flex-col flex-1 overflow-hidden order-1 lg:order-2">
                    {/* Preview Stage */}
                    <div className="relative flex flex-col items-center justify-center p-4 lg:p-8 h-[45dvh] lg:h-full lg:flex-1 lg:pb-32 shrink-0 overflow-hidden">
                        <ScrollingBackground />

                        {/* Main Composition Area */}
                        <div
                            className={`relative w-auto h-[85%] lg:h-[95%] aspect-square bg-black shadow-2xl overflow-hidden group z-10 transition-all duration-300 ease-spring ${pfpShape === 'circle' ? 'rounded-full' : 'rounded-none'}`}
                            style={{
                                filter: selectedAttributes['vibe']?.value || 'none',
                                transform: 'translateZ(0)',
                                boxSizing: 'border-box',
                                border: (() => {
                                    const bColor = selectedAttributes['border_color'];
                                    const bStyle = selectedAttributes['border_style']?.value || 'solid';
                                    const bWidth = selectedAttributes['border_width']?.value || 10;
                                    if (bColor && bColor.type !== 'none' && bColor.color) {
                                        const s = ['double', 'dashed', 'dotted', 'groove', 'ridge', 'inset', 'outset'].includes(bStyle) ? bStyle : 'solid';
                                        return `${bWidth}px ${s} ${bColor.color}`;
                                    }
                                    return '1px solid rgba(255,255,255,0.15)';
                                })(),
                                boxShadow: (() => {
                                    const bColor = selectedAttributes['border_color'];
                                    const bStyle = selectedAttributes['border_style']?.value || 'solid';
                                    if (bColor && bColor.type !== 'none' && bColor.color && bStyle === 'neon') {
                                        return `0 0 20px ${bColor.color}, inset 0 0 20px ${bColor.color}`;
                                    }
                                    return 'none';
                                })()
                            }}
                        >
                            {/* Explosion Effect */}
                            {isExploding && (
                                <div className="absolute inset-0 z-[15] flex items-center justify-center pointer-events-none">
                                    <div className="w-full h-full bg-radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(250,210,5,0) 70%) animate-explode scale-150 rounded-full"></div>
                                    <div className="absolute w-1/2 h-1/2 bg-cat-yellow/50 rounded-full animate-explode delay-75"></div>
                                </div>
                            )}

                            {/* Layers */}
                            {attributesConfig.sort((a, b) => a.zIndex - b.zIndex).map(cat => {
                                const item = selectedAttributes[cat.id];
                                if (!item || (item.type === 'none' && !item.src)) return null;
                                const isAnimating = animatingLayer === cat.id || animatingLayer === 'all';
                                let animationClass = '';
                                if (isAnimating) {
                                    if (['shirt', 'body', 'costume'].includes(cat.id)) {
                                        const dir = cat.id === 'shirt' ? shirtDirection : (cat.id === 'costume' ? costumeDirection : bodyDirection);
                                        animationClass = dir === 'left' ? 'animate-fly-left' : 'animate-fly-right';
                                    }
                                    else if (cat.id === 'eyes') animationClass = 'animate-fade-in';
                                    else if (['hat'].includes(cat.id)) animationClass = 'animate-fly-down';
                                    else if (cat.id === 'mouth') animationClass = 'animate-pop-in';
                                    else animationClass = 'animate-zoom-in';
                                }
                                return (
                                    <div key={cat.id} className={`absolute inset-0 transition-transform duration-75 ${animationClass}`} style={{ zIndex: cat.zIndex }}>
                                        {cat.id === 'background' && (
                                            <div className="w-full h-full" style={{
                                                background: item.id === 'bg_custom' ? (
                                                    customBackground.type === 'solid' ? customBackground.color1 :
                                                        customBackground.type === 'linear' ? `linear-gradient(to bottom, ${customBackground.color1}, ${customBackground.color2})` :
                                                            `radial-gradient(circle at center, ${customBackground.color1}, ${customBackground.color2})`
                                                ) : (item.color || 'transparent')
                                            }} />
                                        )}

                                        {item.emoji && cat.id === 'speech' && (
                                            <div className={`absolute z-[95] animate-pop-in pointer-events-none transition-all duration-500`} style={{ top: pfpShape === 'circle' ? '50%' : '52%', right: pfpShape === 'circle' ? '12%' : '8%' }}>
                                                <div className="relative bg-white text-black w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl shadow-2xl border-2 border-black text-xl lg:text-2xl">
                                                    {item.emoji}
                                                    <div className="absolute bottom-[-8px] left-[10%] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
                                                    <div className="absolute bottom-[-11px] left-[10%] w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[9px] border-t-black -z-10"></div>
                                                </div>
                                            </div>
                                        )}
                                        {item.src && (
                                            <div className="w-full h-full relative pointer-events-none">
                                                <Image src={item.src} alt={`${cat.id}-${item.label}`} fill className="object-contain" sizes="(max-width: 768px) 100vw, 512px" priority={cat.id === 'shirt'} unoptimized />
                                            </div>
                                        )}
                                        {item.color && !['background', 'border', 'border_color'].includes(cat.id) && !item.src && (
                                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: item.color, width: `${300 - (cat.zIndex > 20 ? cat.zIndex - 20 : 0) * 2}px`, height: `${300 - (cat.zIndex > 20 ? cat.zIndex - 20 : 0) * 2}px`, borderRadius: cat.id === 'glasses' ? '0' : '20px' }} />
                                        )}
                                    </div>
                                );
                            })}
                            <canvas ref={canvasRef} width={512} height={512} className="hidden" />
                        </div>

                        {/* Desktop Action Bar */}
                        <div className="hidden lg:flex fixed bottom-8 left-1/2 -translate-x-1/2 gap-4 bg-[#18181c]/80 p-2 pr-2 pl-4 rounded-full border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl z-50 hover:bg-[#18181c]/90 transition-all">
                            <button onClick={randomize} className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full text-cat-yellow transition-all hover:scale-105 active:scale-95 group" title="Shuffle">
                                <Shuffle size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                                <span className="font-bold text-sm tracking-wide">SHUFFLE</span>
                            </button>
                            <button onClick={handleClear} className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all hover:scale-105 active:scale-95 group" title="Clear All">
                                <Trash2 size={20} className="group-hover:rotate-12 transition-transform" />
                                <span className="font-bold text-sm tracking-wide">CLEAR</span>
                            </button>
                            <div className="w-px bg-white/10 my-2 self-stretch"></div>
                            <button onClick={() => setPfpShape(prev => prev === 'circle' ? 'square' : 'circle')} className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-full text-white transition-all hover:scale-105 active:scale-95 group" title="Toggle Shape">
                                <div className={`w-5 h-5 border-2 border-current transition-all duration-300 ${pfpShape === 'circle' ? 'rounded-full' : 'rounded-md'}`}></div>
                            </button>
                            <div className="w-px bg-white/10 my-2 self-stretch"></div>
                            <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full text-white transition-all hover:scale-105 active:scale-95 group" title="Copy">
                                {showCopyCheck ? (
                                    <Check size={20} className="text-green-500 animate-in zoom-in duration-300" />
                                ) : (
                                    <Copy size={20} className="group-hover:-rotate-12 transition-transform" />
                                )}
                                <span className={`font-bold text-sm tracking-wide ${showCopyCheck ? 'text-green-500' : ''}`}>
                                    {showCopyCheck ? 'COPIED' : 'COPY'}
                                </span>
                            </button>
                            <button onClick={handleDownload} className="flex items-center gap-2 px-6 py-2 bg-cat-yellow text-black rounded-full hover:bg-[#fff04b] transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(250,210,5,0.2)] ml-2" title="Save">
                                <Download size={20} />
                                <span className="font-black text-sm tracking-wide">SAVE PNG</span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Controls (Visible only on mobile) */}
                    <div className="lg:hidden flex-1 overflow-y-auto pb-28 border-t border-white/10 bg-[#18181c]/50">
                        {renderControls(attributesConfig)}
                    </div>
                </div>

                {/* RIGHT WING (Desktop) */}
                <div className="hidden lg:block w-1/4 border-l border-white/10 bg-[#18181c]/50 backdrop-blur-sm z-10 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden order-3">
                    {renderControls(rightCategories)}
                </div>

                {/* Mobile Sticky Action Bar */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[999] bg-[#18181c] border-t border-white/10 px-2 pt-2 pb-3 flex justify-between gap-1 safe-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.5)] min-h-[70px] pointer-events-auto">
                    <button onClick={randomize} className="flex flex-col items-center justify-center py-2 px-1 flex-1 bg-white/5 border border-white/10 rounded-xl active:scale-90 transition-transform touch-manipulation">
                        <Shuffle size={16} className="text-cat-yellow mb-1" />
                        <span className="text-[9px] font-bold text-white/80 uppercase tracking-tighter">Shuffle</span>
                    </button>
                    <button onClick={() => setPfpShape(prev => prev === 'circle' ? 'square' : 'circle')} className="flex flex-col items-center justify-center py-2 px-1 flex-1 bg-white/5 border border-white/10 rounded-xl active:scale-90 transition-transform touch-manipulation">
                        <div className={`w-3.5 h-3.5 border-2 border-white mb-1.5 transition-all duration-300 ${pfpShape === 'circle' ? 'rounded-full' : 'rounded-sm'}`}></div>
                        <span className="text-[9px] font-bold text-white/80 uppercase tracking-tighter">Shape</span>
                    </button>
                    <button onClick={handleCopy} className="flex flex-col items-center justify-center py-2 px-1 flex-1 bg-white/5 border border-white/10 rounded-xl active:scale-90 transition-transform touch-manipulation">
                        {showCopyCheck ? (
                            <Check size={16} className="text-green-500 animate-in zoom-in duration-300 mb-1" />
                        ) : (
                            <Copy size={16} className="text-white/60 mb-1" />
                        )}
                        <span className={`text-[9px] font-bold uppercase tracking-tighter ${showCopyCheck ? 'text-green-500' : 'text-white/80'}`}>
                            {showCopyCheck ? 'Copied' : 'Copy'}
                        </span>
                    </button>
                    <button onClick={handleClear} className="flex flex-col items-center justify-center py-2 px-1 flex-1 bg-white/5 border border-white/10 rounded-xl active:scale-90 transition-transform touch-manipulation">
                        <Trash2 size={16} className="text-white/40 mb-1" />
                        <span className="text-[9px] font-bold text-white/80 uppercase tracking-tighter">Clear</span>
                    </button>
                    <button onClick={handleDownload} className="flex flex-col items-center justify-center py-2 px-1 flex-[1.4] bg-cat-yellow text-black rounded-xl active:scale-90 shadow-lg shadow-cat-yellow/20 transition-transform font-black text-[10px] uppercase touch-manipulation">
                        <Download size={20} className="mb-0.5" />
                        SAVE
                    </button>
                </div>
            </div>

            {/* SVG Filters for Vibes */}
            <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
                <filter id="pixelate" x="0" y="0" width="100%" height="100%">
                    <feFlood x="4" y="4" height="2" width="2" />
                    <feComposite width="8" height="8" />
                    <feTile result="a" />
                    <feComposite in="SourceGraphic" in2="a" operator="in" />
                    <feMorphology operator="dilate" radius="3" />
                </filter>
                <filter id="pixelate-highres" x="0" y="0" width="100%" height="100%">
                    <feFlood x="12" y="12" height="6" width="6" />
                    <feComposite width="24" height="24" />
                    <feTile result="a" />
                    <feComposite in="SourceGraphic" in2="a" operator="in" />
                    <feMorphology operator="dilate" radius="10" />
                </filter>
            </svg>
        </div>
    );
}
