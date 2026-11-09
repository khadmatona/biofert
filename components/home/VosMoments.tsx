import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import type { Product } from "@/lib/types";

const categoryContent: Record<string, { key: string; image: string }> = {
  bellafert: { key: "elle", image: "/placeholders/Katie-19.webp" },
  fertimen: { key: "lui", image: "/placeholders/acc6681798d84408f49df7075930f68d.jpg" },
  "pack-couple": { key: "duo", image: "/placeholders/JM_SHOOTING_CELINE-0620.webp" },
  "ferti-power": { key: "vitaliteLui", image: "/placeholders/11271a6c6c5659120631072b7da58036.jpg" },
  powermen: { key: "performance", image: "/placeholders/da4159e3377b9b7552fb4ef9e35a3da6.jpg" },
  "smokeclean-men": { key: "detox", image: "/placeholders/893ad68020bb0ac7f38673363d0a7d9e.jpg" },
  "relaxes-woman": { key: "sereniteElle", image: "/placeholders/pexels-aliona-zueva-42707571-11554690.jpg" },
  cyclecare: { key: "confortCycle", image: "/placeholders/143d96aee1fec0c6151129078e6d985e.jpg" },
};

export function VosMoments({ products }: { products: Product[] }) {
  const t = useTranslations("home.vosMoments");
  const momentsT = useTranslations("nav.moments");

  return (
    <section className="bg-white py-10 sm:py-20">
      <Container>
        <Heading as="h2" size="section">
          {t("title")}
        </Heading>
        <p className="mt-3 max-w-2xl text-base font-semibold text-brown sm:text-lg">
          {t("subtitle")}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 sm:grid-cols-4 sm:gap-5">
          {products.map((product) => {
            const content = categoryContent[product.handle];
            if (!content) return null;
            return (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                className="group relative block aspect-square overflow-hidden rounded-lg bg-cream"
              >
                <Image
                  src={content.image}
                  alt={momentsT(content.key)}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm">
                  {momentsT(content.key)}
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
