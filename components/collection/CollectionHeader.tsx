import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

export function CollectionHeader({
  title,
  description,
  count,
}: {
  title: string;
  description?: string;
  count: number;
}) {
  const t = useTranslations("collection");

  return (
    <div className="bg-pale-yellow py-12 sm:py-16">
      <Container className="flex flex-col items-center gap-3 text-center">
        <Heading as="h1" size="section">
          {title}
        </Heading>
        {description && (
          <p className="max-w-lg text-sm text-ink/70">{description}</p>
        )}
        <span className="text-xs font-medium uppercase tracking-wide text-ink/50">
          {count} {t("productCount", { count })}
        </span>
      </Container>
    </div>
  );
}
