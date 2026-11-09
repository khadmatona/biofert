"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { SearchIcon, UserIcon, CartIcon, MenuIcon } from "@/components/ui/Icons";
import { MegaMenuProducts } from "./MegaMenuProducts";
import { MegaMenuMoments } from "./MegaMenuMoments";
import { ResourcesMenu } from "./ResourcesMenu";
import { SearchOverlay } from "./SearchOverlay";
import { MobileNav } from "./MobileNav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";

type MenuKey = "products" | "moments" | "resources" | null;

export function Header({ featuredProducts }: { featuredProducts: Product[] }) {
  const t = useTranslations("header");
  const [activeMenu, setActiveMenu] = useState<MenuKey>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { itemCount, openCart } = useCart();
  const pathname = usePathname();

  const closeAll = () => {
    setActiveMenu(null);
    setSearchOpen(false);
  };

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        closeAll();
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeAll();
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const setHeight = () => {
      document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
    };
    setHeight();
    const observer = new ResizeObserver(setHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const toggleMenu = (key: MenuKey) => {
    setSearchOpen(false);
    setActiveMenu((prev) => (prev === key ? null : key));
  };

  const toggleSearch = () => {
    setActiveMenu(null);
    setSearchOpen((prev) => !prev);
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-ink/10 bg-white px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
      <div className="relative mx-auto grid w-full max-w-none grid-cols-[1fr_auto_1fr] items-center gap-2 px-2 py-6 sm:gap-4 sm:px-3 sm:py-6">
        {/* Start cluster */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMobileNavOpen(true)}
            aria-label={t("openMenu")}
            className="rounded-full p-2 hover:bg-cream 2xl:hidden"
          >
            <MenuIcon />
          </button>

          <nav className="hidden items-center gap-2 2xl:flex">
            <button
              onClick={() => toggleMenu("products")}
              aria-expanded={activeMenu === "products"}
              className="shrink-0 whitespace-nowrap rounded-full px-2 py-2 text-xs font-semibold uppercase tracking-normal text-brown hover:bg-cream"
            >
              {t("nosProduits")}
            </button>
            <button
              onClick={() => toggleMenu("moments")}
              aria-expanded={activeMenu === "moments"}
              className="shrink-0 whitespace-nowrap rounded-full px-2 py-2 text-xs font-semibold uppercase tracking-normal text-brown hover:bg-cream"
            >
              {t("momentsDeVie")}
            </button>
            <div className="relative">
              <button
                onClick={() => toggleMenu("resources")}
                aria-expanded={activeMenu === "resources"}
                className="shrink-0 whitespace-nowrap rounded-full px-2 py-2 text-xs font-semibold uppercase tracking-normal text-brown hover:bg-cream"
              >
                {t("ressources")}
              </button>
              {activeMenu === "resources" && (
                <ResourcesMenu onNavigate={closeAll} />
              )}
            </div>
            <Link
              href="/collections/best-sellers"
              className="shrink-0 whitespace-nowrap rounded-none bg-blue-light px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-ink"
            >
              {t("promo")}
            </Link>
          </nav>
        </div>

        {/* Center logo — its own grid column, so the side clusters can never
            overlap it: on narrow screens a wide cluster grows its own
            track instead of encroaching on the logo's. */}
        <Link
          href="/"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.location.reload();
            }
          }}
          className="justify-self-center"
        >
          <Logo className="text-base sm:text-xl lg:text-2xl 2xl:text-4xl" />
        </Link>

        {/* End cluster */}
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <Suspense fallback={null}>
            <LanguageSwitcher />
          </Suspense>
          <div className="hidden md:inline-flex">
            <Button href="/quiz" variant="primary" size="sm">
              {t("bilanPersonnalise")}
            </Button>
          </div>
          <button
            onClick={toggleSearch}
            aria-label={t("search")}
            aria-expanded={searchOpen}
            className="rounded-full p-2 hover:bg-cream"
          >
            <SearchIcon />
          </button>
          <Link href="/account" aria-label={t("account")} className="hidden rounded-full p-2 hover:bg-cream sm:inline-flex">
            <UserIcon />
          </Link>
          <button
            onClick={openCart}
            aria-label={t("openCart", { count: itemCount })}
            className="relative rounded-full p-2 hover:bg-cream"
          >
            <CartIcon size={22} />
            {itemCount > 0 && (
              <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeMenu === "products" && <MegaMenuProducts onNavigate={closeAll} />}
      {activeMenu === "moments" && <MegaMenuMoments onNavigate={closeAll} />}
      {searchOpen && <SearchOverlay onClose={closeAll} featuredProducts={featuredProducts} />}

      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </header>
  );
}
