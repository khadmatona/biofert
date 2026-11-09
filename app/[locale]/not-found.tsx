import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <Container className="flex flex-col items-center gap-4 py-24 text-center sm:py-32">
      <span className="font-display text-6xl font-medium text-ink/20">404</span>
      <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
        {t("title")}
      </h1>
      <p className="max-w-md text-sm text-ink/60">{t("body")}</p>
      <Button href="/" variant="primary" size="lg" className="mt-2">
        {t("backHome")}
      </Button>
    </Container>
  );
}
