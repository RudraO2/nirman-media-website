// Shared stroke-icon set for the tool surfaces (AD-8). Hand-drawn 24×24
// stroke grammar — same family as the hub's category icons and the EMI donut.
// No icon library; every glyph the tools need lives here.

type IconProps = { className?: string };

function Base({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "h-4 w-4"}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M12 4v10.5M7.5 11 12 15.5 16.5 11M4.5 19.5h15" />
    </Base>
  );
}

export function LinkIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M10 14.5 14.5 10M8.5 12l-2.7 2.7a3.2 3.2 0 0 0 4.5 4.5L13 16.5M15.5 12l2.7-2.7a3.2 3.2 0 0 0-4.5-4.5L11 7.5" />
    </Base>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Base>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="m6 9.5 6 6 6-6" />
    </Base>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M12 5.5v13M5.5 12h13" />
    </Base>
  );
}
