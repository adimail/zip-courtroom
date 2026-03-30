"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, X, Loader2, Image as ImageIcon, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useZoozoo, ZoozooItem } from "@/hooks/useZoozoo";
import Image from "next/image";

function parseDate(dateStr: string | null) {
  if (!dateStr) return new Date(0);
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const fullYear = year < 100 ? 2000 + year : year;
    return new Date(fullYear, month, day);
  }
  return new Date(dateStr);
}

function formatDate(dateStr: string | null) {
  const d = parseDate(dateStr);
  if (isNaN(d.getTime()) || d.getTime() === 0) return "Unknown Date";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function DifficultyDots({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const dotValue = (i + 1) * 2;
        let bgClass = "bg-gray-700";
        if (value >= dotValue) {
          bgClass = "bg-amber-500";
        } else if (value === dotValue - 1) {
          bgClass = "bg-[linear-gradient(to_right,#f59e0b_50%,#374151_50%)]";
        }
        return (
          <div key={i} className={cn("h-1.5 w-1.5 rounded-full transition-colors", bgClass)} />
        );
      })}
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const colors = [
    "bg-teal-900/30 text-teal-400 border-teal-900/50",
    "bg-pink-900/30 text-pink-400 border-pink-900/50",
    "bg-amber-900/30 text-amber-400 border-amber-900/50",
    "bg-blue-900/30 text-blue-400 border-blue-900/50",
    "bg-purple-900/30 text-purple-400 border-purple-900/50",
    "bg-emerald-900/30 text-emerald-400 border-emerald-900/50",
  ];

  const hash = type.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorClass = colors[hash % colors.length];

  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase",
        colorClass
      )}
    >
      {type}
    </span>
  );
}

function HoverSlideshow({ piece }: { piece: ZoozooItem }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = [...new Set([...piece.together, piece.mahi, piece.aditya].filter(Boolean))];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setImgIndex((prev) => (prev + 1) % images.length);
      }, 1200);
    } else {
      setImgIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  return (
    <div
      className="relative flex h-40 w-full items-center justify-center overflow-hidden bg-[#111]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.length > 0 ? (
        <>
          {images.map((src, idx) => (
            <Image
              key={src}
              src={src}
              alt={`${piece.title} image ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className={cn(
                "object-cover transition-all duration-500 group-hover:scale-105",
                idx === imgIndex ? "z-10 opacity-100" : "z-0 opacity-0"
              )}
              priority={idx === 0}
            />
          ))}
          {images.length > 1 && isHovered && (
            <div className="absolute right-0 bottom-2 left-0 z-20 flex justify-center gap-1">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all",
                    idx === imgIndex ? "w-2 bg-white" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <ImageIcon className="h-10 w-10 text-gray-700" />
      )}
    </div>
  );
}

function Card({ piece, onClick }: { piece: ZoozooItem; onClick: (p: ZoozooItem) => void }) {
  return (
    <div
      onClick={() => onClick(piece)}
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-800 bg-[#1C1C1C] transition-all duration-200 hover:border-amber-500 hover:shadow-xl hover:shadow-black/50"
    >
      <HoverSlideshow piece={piece} />
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <span className="font-serif text-sm font-bold text-[#EBE8E1] capitalize">
            {piece.title}
          </span>
          <TypeBadge type={piece.type} />
        </div>
        <div className="mb-3 flex items-center gap-2 text-[10px] text-gray-500">
          <span>{formatDate(piece.date)}</span>
          <span>·</span>
          <span>⏱ {piece.foldingTime}</span>
        </div>
        <DifficultyDots value={piece.difficulty} />
        {piece.note ? (
          <div className="mt-3 line-clamp-1 border-t border-gray-800 pt-3 text-[10px] leading-relaxed text-gray-400 italic">
            "{piece.note}"
          </div>
        ) : (
          <div className="mt-3 line-clamp-1 border-t border-gray-800 pt-3 text-[10px] leading-relaxed text-gray-600 italic">
            No note
          </div>
        )}
      </div>
    </div>
  );
}

function DetailModal({ piece, onClose }: { piece: ZoozooItem; onClose: () => void }) {
  if (!piece) return null;

  const images = [...new Set([...piece.together, piece.mahi, piece.aditya].filter(Boolean))];

  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (images.length > 1) {
      interval = setInterval(() => {
        setImgIndex((prev) => (prev + 1) % images.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-in fade-in zoom-in-95 w-full max-w-md overflow-hidden rounded-2xl border border-gray-800 bg-[#1C1C1C] shadow-2xl duration-200"
      >
        <div className="relative flex h-56 items-center justify-center bg-[#111]">
          {images.length > 0 ? (
            images.map((src, idx) => (
              <Image
                key={src}
                src={src}
                alt={`${piece.title} image ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className={cn(
                  "object-cover transition-opacity duration-500",
                  idx === imgIndex ? "z-10 opacity-100" : "z-0 opacity-0"
                )}
                priority={idx === 0}
              />
            ))
          ) : (
            <ImageIcon className="h-12 w-12 text-gray-700" />
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/40 text-[#EBE8E1] backdrop-blur-md transition-colors hover:bg-black/60"
          >
            <X className="h-4 w-4" />
          </button>

          {images.length > 1 && (
            <div className="absolute right-0 bottom-3 left-0 z-20 flex justify-center gap-1.5">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all",
                    idx === imgIndex ? "w-3 bg-white" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <div className="font-serif text-xl font-bold text-[#EBE8E1] capitalize">
                {piece.title}
              </div>
              <div className="mt-1 text-xs text-gray-500">{formatDate(piece.date)}</div>
            </div>
            <TypeBadge type={piece.type} />
          </div>

          <div className="mb-5 grid grid-cols-2 gap-4 border-y border-gray-800 py-4">
            <div>
              <div className="mb-1.5 text-[9px] font-bold tracking-widest text-gray-500 uppercase">
                Difficulty
              </div>
              <DifficultyDots value={piece.difficulty} />
            </div>
            <div>
              <div className="mb-1.5 text-[9px] font-bold tracking-widest text-gray-500 uppercase">
                Folding Time
              </div>
              <div className="text-sm font-medium text-[#EBE8E1]">{piece.foldingTime}</div>
            </div>
          </div>

          {piece.note && (
            <div>
              <div className="mb-2 text-[9px] font-bold tracking-widest text-gray-500 uppercase">
                Origami Notes
              </div>
              <div className="text-xs leading-relaxed text-gray-300 italic">"{piece.note}"</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PraniSangrahaly({ onBackAction }: { onBackAction: () => void }) {
  const { data = [], isLoading, isError, refetch, isFetching } = useZoozoo();

  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState<ZoozooItem | null>(null);

  const types = useMemo(() => {
    const uniqueTypes = new Set(data.map((p) => p.type).filter(Boolean));
    return ["All", ...Array.from(uniqueTypes)];
  }, [data]);

  const filtered = useMemo(() => {
    return data
      .filter((p) => filter === "All" || p.type === filter)
      .sort((a, b) => {
        if (sort === "newest") return parseDate(b.date).getTime() - parseDate(a.date).getTime();
        if (sort === "oldest") return parseDate(a.date).getTime() - parseDate(b.date).getTime();
        if (sort === "hardest") return b.difficulty - a.difficulty;
        if (sort === "quickest") return a.foldingTime.localeCompare(b.foldingTime);
        return 0;
      });
  }, [data, filter, sort]);

  const totalMinutes = useMemo(() => {
    return data.reduce((acc, p) => {
      const match = p.foldingTime.match(/(\d+)h\s*(\d+)?m?|(\d+)\s*min|(\d+):(\d+)/);
      if (!match) return acc;
      if (match[1]) return acc + parseInt(match[1]) * 60 + (parseInt(match[2]) || 0);
      if (match[3]) return acc + parseInt(match[3]);
      if (match[4]) return acc + parseInt(match[4]) * 60 + parseInt(match[5]);
      return acc;
    }, 0);
  }, [data]);

  const totalTime =
    totalMinutes >= 60
      ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
      : `${totalMinutes}m`;

  const avgDifficulty = data.length
    ? (data.reduce((a, p) => a + p.difficulty, 0) / data.length).toFixed(1)
    : "—";

  const startDate = data.length
    ? new Date(Math.min(...data.map((p) => parseDate(p.date).getTime()))).toLocaleDateString(
        "en-IN",
        { month: "short", year: "numeric" }
      )
    : "—";

  return (
    <div className="min-h-screen bg-[#161616] p-4 font-sans text-[#EBE8E1] md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBackAction}
            className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-500 uppercase transition-colors hover:text-amber-500 md:text-xs"
          >
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" /> Back to Court
          </button>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 rounded-full border border-gray-800 bg-[#1C1C1C] px-3 py-1.5 text-[10px] font-bold tracking-widest text-gray-500 uppercase transition-all hover:border-amber-500 hover:text-amber-500 disabled:opacity-50"
          >
            <RefreshCw className={cn("h-3 w-3", isFetching && "animate-spin")} />
            {isFetching ? "Syncing..." : "Refresh"}
          </button>
        </div>

        <div className="mb-6 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#EBE8E1] md:text-4xl">
              प्राणी संग्रहालय
            </h1>
          </div>
          <div className="mt-4 text-[10px] font-bold tracking-widest text-gray-500 uppercase md:mt-0 md:text-xs">
            {data.length} piece{data.length !== 1 ? "s" : ""} in collection
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="mb-4 h-8 w-8 animate-spin" />
            <p className="text-[10px] font-bold tracking-widest uppercase md:text-xs">
              Unfolding collection...
            </p>
          </div>
        ) : isError ? (
          <div className="py-20 text-center text-red-500">
            <p className="text-[10px] font-bold tracking-widest uppercase md:text-xs">
              Error loading collection
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col justify-between gap-4 rounded-lg border border-gray-800 bg-[#1C1C1C] p-3 md:flex-row md:items-center md:p-4">
              <div className="flex flex-wrap gap-2">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={cn(
                      "cursor-pointer rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all duration-200",
                      filter === t
                        ? "border-amber-600 bg-amber-600/10 text-amber-500"
                        : "border-gray-800 bg-transparent text-gray-500 hover:border-gray-600 hover:text-gray-300"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                  Sort
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="cursor-pointer rounded-md border border-gray-800 bg-[#2A2A2A] px-2 py-1.5 text-[10px] font-bold text-[#EBE8E1] uppercase focus:border-amber-500 focus:outline-none"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="hardest">Hardest first</option>
                  <option value="quickest">Quickest first</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="py-20 text-center text-sm tracking-widest text-gray-500 uppercase">
                No pieces found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
                <AnimatePresence>
                  {filtered.map((piece) => (
                    <motion.div
                      key={piece.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card piece={piece} onClick={setSelected} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selected && <DetailModal piece={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
