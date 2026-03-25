import AlbumCard from "@/components/AlbumCard";
import cloudinary from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

async function getFolders() {
  try {
    const { folders } = await cloudinary.api.root_folders();
    
    const foldersWithThumbnails = await Promise.all(
      folders.map(async (folder: any) => {
        const { resources, total_count } = await cloudinary.search
          .expression(`folder:"${folder.name}"`)
          .sort_by("public_id", "desc")
          .execute();
        
        return {
          name: folder.name,
          path: folder.path,
          thumbnail: resources[0]?.secure_url || null,
          count: total_count || resources.length,
        };
      })
    );
    return foldersWithThumbnails;
  } catch (error) {
    console.error("Error fetching folders:", error);
    return [];
  }
}

export default async function HomePage() {
  const folders = await getFolders();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 opacity-60" />
        <div className="absolute top-1/2 -right-24 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10 opacity-40" />
        
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
            Professional <br /> Media Gallery
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed">
            A secure, Cloudinary-powered space for your most precious moments. 
            Organized elegantly, delivered at light speed.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Recent Albums</h2>
          <div className="h-px flex-1 mx-8 bg-gradient-to-r from-muted to-transparent hidden md:block" />
          <p className="text-muted-foreground font-medium">{folders.length} collections</p>
        </div>

        {folders.length === 0 ? (
          <div className="text-center py-32 bg-muted/20 rounded-3xl border-2 border-dashed border-muted/50">
            <p className="text-2xl font-semibold text-muted-foreground">Your gallery is waiting to be filled.</p>
            <p className="text-muted-foreground mt-3 text-lg">Head to the admin panel to upload your first collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {folders.map((folder: any) => (
              <AlbumCard
                key={folder.path}
                name={folder.name}
                path={folder.path}
                thumbnail={folder.thumbnail}
                count={folder.count}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
