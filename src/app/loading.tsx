export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="border-b bg-background">
        <div className="mx-auto grid w-full max-w-[1800px] gap-8 px-4 py-10 lg:grid-cols-[1fr_420px] lg:px-8 lg:py-14">
          <div className="space-y-5">
            <div className="h-4 w-40 animate-pulse rounded-full bg-muted" />
            <div className="h-14 max-w-3xl animate-pulse rounded-2xl bg-muted" />
            <div className="h-14 max-w-2xl animate-pulse rounded-2xl bg-muted" />
            <div className="h-5 max-w-xl animate-pulse rounded-full bg-muted" />
          </div>
          <div className="rounded-2xl border bg-muted/25 p-4">
            <div className="aspect-[16/10] animate-pulse rounded-xl bg-muted" />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="h-24 animate-pulse rounded-xl bg-muted" />
              <div className="h-24 animate-pulse rounded-xl bg-muted" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1800px] px-4 py-10 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-3">
            <div className="h-4 w-28 animate-pulse rounded-full bg-muted" />
            <div className="h-9 w-52 animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="hidden h-5 w-32 animate-pulse rounded-full bg-muted md:block" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </section>
    </main>
  );
}
