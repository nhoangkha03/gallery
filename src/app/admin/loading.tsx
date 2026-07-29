export default function AdminLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <div className="flex items-center gap-3 rounded-2xl border bg-background px-5 py-4 shadow-sm">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
        <span className="font-semibold">Đang chuẩn bị khu vực quản trị...</span>
      </div>
    </main>
  );
}
