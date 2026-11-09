import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

const TRUSTPILOT_GREEN = "#00b67a";

function TrustpilotStarIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill={TRUSTPILOT_GREEN}
        d="M12 1.5l2.98 6.04 6.67.97-4.83 4.7 1.14 6.64L12 16.7l-5.96 3.15 1.14-6.64-4.83-4.7 6.67-.97L12 1.5z"
      />
    </svg>
  );
}

function TrustpilotSquareStar() {
  return (
    <span
      className="flex h-8 w-8 items-center justify-center sm:h-9 sm:w-9"
      style={{ backgroundColor: TRUSTPILOT_GREEN }}
      aria-hidden="true"
    >
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path
          fill="white"
          d="M12 1.5l2.98 6.04 6.67.97-4.83 4.7 1.14 6.64L12 16.7l-5.96 3.15 1.14-6.64-4.83-4.7 6.67-.97L12 1.5z"
        />
      </svg>
    </span>
  );
}

export function TrustpilotStrip() {
  const t = useTranslations("home.trustpilot");

  return (
    <section id="trustpilot" className="bg-white py-8 sm:py-16">
      <Container className="mx-auto flex max-w-4xl flex-col items-start gap-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <TrustpilotStarIcon />
            <span className="text-2xl font-bold text-[#000032]">{t("title")}</span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <TrustpilotSquareStar key={i} />
            ))}
          </div>
          <p className="text-base font-bold text-ink">
            {t("score")}
            {" | "}
            <a href="#" className="underline hover:no-underline">
              {t("reviewsLink")}
            </a>
          </p>
        </div>

        <div className="flex max-w-xl flex-col gap-2 text-left">
          <p className="font-display text-lg font-bold italic text-ink">{t("quoteTitle")}</p>
          <p className="italic leading-relaxed text-ink/90">{t("quote")}</p>
          <p className="text-xs italic text-ink/50">{t("quoteAuthor")}</p>
        </div>
      </Container>
    </section>
  );
}
