import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getApiUrl } from "@/lib/checkout-config";

interface OrderConfirmation {
  orderNumber: string | null;
  status: string;
}

async function fetchConfirmation(orderId: string): Promise<OrderConfirmation | null> {
  try {
    const response = await fetch(`${getApiUrl()}/api/orders/${orderId}/confirmation`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as OrderConfirmation;
  } catch {
    return null;
  }
}

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ locale: string; orderId: string }>;
}) {
  const { locale, orderId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("orderSuccess");

  const confirmation = await fetchConfirmation(orderId);

  if (!confirmation) {
    return (
      <Container className="flex flex-col items-center gap-4 py-24 text-center sm:py-32">
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
          {t("notFoundTitle")}
        </h1>
        <p className="max-w-md text-sm text-ink/60">{t("notFoundBody")}</p>
        <Button href="/" variant="primary" size="lg" className="mt-2">
          {t("continueShopping")}
        </Button>
      </Container>
    );
  }

  return (
    <Container className="flex flex-col items-center gap-4 py-24 text-center sm:py-32">
      <span className="text-5xl" aria-hidden="true">
        ✓
      </span>
      <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">{t("title")}</h1>
      {confirmation.orderNumber && (
        <p className="text-sm font-medium text-ink/80">
          {t("orderNumber", { number: confirmation.orderNumber })}
        </p>
      )}
      <p className="max-w-md text-sm text-ink/60">{t("body")}</p>
      <Button href="/" variant="primary" size="lg" className="mt-2">
        {t("continueShopping")}
      </Button>
    </Container>
  );
}
