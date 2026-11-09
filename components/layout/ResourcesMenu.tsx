import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { resourcesMenu } from "@/lib/site-config";

export function ResourcesMenu({ onNavigate }: { onNavigate: () => void }) {
  const t = useTranslations("nav.resources");

  return (
    <div className="absolute left-1/2 top-full z-40 w-56 -translate-x-1/2 rounded-2xl border border-ink/10 bg-white p-2 shadow-lg">
      <ul className="flex flex-col">
        {resourcesMenu.map((link) => (
          <li key={link.key}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className="block rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-cream hover:text-ink"
            >
              {t(link.key)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
