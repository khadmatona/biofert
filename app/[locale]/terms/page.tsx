import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { siteConfig } from "@/lib/site-config";
import { buildAlternates } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";
import termsFr from "@/content/legal/terms/fr.json";
import termsEn from "@/content/legal/terms/en.json";
import termsAr from "@/content/legal/terms/ar.json";

interface LegalContent {
  sections: { title: string; body: string }[];
}

const termsContent: Record<Locale, LegalContent> = {
  fr: termsFr,
  en: termsEn,
  ar: termsAr,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.terms" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/terms", locale as Locale),
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const localeKey = routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;
  const sections = termsContent[localeKey].sections;

  return (
    <>
      <div className="bg-cream py-12 sm:py-16">
        <Container className="flex flex-col items-center gap-3 text-center">
          <Heading as="h1" size="section">
            {t("terms.title")}
          </Heading>
          <p className="max-w-lg text-sm text-ink/70">{t("lastUpdated")}</p>
        </Container>
      </div>

      <Container className="py-12 sm:py-16">
        <div className="mx-auto flex max-w-2xl flex-col gap-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-2 font-display text-lg font-medium text-ink">{section.title}</h2>
              <p className="text-sm leading-relaxed text-ink/70">
                {section.body.replace("{siteName}", siteConfig.name)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
