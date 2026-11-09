type LogoProps = { width: number; height: number };

function VisaLogo({ width, height }: LogoProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 38 24" aria-label="Visa">
      <rect width="38" height="24" rx="4" fill="#1434CB" />
      <text x="19" y="16" textAnchor="middle" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="700" fontSize="11" fill="#fff">
        VISA
      </text>
    </svg>
  );
}

function MastercardLogo({ width, height }: LogoProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 38 24" aria-label="Mastercard">
      <rect width="38" height="24" rx="4" fill="#fff" stroke="rgba(47,33,27,0.12)" />
      <circle cx="16" cy="12" r="7" fill="#EB001B" />
      <circle cx="22" cy="12" r="7" fill="#F79E1B" />
      <path d="M19 6.6a7 7 0 010 10.8 7 7 0 010-10.8Z" fill="#FF5F00" />
    </svg>
  );
}

function AmexLogo({ width, height }: LogoProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 38 24" aria-label="American Express">
      <rect width="38" height="24" rx="4" fill="#016FD0" />
      <text x="19" y="15.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9" fill="#fff">
        AMEX
      </text>
    </svg>
  );
}

function PayPalLogo({ width, height }: LogoProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 38 24" aria-label="PayPal">
      <rect width="38" height="24" rx="4" fill="#fff" stroke="rgba(47,33,27,0.12)" />
      <text x="19" y="16" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontStyle="italic" fontSize="10">
        <tspan fill="#003087">Pay</tspan>
        <tspan fill="#009CDE">Pal</tspan>
      </text>
    </svg>
  );
}

function AlmaLogo({ width, height }: LogoProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 38 24" aria-label="Alma">
      <rect width="38" height="24" rx="4" fill="#FDE0D6" />
      <text x="19" y="16" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="600" fontSize="11" fill="#2F211B">
        alma
      </text>
    </svg>
  );
}

export const paymentMethods = [
  { name: "Visa", Logo: VisaLogo },
  { name: "Mastercard", Logo: MastercardLogo },
  { name: "Amex", Logo: AmexLogo },
  { name: "PayPal", Logo: PayPalLogo },
  { name: "Alma", Logo: AlmaLogo },
];

export function PaymentLogos({
  className = "",
  width = 57,
  height = 36,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {paymentMethods.map(({ name, Logo }) => (
        <li key={name} className="overflow-hidden rounded-md shadow-soft">
          <Logo width={width} height={height} />
        </li>
      ))}
    </ul>
  );
}
