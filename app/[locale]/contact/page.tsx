import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ContactForm } from "@/components/contact/ContactForm";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.contact" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/contact", locale as Locale),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      <div className="bg-pink-light py-12 sm:py-16">
        <Container className="flex flex-col items-center gap-3 text-center">
          <Heading as="h1" size="section">
            {t("title")}
          </Heading>
          <p className="max-w-lg text-sm text-ink/70">{t("description")}</p>
        </Container>
      </div>

      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/50">
              {t("emailLabel")}
            </h2>
            <a
              href="mailto:hello@biofertmaroc.com"
              className="text-sm text-ink/80 hover:text-ink hover:underline underline-offset-4"
            >
              hello@biofertmaroc.com
            </a>
          </div>
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/50">
              {t("addressLabel")}
            </h2>
            <address className="not-italic text-sm leading-relaxed text-ink/80">
              {t("addressLine1")}
              <br />
              {t("addressLine2")}
            </address>
          </div>
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/50">
              {t("shippingLabel")}
            </h2>
            <p className="text-sm leading-relaxed text-ink/80">{t("shippingBody")}</p>
          </div>
        </div>

        <ContactForm />
      </Container>
    </>
  );
}
