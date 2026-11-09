import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <Container className="py-10 sm:py-14">
      <div className="grid animate-pulse gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-square w-full rounded-3xl bg-cream" />
        <div className="flex flex-col gap-4">
          <div className="h-4 w-1/3 rounded-full bg-cream" />
          <div className="h-8 w-2/3 rounded-full bg-cream" />
          <div className="h-4 w-full rounded-full bg-cream" />
          <div className="h-4 w-5/6 rounded-full bg-cream" />
          <div className="mt-4 h-32 w-full rounded-2xl bg-cream" />
          <div className="h-12 w-full rounded-full bg-cream" />
        </div>
      </div>
    </Container>
  );
}
