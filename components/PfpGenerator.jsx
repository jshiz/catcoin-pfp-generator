'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { attributesConfig } from '@/data/attributes';
import ScrollingBackground from './ScrollingBackground';
import { Download, Share2, Copy, Shuffle, Camera } from 'lucide-react';

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
    const [customBackground, setCustomBackground] = useState({
        color1: '#7c3aed',
        color2: '#1e3a8a',
        type: 'linear', // 'solid', 'linear', 'radial'
    });

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

            // Draw Speech Bubbles
            if (cat.id === 'speech' && item.text) {
                ctx.save();
                ctx.font = 'bold 32px Arial';
                const textWidth = ctx.measureText(item.text).width;
                const bubbleW = textWidth + 40;
                const bubbleH = 60;
                const bx = 460 - bubbleW;
                const by = 50;

                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 3;

                ctx.beginPath();
                ctx.roundRect(bx, by, bubbleW, bubbleH, 20);
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(bx + bubbleW * 0.3, by + bubbleH);
                ctx.lineTo(bx + bubbleW * 0.25, by + bubbleH + 15);
                ctx.lineTo(bx + bubbleW * 0.4, by + bubbleH);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(item.text, bx + bubbleW / 2, by + bubbleH / 2 + 2);
                ctx.restore();
            }
        }
        ctx.restore(); // Restore scale
    };

    const handleDownload = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Temporarily resize canvas to High Res for export
        const originalWidth = canvas.width;
        const originalHeight = canvas.height;
        canvas.width = 2048;
        canvas.height = 2048;

        const ctx = canvas.getContext('2d');
        // Reset and Draw
        // ctx.restore(); // Be careful with restore if stack empty
        // Best to just clean slate
        ctx.globalCompositeOperation = 'source-over';

        await drawToCanvas(ctx);

        const link = document.createElement('a');
        link.download = `catcoin-pfp-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0); // Max quality
        link.click();

        // Restore low-res (hidden) canvas size? 
        // Actually, kept hidden so size doesn't matter much for DOM flow, 
        // but 2048 might use memory. 
        // We can revert if needed.
        canvas.width = 512;
        canvas.height = 512;
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
                    .then(() => alert('Copied to clipboard!'))
                    .catch(err => console.error('Copy failed', err));
                // Restore size
                canvas.width = 512;
                canvas.height = 512;
            }
        });
    };

    // Render Control Wing
    const renderControls = (categories) => (
        <div className="flex flex-col gap-1 p-2 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {categories.map(cat => (
                <div key={cat.id} className="space-y-1">
                    <h3 className="text-cat-yellow font-bold uppercase tracking-wider text-[10px] md:text-xs">{cat.label}</h3>
                    {/* Updated density: 8 columns per row for smaller buttons */}
                    <div className="grid grid-cols-8 gap-1">

                        {/* Render actual items, filtering out hidden ones */}
                        {cat.items.filter(i => !i.hidden).map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleAttributeSelect(cat.id, item)}
                                className={`
                  aspect-square border transition-all hover:scale-110 active:scale-95 relative overflow-hidden rounded-md group
                  ${selectedAttributes[cat.id]?.id === item.id
                                        ? 'border-cat-yellow shadow-[0_0_8px_#fad205] z-10'
                                        : 'border-white/10 hover:border-white/30'}
                `}
                                title={item.label}
                            >
                                {/* BASE LAYER */}
                                {cat.id === 'background' || cat.id === 'speech' ? (
                                    // For background/speech: No cat base
                                    <div
                                        className="absolute inset-0"
                                        style={{ background: item.color || '#2a2a2e' }}
                                    />
                                ) : (
                                    // For others (and costume now): Basic Cat is Base
                                    <div className="absolute inset-0 bg-[#2a2a2e]">
                                        <Image
                                            src="/assets/body/basic.png"
                                            alt="Base"
                                            fill
                                            className="object-contain opacity-50 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0"
                                            sizes="100px"
                                        />
                                    </div>
                                )}

                                {/* OVERLAY LAYER (The Item) */}
                                {cat.id === 'background' ? (
                                    item.type === 'custom' ? (
                                        <div className="absolute inset-0 flex items-center justify-center text-xl z-20">
                                            🎨
                                        </div>
                                    ) : (
                                        // For background: Basic Cat is Top (to show contrast)
                                        <div className="absolute inset-0 pointer-events-none">
                                            <Image
                                                src="/assets/body/basic.png"
                                                alt="Cat Preview"
                                                fill
                                                className="object-contain"
                                                sizes="100px"
                                            />
                                        </div>
                                    )
                                ) : (cat.id.startsWith('border') || cat.id === 'vibe' || cat.id === 'speech') ? (
                                    // Border Control Previews
                                    <div className="absolute inset-0">
                                        {cat.id === 'border_color' && item.color && (
                                            <div className="w-full h-full rounded border-4" style={{ borderColor: item.color }} />
                                        )}
                                        {cat.id === 'border_style' && (
                                            <div className="w-full h-full rounded border-white"
                                                style={{
                                                    border: (() => {
                                                        const s = item.value;
                                                        if (['double', 'dashed', 'dotted', 'groove', 'ridge', 'inset', 'outset'].includes(s)) {
                                                            return `3px ${s} #fff`;
                                                        }
                                                        return '3px solid #fff';
                                                    })(),
                                                    boxShadow: item.value === 'neon' ? '0 0 5px #fff, inset 0 0 3px #fff' : 'none',
                                                    backgroundColor: 'transparent',
                                                }}
                                            >
                                            </div>
                                        )}
                                        {cat.id === 'border_width' && (
                                            <div className="w-full h-full border-white/80"
                                                style={{
                                                    borderWidth: Math.max(1, item.value / 3) + 'px',
                                                    borderStyle: 'solid'
                                                }}
                                            />
                                        )}
                                        {cat.id === 'vibe' && item.type !== 'none' && (
                                            <div className="absolute inset-0 z-20">
                                                <div className="absolute inset-0 bg-black/20 z-10" />
                                                <Image
                                                    src="/assets/body/basic.png"
                                                    alt={item.label}
                                                    fill
                                                    style={{ filter: item.value }}
                                                    className="object-contain"
                                                    sizes="100px"
                                                />
                                                <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] font-bold py-0.5 z-20">
                                                    {item.label}
                                                </div>
                                            </div>
                                        )}
                                        {cat.id === 'speech' && item.type !== 'none' && (
                                            <div className="absolute inset-0 flex items-center justify-center text-xl z-20">
                                                {item.emoji || '💬'}
                                            </div>
                                        )}
                                        {item.type === 'none' && (
                                            <div className="absolute inset-0 z-20 opacity-70">
                                                <div className="absolute inset-0 border-[2px] border-red-500/50"></div>
                                                <div className="absolute top-0 left-0 w-full h-full border-t-[2px] border-red-500/50 origin-top-left rotate-45 scale-[1.45]"></div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // For others: Item is Top
                                    <>
                                        {item.type === 'none' ? (
                                            <div className="absolute inset-0 z-20 opacity-70">
                                                <div className="absolute inset-0 border-[2px] border-red-500/50"></div>
                                                <div className="absolute top-0 left-0 w-full h-full border-t-[2px] border-red-500/50 origin-top-left rotate-45 scale-[1.45]"></div>
                                            </div>
                                        ) : item.src ? (
                                            <div className="absolute inset-0 z-20">
                                                <Image
                                                    src={item.src}
                                                    alt={item.label}
                                                    fill
                                                    className="object-contain"
                                                    sizes="100px"
                                                />
                                            </div>
                                        ) : item.color ? (
                                            // Color shapes layer
                                            <div className="absolute inset-0 z-20 flex items-center justify-center">
                                                <div
                                                    style={{ backgroundColor: item.color }}
                                                    className={`w-3/4 h-3/4 shadow-sm ${cat.id === 'glasses' ? '' : 'rounded-full'}`}
                                                />
                                                {item.text && <span className="absolute text-white text-[8px] bottom-1 right-1 font-bold">{item.text}</span>}
                                            </div>
                                        ) : null}
                                    </>
                                )}
                            </button>
                        ))}

                        {/* Redesigned Mixer UI */}
                        {cat.id === 'background' && selectedAttributes['background']?.id === 'bg_custom' && (
                            <div className="col-span-8 md:col-span-4 flex flex-col gap-1 p-1.5 bg-white/5 rounded-md border border-white/10 animate-fade-in">
                                <div className="flex bg-black/40 rounded-sm p-0.5 gap-0.5">
                                    <button
                                        onClick={() => setCustomBackground(prev => ({ ...prev, type: 'solid' }))}
                                        className={`flex-1 text-[8px] font-bold py-1 rounded-sm transition-colors ${customBackground.type === 'solid' ? 'bg-cat-yellow text-black' : 'hover:bg-white/5 text-white/50'}`}
                                    >
                                        SOLID
                                    </button>
                                    <button
                                        onClick={() => setCustomBackground(prev => ({ ...prev, type: 'linear' }))}
                                        className={`flex-1 text-[8px] font-bold py-1 rounded-sm transition-colors ${customBackground.type === 'linear' ? 'bg-cat-yellow text-black' : 'hover:bg-white/5 text-white/50'}`}
                                    >
                                        LIN
                                    </button>
                                    <button
                                        onClick={() => setCustomBackground(prev => ({ ...prev, type: 'radial' }))}
                                        className={`flex-1 text-[8px] font-bold py-1 rounded-sm transition-colors ${customBackground.type === 'radial' ? 'bg-cat-yellow text-black' : 'hover:bg-white/5 text-white/50'}`}
                                    >
                                        RAD
                                    </button>
                                </div>
                                <div className="flex justify-center items-center gap-3 py-1">
                                    <div className="relative group/swatch">
                                        <input
                                            type="color"
                                            value={customBackground.color1}
                                            onChange={(e) => setCustomBackground(prev => ({ ...prev, color1: e.target.value }))}
                                            className="w-7 h-7 rounded-full bg-transparent border-2 border-white/20 cursor-pointer overflow-hidden p-0"
                                            style={{ color: 'transparent' }}
                                        />
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[6px] font-bold text-white/40 opacity-0 group-hover/swatch:opacity-100 uppercase">A</div>
                                    </div>

                                    {customBackground.type !== 'solid' && (
                                        <div className="relative group/swatch">
                                            <input
                                                type="color"
                                                value={customBackground.color2}
                                                onChange={(e) => setCustomBackground(prev => ({ ...prev, color2: e.target.value }))}
                                                className="w-7 h-7 rounded-full bg-transparent border-2 border-white/20 cursor-pointer overflow-hidden p-0"
                                            />
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[6px] font-bold text-white/40 opacity-0 group-hover/swatch:opacity-100 uppercase">B</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    // Split categories for desktop wings with specific order
    const leftIds = ['background', 'border_color', 'border_style', 'border_width', 'speech', 'vibe'];
    const rightIds = ['body', 'shirt', 'hat', 'eyes', 'glasses', 'mouth', 'chain', 'costume'];

    const leftCategories = leftIds.map(id => attributesConfig.find(c => c.id === id)).filter(Boolean);
    const rightCategories = rightIds.map(id => attributesConfig.find(c => c.id === id)).filter(Boolean);

    return (
        <div className="flex flex-col lg:flex-row h-[100dvh] bg-[#18181c] text-white overflow-hidden font-sans">

            {/* Mobile Header */}
            <div className="lg:hidden p-4 text-center text-cat-yellow font-bold text-xl border-b border-white/10 shrink-0 z-20 bg-[#18181c]">
                CAT-O-MATIC
            </div>

            {/* LEFT WING (Desktop) */}
            <div className="hidden lg:block w-1/4 border-r border-white/10 bg-[#18181c]/50 backdrop-blur-sm z-10 order-1 h-full overflow-hidden">
                {renderControls(leftCategories)}
            </div>

            {/* CENTER STAGE */}
            <div className="relative flex flex-col items-center justify-center p-2 lg:p-10 order-1 lg:order-2 shrink-0 lg:flex-1 h-[35dvh] lg:h-auto border-b border-white/10 lg:border-none overflow-hidden">
                <ScrollingBackground />

                {/* Main Composition Area */}
                {/* Main Composition Area */}
                <div
                    className={`relative w-auto h-[85%] aspect-square bg-black shadow-2xl overflow-hidden border-4 border-white/10 group z-10 transition-all duration-300 ease-spring ${pfpShape === 'circle' ? 'rounded-full' : 'rounded-none'}`}
                    style={{
                        filter: selectedAttributes['vibe']?.value || 'none'
                    }}
                >



                    {/* Explosion Effect Layer (Behind everything but background? Or just behind costume?) 
                        Background is zIndex 10. We want this visible. zIndex 15.
                    */}
                    {isExploding && (
                        <div className="absolute inset-0 z-[15] flex items-center justify-center pointer-events-none">
                            <div className="w-full h-full bg-radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(250,210,5,0) 70%) animate-explode scale-150 rounded-full"></div>
                            {/* Inner Burst */}
                            <div className="absolute w-1/2 h-1/2 bg-cat-yellow/50 rounded-full animate-explode delay-75"></div>
                        </div>
                    )}

                    {/* Layers */}
                    {attributesConfig.sort((a, b) => a.zIndex - b.zIndex).map(cat => {
                        const item = selectedAttributes[cat.id];
                        if (!item || (item.type === 'none' && !item.src)) return null;

                        const isAnimating = animatingLayer === cat.id || animatingLayer === 'all';

                        // Determine animation class based on category
                        let animationClass = '';
                        if (isAnimating) {
                            if (['shirt', 'body', 'costume'].includes(cat.id)) {
                                const dir = cat.id === 'shirt' ? shirtDirection : (cat.id === 'costume' ? costumeDirection : bodyDirection);
                                animationClass = dir === 'left' ? 'animate-fly-left' : 'animate-fly-right';
                            }
                            else if (cat.id === 'eyes') animationClass = 'animate-fade-in';
                            else if (['hat'].includes(cat.id)) animationClass = 'animate-fly-down';
                            else if (cat.id === 'mouth') animationClass = 'animate-pop-in';
                            else animationClass = 'animate-zoom-in'; // default for border, glasses, chain
                        }

                        return (
                            <div
                                key={cat.id}
                                className={`absolute inset-0 transition-transform duration-75 ${animationClass}`}
                                style={{ zIndex: cat.zIndex }}
                            >
                                {/* Background Layer (Color) */}
                                {cat.id === 'background' && (
                                    <div className="w-full h-full" style={{
                                        background: item.id === 'bg_custom' ? (
                                            customBackground.type === 'solid' ? customBackground.color1 :
                                                customBackground.type === 'linear' ? `linear-gradient(to bottom, ${customBackground.color1}, ${customBackground.color2})` :
                                                    `radial-gradient(circle at center, ${customBackground.color1}, ${customBackground.color2})`
                                        ) : (item.color || 'transparent')
                                    }} />
                                )}

                                {/* Border Layer (Shape) */}
                                {cat.id === 'border_color' && item.color && (
                                    <div
                                        className={`absolute inset-0 pointer-events-none transition-all duration-300 ${pfpShape === 'circle' ? 'rounded-full' : 'rounded-none'}`}
                                        style={{
                                            border: (() => {
                                                const s = selectedAttributes['border_style']?.value || 'solid';
                                                const w = (selectedAttributes['border_width']?.value || 10) + 'px';
                                                const c = item.color;
                                                // Map to CSS
                                                if (['double', 'dashed', 'dotted', 'groove', 'ridge', 'inset', 'outset'].includes(s)) {
                                                    return `${s} ${w} ${c}`;
                                                }
                                                // Fallback
                                                return `solid ${w} ${c}`;
                                            })(),
                                            boxShadow: selectedAttributes['border_style']?.value === 'neon' ? `0 0 20px ${item.color}, inset 0 0 20px ${item.color}` : 'none'
                                        }}
                                    >
                                        {/* Overlay for patterns not supported natively by CSS border-style (like wave, jagged) - using SVG or masks would be better but CSS 'dashed' is a decent fallback for now if we don't assume SVG assets. 
                                            If 'jagged' is selected, we can try a clip-path or background-image hack, 
                                            but to keep it working comfortably:
                                        */}
                                    </div>
                                )}

                                {item.text && cat.id === 'speech' && (
                                    <div
                                        className={`absolute z-[95] animate-pop-in pointer-events-none transition-all duration-500`}
                                        style={{
                                            top: pfpShape === 'circle' ? '35%' : '10%',
                                            right: pfpShape === 'circle' ? '15%' : '10%',
                                        }}
                                    >
                                        <div className="relative bg-white text-black px-4 py-2 rounded-2xl shadow-xl border-2 border-black font-bold text-lg whitespace-nowrap min-w-[80px] text-center">
                                            {item.text}
                                            {/* Pointer */}
                                            <div className="absolute bottom-[-10px] left-[20%] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white"></div>
                                            <div className="absolute bottom-[-13px] left-[20%] w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[11px] border-t-black -z-10"></div>
                                        </div>
                                    </div>
                                )}
                                {item.src && (
                                    <div className="w-full h-full relative pointer-events-none">
                                        <Image
                                            src={item.src}
                                            alt={`${cat.id}-${item.label}`}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 100vw, 512px"
                                            priority={cat.id === 'shirt'} // Prioritize Shirt loading
                                            unoptimized
                                        />
                                    </div>
                                )}

                                {/* Placeholder Shapes (Legacy Colors) */}
                                {item.color && !['background', 'border', 'border_color'].includes(cat.id) && !item.src && (
                                    // Centered layered rects for accessories
                                    <div
                                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                        style={{
                                            backgroundColor: item.color,
                                            width: `${300 - (cat.zIndex > 20 ? cat.zIndex - 20 : 0) * 2}px`,
                                            height: `${300 - (cat.zIndex > 20 ? cat.zIndex - 20 : 0) * 2}px`,
                                            borderRadius: cat.id === 'glasses' ? '0' : '20px'
                                        }}
                                    />
                                )}


                            </div>
                        );
                    })}

                    {/* Hidden Canvas for Compositing */}
                    <canvas ref={canvasRef} width={512} height={512} className="hidden" />

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

                {/* Desktop Action Bar (Fixed Bottom Pill) */}
                <div className="hidden lg:flex fixed bottom-8 left-1/2 -translate-x-1/2 gap-4 bg-[#18181c]/80 p-2 pr-2 pl-4 rounded-full border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl z-50 hover:bg-[#18181c]/90 transition-all">
                    <button
                        onClick={randomize}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full text-cat-yellow transition-all hover:scale-105 active:scale-95 group"
                        title="Randomize Attributes"
                    >
                        <Shuffle size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        <span className="font-bold text-sm tracking-wide">SHUFFLE</span>
                    </button>

                    {/* Shape Toggle */}
                    <button
                        onClick={() => setPfpShape(prev => prev === 'circle' ? 'square' : 'circle')}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-full text-white transition-all hover:scale-105 active:scale-95 group"
                        title="Toggle Shape"
                    >
                        <div className={`w-5 h-5 border-2 border-current transition-all duration-300 ${pfpShape === 'circle' ? 'rounded-full' : 'rounded-md'}`}></div>
                    </button>

                    <div className="w-px bg-white/10 my-2 self-stretch"></div>

                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full text-white transition-all hover:scale-105 active:scale-95 group"
                        title="Copy Image to Clipboard"
                    >
                        <Copy size={20} className="group-hover:-rotate-12 transition-transform" />
                        <span className="font-bold text-sm tracking-wide">COPY</span>
                    </button>

                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-6 py-2 bg-cat-yellow text-black rounded-full hover:bg-[#fff04b] transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(250,210,5,0.2)] ml-2"
                        title="Download Transparent PNG"
                    >
                        <Download size={20} />
                        <span className="font-black text-sm tracking-wide">SAVE PNG</span>
                    </button>
                </div>
            </div>

            {/* RIGHT WING (Desktop) */}
            <div className="hidden lg:block w-1/4 border-l border-white/10 bg-[#18181c]/50 backdrop-blur-sm z-10 order-3 h-full overflow-hidden">
                {renderControls(rightCategories)}
            </div>

            {/* Mobile Controls Container (Scrollable) */}
            <div className="lg:hidden w-full order-3 flex-1 overflow-y-auto bg-[#18181c] px-4 pt-2 pb-24 border-t border-white/10">
                {renderControls(attributesConfig)}
            </div>

            {/* Mobile Sticky Action Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#18181c]/95 backdrop-blur-xl border-t border-white/10 p-3 flex justify-between gap-3 safe-bottom pb-6">
                <button
                    onClick={randomize}
                    className="flex flex-col items-center justify-center p-2 flex-1 bg-white/5 border border-white/10 rounded-lg active:scale-95 transition-transform"
                >
                    <Shuffle size={20} className="text-cat-yellow mb-1" />
                    <span className="text-[10px] font-bold text-white/80">SHUFFLE</span>
                </button>

                <button
                    onClick={() => setPfpShape(prev => prev === 'circle' ? 'square' : 'circle')}
                    className="flex flex-col items-center justify-center p-2 flex-1 bg-white/5 border border-white/10 rounded-lg active:scale-95 transition-transform"
                >
                    <div className={`w-5 h-5 border-2 border-white mb-1 transition-all duration-300 ${pfpShape === 'circle' ? 'rounded-full' : 'rounded-md'}`}></div>
                    <span className="text-[10px] font-bold text-white/80">SHAPE</span>
                </button>

                <button
                    onClick={handleCopy}
                    className="flex flex-col items-center justify-center p-2 flex-1 bg-white/5 border border-white/10 rounded-lg active:scale-95 transition-transform"
                >
                    <Copy size={20} className="text-cat-yellow mb-1" />
                    <span className="text-[10px] font-bold text-white/80">COPY</span>
                </button>

                <button
                    onClick={handleDownload}
                    className="flex flex-col items-center justify-center p-2 flex-[1.5] bg-cat-yellow text-black rounded-lg active:scale-95 shadow-[0_0_15px_rgba(250,210,5,0.3)] transition-transform"
                >
                    <Download size={22} className="mb-1" />
                    <span className="text-[10px] font-black">SAVE PNG</span>
                </button>
            </div >

        </div >
    );
}
