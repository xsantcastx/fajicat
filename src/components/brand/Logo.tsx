import Image from "next/image";

type LogoProps = {
  className?: string;
  showTagline?: boolean;
};

export function Logo({ className = "", showTagline = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo-mark.svg"
        alt="Fajicat"
        width={56}
        height={46}
        priority
      />
      <div className="flex flex-col leading-none">
        <span className="font-script text-3xl bg-gradient-to-r from-brand-orange to-brand-green bg-clip-text text-transparent">
          Fajicat
        </span>
        {showTagline && (
          <span className="mt-0.5 text-[0.7rem] font-medium tracking-wide text-ink/70">
            Comodidad para tu mascota
          </span>
        )}
      </div>
    </div>
  );
}
