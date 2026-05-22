import Image from "next/image";
import Link from "next/link";

export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Nirman Media"
      width={size}
      height={size}
      priority
      className={className}
    />
  );
}

export function LogoLockup({
  className = "",
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "cream";
}) {
  const text = tone === "cream" ? "text-cream" : "text-ink";
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-3 ${className}`}
      aria-label="Nirman Media — home"
    >
      <LogoMark
        size={32}
        className="rounded-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[-6deg] group-hover:scale-[1.04]"
      />
      <span className={`font-heading text-lg leading-none ${text}`}>
        Nirman{" "}
        <span className="text-gold transition-opacity duration-300 group-hover:opacity-80">
          Media
        </span>
      </span>
    </Link>
  );
}
