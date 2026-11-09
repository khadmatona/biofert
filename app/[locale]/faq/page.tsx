import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Accordion } from "@/components/ui/Accordion";
import { buildAlternates } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";
import faqContentFr from "@/content/faq/fr.json";
import faqContentEn from "@/content/faq/en.json";
import faqContentAr from "@/content/faq/ar.json";

interface FaqContent {
  sections: { key: string; items: { question: string; answer: string }[] }[];
}

const faqContent: Record<Locale, FaqContent> = {
  fr: faqContentFr,
  en: faqContentEn,
  ar: faqContentAr,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.faq" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/faq", locale as Locale),
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");
  const localeKey = routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;
  const sections = faqContent[localeKey].sections;

  return (
    <>
      <div className="bg-blue-light py-12 sm:py-16">
        <Container className="flex flex-col items-center gap-3 text-center">
          <Heading as="h1" size="section">
            {t("title")}
          </Heading>
          <p className="max-w-lg text-sm text-ink/70">{t("description")}</p>
        </Container>
      </div>

      <Container className="flex flex-col gap-12 py-12 sm:gap-16 sm:py-16">
        {sections.map((section) => (
          <div key={section.key} className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-12">
            <Heading as="h2" size="sub">
              {t(`sections.${section.key}`)}
            </Heading>
            <Accordion items={section.items} />
          </div>
        ))}
      </Container>
    </>
  );
}
