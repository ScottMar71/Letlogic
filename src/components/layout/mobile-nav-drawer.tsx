"use client";

import { useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { LogoLink } from "@/components/brand/logo";
import { useDialogFocus } from "@/hooks/use-dialog-focus";

type MobileNavDrawerProps = {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  /** Tailwind visibility class for the drawer breakpoint (e.g. sm:hidden, lg:hidden). */
  visibleBelow: "sm" | "lg";
  logoHref?: string;
  headerExtra?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

const visibilityClass = {
  sm: "sm:hidden",
  lg: "lg:hidden",
} as const;

export function MobileNavDrawer({
  open,
  onClose,
  ariaLabel,
  visibleBelow,
  logoHref = "/",
  headerExtra,
  children,
  footer,
}: MobileNavDrawerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(open, onClose, dialogRef);

  if (!open) return null;

  const hidden = visibilityClass[visibleBelow];

  return (
    <div className={`fixed inset-0 z-50 bg-navy/50 ${hidden}`}>
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={`absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-surface shadow-xl ${hidden}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <LogoLink href={logoHref} size="sm" />
          <button
            type="button"
            aria-label="Close menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-muted"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {headerExtra}

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">{children}</nav>

        {footer ? <div className="border-t border-border p-4">{footer}</div> : null}
      </div>
    </div>
  );
}
