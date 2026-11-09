import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "./NewsletterForm";
import { footerNav, siteConfig } from "@/lib/site-config";
import { WhatsAppIcon, FacebookIcon, InstagramIcon } from "@/components/ui/Icons";
import { PaymentLogos } from "@/components/ui/PaymentLogos";
import type { NavLink } from "@/lib/types";

const socialLinks = [
  { label: "WhatsApp", href: "https://wa.me/", Icon: WhatsAppIcon },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
];

function FooterColumn({
  title,
  links,
  labels,
}: {
  title: string;
  links: NavLink[];
  labels: (key: string) => string;
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.key}>
            <Link
              href={link.href}
              className="text-sm text-ink hover:underline underline-offset-4"
            >
              {labels(link.key)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const shopLabels = useTranslations("footer.shopLinks");
  const companyLabels = useTranslations("footer.companyLinks");
  const helpLabels = useTranslations("footer.helpLinks");
  const legalLabels = useTranslations("footer.legalLinks");

  return (
    <footer className="relative overflow-hidden bg-pink-pale text-ink">
      <Container className="relative z-10 py-14 sm:py-16">
        <div
          className="mb-12 flex flex-col items-start gap-6 rounded-3xl bg-pink-light/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10"
        >
          <div>
            <h2 className="font-display text-2xl font-medium">{t("newsletterTitle")}</h2>
            <p className="mt-1 text-sm text-ink">{t("newsletterBody")}</p>
          </div>
          <NewsletterForm />
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <FooterColumn title={t("columns.shop")} links={footerNav.shop} labels={shopLabels} />
          <FooterColumn title={t("columns.company")} links={footerNav.company} labels={companyLabels} />
          <FooterColumn title={t("columns.help")} links={footerNav.help} labels={helpLabels} />
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink">
              {t("columns.contact")}
            </h3>
            <address className="not-italic text-sm leading-relaxed text-ink">
              {t("addressLine1")}
              <br />
              {t("addressLine2")}
              <br />
              <a href="mailto:hello@biofertmaroc.com" className="hover:underline underline-offset-4">
                hello@biofertmaroc.com
              </a>
            </address>
            <ul className="mt-4 flex gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="block text-pink-dark transition-colors hover:text-pink"
                  >
                    <Icon size={26} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3 text-xs text-ink">
            {footerNav.legal.map((link) => (
              <Link key={link.key} href={link.href} className="hover:text-ink hover:underline underline-offset-4">
                {legalLabels(link.key)}
              </Link>
            ))}
            <span>&copy; {new Date().getFullYear()} {siteConfig.name}. {t("rightsReserved")}</span>
          </div>
          <PaymentLogos />
        </div>
      </Container>

      <span
        aria-hidden="true"
        dir="ltr"
        className="pointer-events-none absolute top-10 end-0 select-none whitespace-nowrap text-[28vw] font-semibold leading-none text-ink/5 sm:text-[16rem]"
        style={{
          fontFamily: "var(--font-logo)",
          fontVariationSettings: '"SOFT" 60, "WONK" 0, "opsz" 144',
          transform: "rotate(-8deg) translateX(-20%)",
        }}
      >
        BM
        <span style={{ display: "inline-block", fontStyle: "italic", transform: "skew(-12deg)" }}>
          !
        </span>
      </span>
    </footer>
  );
}
