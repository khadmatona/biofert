import type { Metadata } from "next";
import { CycleCareLanding } from "@/components/landing/CycleCareLanding";
import { cyclecareImages } from "@/lib/landing/cyclecare";

export const metadata: Metadata = {
  title: "Biofert CycleCare",
  description: "Biofert CycleCare — الدفع عند الاستلام، توصيل مجاني لجميع مدن المغرب.",
  alternates: { canonical: "/lp/cyclecare" },
  openGraph: {
    title: "Biofert CycleCare",
    images: [{ url: cyclecareImages.hero }],
    locale: "ar_MA",
    type: "website",
  },
};

export default function CycleCareLandingPage() {
  return <CycleCareLanding />;
}
