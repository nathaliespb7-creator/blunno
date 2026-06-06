'use client';

import type { LucideIcon } from 'lucide-react';
import type { ReactElement } from 'react';

import { GlassCellDecor } from '@/components/shared/make-v81/GlassCellDecor';
import { cn } from '@/lib/utils';

type GlassIconButtonProps = {
  href?: string;
  onClick?: () => void;
  icon: LucideIcon;
  label: string;
  className?: string;
};

export function GlassIconButton({ href, onClick, icon: Icon, label, className }: GlassIconButtonProps): ReactElement {
  const classes = cn('v81-glass-icon-btn blunno-focus-visible', className);

  const inner = (
    <>
      <GlassCellDecor />
      <Icon className="relative z-10 h-[18px] w-[18px] text-white/85" strokeWidth={2} />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        aria-label={label}
        className={classes}
        onClick={() => {
          // #region agent log
          fetch('http://127.0.0.1:7876/ingest/c382d466-b827-4be9-8387-43085e568544',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'127c83'},body:JSON.stringify({sessionId:'127c83',location:'GlassIconButton.tsx:click',message:'nav via href',data:{href,label,t:performance.now()},timestamp:Date.now(),hypothesisId:'B',runId:'post-fix'})}).catch(()=>{});
          // #endregion
          onClick?.();
        }}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={label} className={classes}>
      {inner}
    </button>
  );
}
