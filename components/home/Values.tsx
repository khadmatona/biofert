import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

const valueKeys = ["clean", "tested", "responsible", "expert", "approved"] as const;

function CleanIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M14 4c3.5 4.2 6 7.7 6 11a6 6 0 1 1-12 0c0-3.3 2.5-6.8 6-11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M22 6l.9 2.1L25 9l-2.1.9L22 12l-.9-2.1L19 9l2.1-.9L22 6Z" fill="currentColor" />
    </svg>
  );
}

function TestedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M11 3.5h6M12 4v7.2L7.6 19a2.5 2.5 0 0 0 2.2 3.7h8.4a2.5 2.5 0 0 0 2.2-3.7L16 11.2V4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.5 16.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M6 21C5 12 11 5 21 5c1 8-6 16-15 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M6 21c3-4.5 6.5-8 12.5-12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ExpertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 9.5v9M9.5 14h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ApprovedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M14 22s-8-4.6-8-10.8A4.7 4.7 0 0 1 14 8.3a4.7 4.7 0 0 1 8 2.9C22 17.4 14 22 14 22Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M11 13.2l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const valueIcons: Record<(typeof valueKeys)[number], React.ReactNode> = {
  clean: <CleanIcon className="h-full w-full" />,
  tested: <TestedIcon className="h-full w-full" />,
  responsible: <LeafIcon className="h-full w-full" />,
  expert: <ExpertIcon className="h-full w-full" />,
  approved: <ApprovedIcon className="h-full w-full" />,
};

export function Values() {
  const t = useTranslations("home.values");

  return (
    <section className="bg-white py-10 sm:py-20">
      <Container>
        <Heading as="h2" size="sub" className="text-start lg:text-center">
          {t("title")}
        </Heading>

        {/* Mobile/tablet: start-aligned icon + label rows, one per row */}
        <div className="mt-6 flex flex-col gap-6 lg:hidden">
          {valueKeys.map((key) => (
            <div key={key} className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-pale text-rose">
                <span className="flex h-5 w-5 items-center justify-center">{valueIcons[key]}</span>
              </div>
              <h3 className="font-display text-sm font-medium text-ink">{t(`items.${key}.title`)}</h3>
            </div>
          ))}
        </div>

        {/* Desktop: centered icon-over-text grid with descriptions */}
        <div className="mt-10 hidden gap-x-6 gap-y-10 lg:grid lg:grid-cols-5">
          {valueKeys.map((key) => (
            <div key={key} className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-pale text-rose sm:h-16 sm:w-16">
                <span className="flex h-6 w-6 items-center justify-center sm:h-7 sm:w-7">{valueIcons[key]}</span>
              </div>
              <h3 className="font-display text-sm font-medium text-ink sm:text-base">{t(`items.${key}.title`)}</h3>
              <p className="text-xs text-ink/60">{t(`items.${key}.description`)}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
