import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <>
      <div className="bg-pale-yellow py-12 sm:py-16">
        <Container className="flex animate-pulse flex-col items-center gap-3 text-center">
          <div className="h-8 w-64 rounded-full bg-white/60" />
          <div className="h-4 w-80 rounded-full bg-white/60" />
        </Container>
      </div>
      <Container className="py-12 sm:py-16">
        <div className="grid animate-pulse grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
          <div className="hidden h-64 rounded-2xl bg-cream lg:block" />
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-square rounded-lg bg-cream" />
                <div className="h-4 w-2/3 rounded-full bg-cream" />
                <div className="h-4 w-1/3 rounded-full bg-cream" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
