"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { CloseXIcon, ChevronDownIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import {
  productMegaMenu,
  resourcesMenu,
  momentTiles,
} from "@/lib/site-config";

export function MobileNav({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("header");
  const navT = useTranslations("mobileNav");
  const megaMenuT = useTranslations("nav.megaMenu");
  const momentsT = useTranslations("nav.moments");
  const resourcesT = useTranslations("nav.resources");
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (key: string) =>
    setOpenSection((prev) => (prev === key ? null : key));

  return (
    <>
      <div
        className={`fixed inset-0 z-[80] bg-ink/40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={navT("ariaLabel")}
        className={`fixed start-0 top-0 z-[81] h-full w-full max-w-sm overflow-y-auto bg-white transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <span className="font-display text-lg font-semibold">{navT("title")}</span>
          <button onClick={onClose} aria-label={t("closeMenu")} className="rounded-full p-2 hover:bg-cream">
            <CloseXIcon />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-5">
          <MobileSection
            label={t("nosProduits")}
            open={openSection === "products"}
            onToggle={() => toggle("products")}
          >
            {productMegaMenu.map((category) => (
              <Link
                key={category.key}
                href={category.href}
                onClick={onClose}
                className="block py-2 text-sm text-ink/80"
              >
                {megaMenuT(`${category.key}.label`)}
              </Link>
            ))}
          </MobileSection>

          <MobileSection
            label={t("momentsDeVie")}
            open={openSection === "moments"}
            onToggle={() => toggle("moments")}
          >
            {momentTiles.map((tile) => (
              <Link
                key={tile.key}
                href={tile.href}
                onClick={onClose}
                className="block py-2 text-sm text-ink/80"
              >
                {momentsT(tile.key)}
              </Link>
            ))}
          </MobileSection>

          <MobileSection
            label={t("ressources")}
            open={openSection === "resources"}
            onToggle={() => toggle("resources")}
          >
            {resourcesMenu.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={onClose}
                className="block py-2 text-sm text-ink/80"
              >
                {resourcesT(link.key)}
              </Link>
            ))}
          </MobileSection>

          <div className="mt-4 flex flex-col gap-3">
            <Button href="/quiz" variant="primary" size="md" onClick={onClose}>
              {t("bilanPersonnalise")}
            </Button>
            <Button href="/collections/best-sellers" variant="accent" size="md" onClick={onClose}>
              {t("promo")}
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}

function MobileSection({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-ink/10 py-1">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3 text-left font-display text-base font-medium"
      >
        {label}
        <ChevronDownIcon
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pb-3 ps-2">{children}</div>}
    </div>
  );
}
