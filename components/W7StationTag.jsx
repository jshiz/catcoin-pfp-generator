import React from 'react';

/**
 * Small "Built by Waldo7Labs" credit. The W7 mark is a mask filled with
 * currentColor, so it takes the text color and turns cat-yellow on hover.
 * The bottom padding keeps it clear of the fixed toolbars.
 */
export const W7StationTag = () => {
  return (
    <div className="flex justify-center shrink-0 pt-2 pb-[88px] lg:pt-1 lg:pb-1.5">
      <a
        href="https://waldo7labs.com"
        target="_blank"
        rel="noopener"
        title="Built by Waldo7Labs | Custom Web Design"
        className="group inline-flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-wide text-white/55 hover:text-cat-yellow transition-colors duration-300"
      >
        <span
          aria-hidden="true"
          className="block h-3 w-6 bg-current"
          style={{
            WebkitMaskImage: 'url(/branding/waldo7labs-tag.webp)',
            maskImage: 'url(/branding/waldo7labs-tag.webp)',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
          }}
        />
        <span>Built by Waldo7Labs</span>
      </a>
    </div>
  );
};
