import Image from "next/image";
import { useTranslations } from "next-intl";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";

export function QuizCta() {
  const t = useTranslations("home.quizCta");

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-5 bg-blue-light px-6 py-8 text-center sm:px-12 sm:py-16 lg:px-16">
          <Heading as="h2" size="sub">
            {t("title")}
          </Heading>
          <p className="max-w-md text-sm text-ink/70">{t("body")}</p>
          <Button href="/quiz" variant="primary" size="lg">
            {t("cta")}
          </Button>
        </div>

        <div className="flex items-center justify-center bg-blue-light">
          <Image
            src="/placeholders/IMG_6742.PNG"
            alt=""
            width={1341}
            height={784}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
