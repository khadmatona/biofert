import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { QuizForm } from "@/components/quiz/QuizForm";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.quiz" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/quiz", locale as Locale),
  };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("quiz");

  return (
    <div className="bg-cream/40 py-12 sm:py-16">
      <Container className="flex flex-col items-center gap-3 pb-10 text-center sm:pb-14">
        <Heading as="h1" size="section">
          {t("title")}
        </Heading>
        <p className="max-w-lg text-sm text-ink/70">{t("intro")}</p>
      </Container>

      <Container>
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-sm sm:p-10">
          <QuizForm />
        </div>
      </Container>
    </div>
  );
}
