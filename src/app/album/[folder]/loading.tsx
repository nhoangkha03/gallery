export default function AlbumLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="mb-8 border-b bg-background py-10 lg:py-12">
        <div className="mx-auto w-full max-w-[1800px] space-y-6 px-4 lg:px-8">
          <div className="h-5 w-40 animate-pulse rounded-full bg-muted" />
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-3">
              <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
              <div className="h-14 w-72 animate-pulse rounded-2xl bg-muted" />
            </div>
            <div className="h-14 w-40 animate-pulse rounded-2xl bg-muted" />
          </div>
        </div>
      </section>
      <div className="mx-auto grid w-full max-w-[1800px] grid-cols-2 gap-3 px-4 pb-20 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:px-8">
        {Array.from({ length: 18 }).map((_, index) => (
          <div key={index} className="aspect-square animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </main>
  );
}
