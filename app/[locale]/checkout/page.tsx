import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.checkout" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/checkout", locale as Locale),
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("checkout");

  return (
    <Container className="py-12 sm:py-16">
      <Heading as="h1" size="section" className="mb-10">
        {t("title")}
      </Heading>
      <CheckoutForm />
    </Container>
  );
}
