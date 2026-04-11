import AlbumGrid from "@/components/AlbumGrid";
import cloudinary from "@/lib/cloudinary";
import { sortFolders } from "@/lib/config";

// Revalidate data every 60 seconds instead of force-dynamic to save Cloudinary API credits
export const revalidate = 60;

async function getFolders() {
  try {
    // 1. Fetch folders
    const { folders } = await cloudinary.api.root_folders();
    
    if (!folders || folders.length === 0) return [];

    const sortedFolders = sortFolders(folders);

    // 2. Fetch thumbnails only if needed, and with a slight delay or batching
    // For large galleries, this is where the rate limit usually hits.
    const foldersWithThumbnails = await Promise.all(
      sortedFolders.map(async (folder: any) => {
        try {
          const { resources, total_count } = await cloudinary.search
            .expression(`folder:"${folder.name}"`)
            .sort_by("public_id", "desc")
            .max_results(30)
            .execute();
          
          let firstItem = resources.find((r: any) => r.resource_type === "image") || resources[0];
          let thumbUrl = firstItem?.secure_url || null;

          // If the only item found is a video, convert its URL to a .jpg thumbnail
          // Cloudinary automatically generates image thumbnails for videos when extension is .jpg
          if (thumbUrl && firstItem?.resource_type === "video") {
            thumbUrl = thumbUrl.replace(/\.[^/.]+$/, ".jpg");
            // Sometimes cloudinary URLs already have an extension, if not we might need to append
            // But secure_url from cloudinary always has an extension (.mp4, .mov)
          }

          return {
            name: folder.name,
            path: folder.path,
            thumbnail: thumbUrl,
            count: total_count || resources.length,
          };
        } catch (innerError: any) {
          // If a single folder search fails (e.g. rate limit), return folder without thumbnail
          console.warn(`Warning: Could not fetch details for folder ${folder.name}:`, innerError.message);
          return {
            name: folder.name,
            path: folder.path,
            thumbnail: null,
            count: 0
          };
        }
      })
    );
    return foldersWithThumbnails;
  } catch (error: any) {
    console.error("Critical error fetching folders:", error.message);
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
          <AlbumGrid initialFolders={folders} />
        )}
      </section>
    </main>
  );
}
