import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Values } from "@/components/home/Values";
import { TrustBadges } from "@/components/home/TrustBadges";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.about" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/about", locale as Locale),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <>
      <div className="bg-cream py-12 sm:py-16">
        <Container className="flex flex-col items-center gap-3 text-center">
          <Heading as="h1" size="section">
            {t("title")}
          </Heading>
          <p className="max-w-lg text-sm text-ink/70">{t("intro")}</p>
        </Container>
      </div>

      <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
          <Image
            src="/products/pack-couple.png"
            alt="Pack Couple BellaFert et FertiMen"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <Heading size="sub" className="mb-4">
            {t("whyTitle")}
          </Heading>
          <div className="flex flex-col gap-4 text-sm leading-relaxed text-ink/70">
            <p>{t("paragraph1")}</p>
            <p>{t("paragraph2")}</p>
            <p>{t("paragraph3")}</p>
          </div>
        </div>
      </Container>

      <Values />
      <TrustBadges />
    </>
  );
}
