"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function CollectionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errorBoundary");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex flex-col items-center gap-4 py-24 text-center sm:py-32">
      <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
        {t("collection.title")}
      </h1>
      <p className="max-w-md text-sm text-ink/60">{t("collection.body")}</p>
      <Button onClick={reset} variant="primary" size="lg" className="mt-2">
        {t("retry")}
      </Button>
    </Container>
  );
}
