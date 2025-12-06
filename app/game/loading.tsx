export default function GameLoading() {
  return (
    <div className="min-h-screen bg-[#1C1C1C] pb-8 font-sans text-[#EBE8E1]">
      <main className="container mx-auto flex flex-col items-center justify-center px-4 py-6">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="h-8 w-2xl animate-pulse bg-gray-400" />
          <div className="h-4 w-40 animate-pulse bg-gray-300" />
        </div>

        <div className="relative aspect-square w-full max-w-[400px] border-4 border-[#F5F4F0] bg-[#1C1C1C] p-1 shadow-[8px_8px_0px_0px_rgba(28,28,28,1)]">
          <div className="grid h-full w-full grid-cols-6 gap-1 p-2">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-full bg-gray-300" />
            ))}
          </div>
        </div>

        <div className="mt-10 flex w-full max-w-md justify-between gap-4">
          <div className="h-12 w-full animate-pulse border-2 bg-[#1C1C1C]" />
          <div className="h-12 w-full animate-pulse border-2 bg-[#1C1C1C]" />
          <div className="h-12 w-full animate-pulse border-2 bg-[#1C1C1C]" />
        </div>
      </main>
    </div>
  );
}
