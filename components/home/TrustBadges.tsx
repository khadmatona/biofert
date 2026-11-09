import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

const badgeKeys = ["delivery", "payment", "refund", "rating", "certified"] as const;

function DeliveryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M2 8.5h12.5v10.5H2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14.5 12.5h5l4 4v2.5h-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="8" cy="21" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="21" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 4.5h3.5M1 6.7h5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PaymentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M9 4h13.5a1.5 1.5 0 011.5 1.5V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="9" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 13.8h18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 18.6h5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RefundIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M14 3.5l9 3.3v6.4c0 6-3.8 9.9-9 11.3-5.2-1.4-9-5.3-9-11.3V6.8l9-3.3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 14.2l2.8 2.8 5.2-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M14 3.5l3.1 6.5 7.1.9-5.2 5 1.3 7.1-6.3-3.5-6.3 3.5 1.3-7.1-5.2-5 7.1-.9 3.1-6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CertifiedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="11" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 10.6l2 2 3.2-3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 17.5l-2 7 6-3 6 3-2-7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

const badgeIcons: Record<(typeof badgeKeys)[number], React.ReactNode> = {
  delivery: <DeliveryIcon className="h-full w-full" />,
  payment: <PaymentIcon className="h-full w-full" />,
  refund: <RefundIcon className="h-full w-full" />,
  rating: <StarIcon className="h-full w-full" />,
  certified: <CertifiedIcon className="h-full w-full" />,
};

export function TrustBadges() {
  const t = useTranslations("home.trustBadges");

  return (
    <section className="bg-pink-pale py-10 sm:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-y-6 sm:flex sm:flex-nowrap sm:items-center sm:gap-0 sm:divide-x sm:divide-ink/10 rtl:sm:divide-x-reverse">
          {badgeKeys.map((key) => (
            <div key={key} className="flex items-center gap-3 sm:flex-1 sm:justify-center sm:px-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-rose">
                <span className="flex h-6 w-6 items-center justify-center">{badgeIcons[key]}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{t(`${key}.title`)}</p>
                <p className="text-xs text-ink/60">{t(`${key}.body`)}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
