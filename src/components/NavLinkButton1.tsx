import type { ReactNode } from "react";

type NavLinkButtonProps = {
  children: ReactNode;
  onClick: () => void;
  className?: string;
};

export function NavLinkButton({
  children,
  onClick,
  className = "",
}: NavLinkButtonProps) {
  return (
    <button
      type="button"
      className={`nav-link-btn ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}