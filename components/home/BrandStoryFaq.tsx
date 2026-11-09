import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Accordion } from "@/components/ui/Accordion";
import type { Locale } from "@/i18n/routing";
import brandFaqFr from "@/content/brand-faq/fr.json";
import brandFaqEn from "@/content/brand-faq/en.json";
import brandFaqAr from "@/content/brand-faq/ar.json";

const brandFaqContent: Record<Locale, { items: { question: string; answer: string }[] }> = {
  fr: brandFaqFr,
  en: brandFaqEn,
  ar: brandFaqAr,
};

export function BrandStoryFaq() {
  const t = useTranslations("home.brandStoryFaq");
  const locale = useLocale() as Locale;
  const faqItems = brandFaqContent[locale].items;

  return (
    <section className="bg-pink-pale py-10 sm:py-20">
      <Container className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:items-center">
        <div>
          <Heading size="section" className="mb-4">
            {t("title")}
          </Heading>
          <p className="mb-8 max-w-md text-sm leading-relaxed text-ink/70">{t("body")}</p>
          <Accordion items={faqItems} />
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
          <Image
            src="/placeholders/IMG_6732 (2).PNG"
            alt=""
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
