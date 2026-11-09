import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heading } from "@/components/ui/Heading";
import { StarRating } from "@/components/ui/StarRating";
import { ArrowIcon } from "@/components/ui/Icons";

const avatars = [
  { initials: "ZL", color: "var(--pink)" },
  { initials: "IB", color: "var(--rose)" },
  { initials: "YO", color: "var(--pink-dark)" },
  { initials: "RA", color: "var(--terracotta)" },
];

function PercentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 7L7 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.5 8l8.5-4 8.5 4-8.5 4-8.5-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3.5 8v8l8.5 4 8.5-4V8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 12v8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExpertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 20c1.5-4 4.5-6 7.5-6s6 2 7.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15.5 5.5l1 1 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3h8l5 5v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 3v5h5M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const tileKeys = ["free", "fast", "instant", "expert", "private"] as const;
const tileIcons: Record<(typeof tileKeys)[number], React.ReactNode> = {
  free: <PercentIcon />,
  fast: <ClockIcon />,
  instant: <BoxIcon />,
  expert: <ExpertIcon />,
  private: <DocumentIcon />,
};

export function Subscription() {
  const t = useTranslations("home.subscription");

  return (
    <section className="bg-blue-light">
      <div className="grid lg:grid-cols-2 lg:items-stretch">
        <div className="flex flex-col justify-center gap-6 px-5 py-10 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="flex flex-col items-start gap-2">
            <div className="flex -space-x-2 rtl:space-x-reverse">
              {avatars.map((a) => (
                <span
                  key={a.initials}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-white"
                  style={{ backgroundColor: a.color }}
                >
                  {a.initials}
                </span>
              ))}
            </div>
            <StarRating rating={5} />
            <p className="text-sm font-medium text-ink/70">{t("socialProof")}</p>
          </div>

          <Heading as="h2" size="section">
            {t("title")}
          </Heading>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {tileKeys.map((key) => (
              <div key={key} className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-soft">
                <span className="text-rose">{tileIcons[key]}</span>
                <h3 className="font-display text-sm font-medium text-ink">{t(`tiles.${key}.title`)}</h3>
                <p className="text-xs text-ink/60">{t(`tiles.${key}.body`)}</p>
              </div>
            ))}
            <Link
              href="/quiz"
              className="flex flex-col justify-between gap-2 rounded-2xl bg-pink-light p-4 shadow-soft transition-colors hover:bg-pink-light/70"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white">
                <ArrowIcon size={14} />
              </span>
              <span className="font-display text-sm font-semibold text-ink">{t("cta")}</span>
            </Link>
          </div>
        </div>

        <div className="relative min-h-[420px] w-full overflow-hidden lg:min-h-full">
          <Image
            src="https://images.unsplash.com/photo-1651663303138-4dc283e15992?w=1000&q=80&fit=crop"
            alt={t("imageAlt")}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
