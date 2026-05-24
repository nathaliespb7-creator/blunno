'use client';

import type { LucideIcon } from 'lucide-react';
import type { CSSProperties, ReactElement, ReactNode } from 'react';

import { GlassCellDecor } from '@/components/shared/make-v81/GlassCellDecor';
import { cn } from '@/lib/utils';

type GlassListCellBaseProps = {
  accentColor: string;
  className?: string;
  style?: CSSProperties;
  animationDelay?: string;
  showAccentBar?: boolean;
  opacity?: number;
  footer?: ReactNode;
  'data-testid'?: string;
};

type GlassListCellContentProps = GlassListCellBaseProps & {
  title: string;
  subtitle?: string;
  subtitleVariant?: 'category' | 'description';
  icon?: LucideIcon;
  trailing?: ReactNode;
  titleAs?: 'h3' | 'span';
  children?: never;
};

type GlassListCellCustomProps = GlassListCellBaseProps & {
  children: ReactNode;
  title?: never;
  subtitle?: never;
  subtitleVariant?: never;
  icon?: never;
  trailing?: never;
  titleAs?: never;
};

type GlassListCellButtonProps = (GlassListCellContentProps | GlassListCellCustomProps) & {
  as?: 'button';
  onClick: () => void;
  'aria-label': string;
};

type GlassListCellDivProps = (GlassListCellContentProps | GlassListCellCustomProps) & {
  as: 'div';
  onClick?: never;
  'aria-label'?: string;
};

type GlassListCellAnchorProps = (GlassListCellContentProps | GlassListCellCustomProps) & {
  as: 'a';
  href: string;
  onClick?: () => void;
  'aria-label': string;
};

export type GlassListCellProps =
  | GlassListCellButtonProps
  | GlassListCellDivProps
  | GlassListCellAnchorProps;

function AccentBar({ color }: { color: string }): ReactElement {
  return (
    <div
      className="v81-glass-cell-accent"
      style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      aria-hidden
    />
  );
}

function IconBox({ icon: Icon, color }: { icon: LucideIcon; color: string }): ReactElement {
  return (
    <div
      className="v81-glass-cell-icon"
      style={{
        background: `linear-gradient(135deg, ${color}40 0%, ${color}10 100%)`,
        borderColor: `${color}40`,
        boxShadow: `0 6px 18px -6px ${color}60, inset 0 0 12px ${color}20`,
      }}
    >
      <Icon className="h-5 w-5" style={{ color }} strokeWidth={1.5} />
    </div>
  );
}

export function GlassListCell(props: GlassListCellProps): ReactElement {
  const {
    accentColor,
    className,
    style,
    animationDelay,
    showAccentBar = true,
    opacity = 1,
    footer,
    'data-testid': dataTestId,
  } = props;

  const cellStyle = {
    ...style,
    '--v81-cell-border': accentColor,
    animationDelay,
    opacity,
  } as CSSProperties;

  const inner = (
    <>
      <GlassCellDecor borderColor={accentColor} />
      {showAccentBar && <AccentBar color={accentColor} />}
      <div className="v81-glass-cell-body">
        <div className="v81-glass-cell-row">
          {'children' in props && props.children ? (
            props.children
          ) : (
            <>
              {props.icon && <IconBox icon={props.icon} color={accentColor} />}
              <div className="v81-glass-cell-text">
                {props.titleAs === 'h3' ? (
                  <h3 className="v81-glass-cell-title">{props.title}</h3>
                ) : (
                  <span className="v81-glass-cell-title">{props.title}</span>
                )}
                {props.subtitle &&
                  (props.subtitleVariant === 'category' ? (
                    <span
                      className="v81-glass-cell-subtitle v81-glass-cell-subtitle--category"
                      style={{ color: accentColor }}
                    >
                      {props.subtitle}
                    </span>
                  ) : (
                    <span className="v81-glass-cell-subtitle v81-glass-cell-subtitle--description">{props.subtitle}</span>
                  ))}
              </div>
              {props.trailing}
            </>
          )}
        </div>
        {footer && <div className="v81-glass-cell-footer">{footer}</div>}
      </div>
    </>
  );

  const classes = cn('v81-glass-cell blunno-focus-visible', className);

  if (props.as === 'div') {
    return (
      <div className={classes} style={cellStyle} data-testid={dataTestId}>
        {inner}
      </div>
    );
  }

  if (props.as === 'a') {
    return (
      <a
        href={props.href}
        className={classes}
        style={cellStyle}
        onClick={props.onClick}
        aria-label={props['aria-label']}
        data-testid={dataTestId}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      style={cellStyle}
      onClick={props.onClick}
      aria-label={props['aria-label']}
      data-testid={dataTestId}
    >
      {inner}
    </button>
  );
}

type GlassListCellActionProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  accentColor: string;
  active?: boolean;
  filled?: boolean;
};

export function GlassListCellAction({
  icon: Icon,
  label,
  onClick,
  accentColor,
  active = false,
  filled = false,
}: GlassListCellActionProps): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="v81-glass-cell-action blunno-focus-visible"
      style={{
        background: active ? accentColor : 'rgba(18,12,48,0.5)',
        borderColor: accentColor,
        boxShadow: active ? `0 0 12px ${accentColor}` : 'none',
      }}
    >
      <Icon
        className={cn('h-4 w-4', active ? 'text-[#120F25]' : 'text-white/85')}
        strokeWidth={2}
        fill={filled && !active ? 'rgba(255,255,255,0.85)' : filled && active ? accentColor : undefined}
      />
    </button>
  );
}
