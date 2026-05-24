import Image from "next/image";

type LogoProps = {
  className?: string;
  // Kept for API compatibility; the full logo lockup already includes the tagline.
  showTagline?: boolean;
};

export function Logo({ className = "" }: LogoProps) {
  return (
    <Image
      src="/logo.jpg"
      alt="Fajicat — Comodidad para tu gato"
      width={470}
      height={215}
      priority
      className={`h-11 w-auto mix-blend-multiply ${className}`}
    />
  );
}
