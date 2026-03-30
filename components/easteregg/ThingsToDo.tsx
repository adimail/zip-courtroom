"use client";

import { useState, useMemo } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MapPin,
  MessageSquare,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useActivities } from "@/hooks/useActivities";

function parseDate(dateStr?: string | null) {
  if (!dateStr || dateStr.trim() === "" || dateStr === "TBD") return new Date(0);
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = 2000 + parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(0);
}

export function ThingsToDo({ onBackAction }: { onBackAction: () => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: activities, isLoading, isError, refetch, isFetching } = useActivities();

  const sortedActivities = useMemo(() => {
    if (!activities) return [];
    return [...activities].sort((a, b) => {
      const dateA = parseDate(a.date).getTime();
      const dateB = parseDate(b.date).getTime();
      return dateB - dateA;
    });
  }, [activities]);

  const filedCount = sortedActivities.length;
  const doneCount = sortedActivities.filter((a) => a.status).length;

  return (
    <div className="min-h-screen bg-[#161616] p-3 font-sans text-[#EBE8E1] md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between md:mb-6">
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

        <div className="mb-6 flex items-end justify-between border-b border-gray-800 pb-4 md:mb-8 md:pb-6">
          <div>
            <div className="mb-1 text-[8px] font-bold tracking-[0.2em] text-gray-500 uppercase md:mb-2 md:text-[10px]">
              Official Records
            </div>
            <h1 className="text-xl font-bold text-white md:text-3xl">Activity Docket</h1>
          </div>
          <div className="flex gap-4 text-right md:gap-6">
            <div>
              <div className="text-lg font-bold text-amber-500 md:text-2xl">{filedCount}</div>
              <div className="text-[8px] font-bold tracking-widest text-gray-500 uppercase md:text-[10px]">
                Filed
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-500 md:text-2xl">{doneCount}</div>
              <div className="text-[8px] font-bold tracking-widest text-gray-500 uppercase md:text-[10px]">
                Done
              </div>
            </div>
          </div>
        </div>

        <div className="relative ml-1 pl-6 md:ml-4 md:pl-10">
          <div className="absolute top-4 bottom-0 left-0 w-px bg-gray-800" />

          {isLoading || isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader2 className="mb-4 h-6 w-6 animate-spin md:h-8 md:w-8" />
              <p className="text-[10px] font-bold tracking-widest uppercase md:text-xs">
                Retrieving Docket...
              </p>
            </div>
          ) : isError ? (
            <div className="py-20 text-center text-red-500">
              <p className="text-[10px] font-bold tracking-widest uppercase md:text-xs">
                Error loading records
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 md:gap-4">
              {sortedActivities.map((activity) => {
                const isExpanded = expandedId === activity.id;
                const isDone = activity.status;
                const displayDate = activity.date || "not logged";
                const hasAditya = !!activity.adityaComment;
                const hasMahi = !!activity.mahiComment;

                return (
                  <div key={activity.id} className="relative">
                    <div
                      className={cn(
                        "absolute top-5 -left-6 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 md:top-6 md:-left-10 md:h-3 md:w-3",
                        isDone ? "border-green-500 bg-green-500" : "border-amber-600 bg-[#161616]"
                      )}
                    />

                    <div
                      onClick={() => setExpandedId(isExpanded ? null : activity.id)}
                      className={cn(
                        "cursor-pointer overflow-hidden rounded-md border bg-[#1C1C1C] transition-colors",
                        isExpanded ? "border-amber-500" : "border-gray-800 hover:border-gray-600"
                      )}
                    >
                      <div className="flex items-center justify-between p-3 md:p-5">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-white capitalize md:text-lg">
                            {activity.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "rounded-full border px-1.5 py-0.5 text-[8px] font-bold tracking-widest uppercase md:px-2 md:py-1 md:text-[10px]",
                              isDone
                                ? "border-green-900/50 bg-green-900/20 text-green-500"
                                : "border-amber-900/50 bg-amber-900/20 text-amber-500"
                            )}
                          >
                            {isDone ? "Done" : "Pending"}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5 text-gray-500 md:h-4 md:w-4" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-gray-500 md:h-4 md:w-4" />
                          )}
                        </div>
                      </div>

                      <AnimatePresence initial={false} mode="wait">
                        {!isExpanded ? (
                          <motion.div
                            key="collapsed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1, ease: "linear" }}
                            className="flex items-center justify-between px-3 pb-3 md:px-5 md:pb-5"
                          >
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="flex items-center gap-1 text-[10px] text-gray-400 md:text-xs">
                                <span>📅</span> {displayDate}
                              </div>
                              {activity.location && (
                                <div className="flex items-center gap-1 text-[10px] text-gray-400 md:text-xs">
                                  <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                  <span className="max-w-[80px] truncate md:max-w-none">
                                    {activity.location}
                                  </span>
                                </div>
                              )}
                              {activity.notes && (
                                <div className="flex items-center gap-1 text-[10px] text-gray-400 md:text-xs">
                                  <MessageSquare className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                  <span className="max-w-[80px] truncate md:max-w-none">
                                    {activity.notes}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {hasAditya && (
                                <div className="flex h-4 w-4 items-center justify-center rounded-full border border-[#4f46e5]/30 bg-[#4f46e5]/20 text-[6px] font-bold text-[#818cf8] md:h-5 md:w-5 md:text-[7px]">
                                  AD
                                </div>
                              )}
                              {hasMahi && (
                                <div className="flex h-4 w-4 items-center justify-center rounded-full border border-[#10b981]/30 bg-[#10b981]/20 text-[6px] font-bold text-[#34d399] md:h-5 md:w-5 md:text-[7px]">
                                  MH
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="expanded"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-gray-800 p-3 md:p-5">
                              <div className="grid grid-cols-[60px_1fr] gap-y-4 text-xs md:grid-cols-[100px_1fr] md:gap-y-5 md:text-sm">
                                <div className="text-[9px] tracking-widest text-gray-500 uppercase md:text-xs">
                                  Filed
                                </div>
                                <div className="text-amber-500">{displayDate}</div>

                                {activity.notes && (
                                  <>
                                    <div className="text-[9px] tracking-widest text-gray-500 uppercase md:text-xs">
                                      Details
                                    </div>
                                    <div className="text-gray-400 italic">{activity.notes}</div>
                                  </>
                                )}

                                {activity.location && (
                                  <>
                                    <div className="text-[9px] tracking-widest text-gray-500 uppercase md:text-xs">
                                      Location
                                    </div>
                                    <div className="text-gray-400 italic">{activity.location}</div>
                                  </>
                                )}

                                {(activity.adityaComment || activity.mahiComment) && (
                                  <div className="col-span-2 mt-1 space-y-3 md:mt-2">
                                    {activity.adityaComment && (
                                      <div className="flex gap-2 md:gap-3">
                                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#4f46e5]/20 text-[8px] font-bold text-[#818cf8] md:h-6 md:w-6 md:text-[9px]">
                                          AD
                                        </div>
                                        <div className="text-xs text-gray-300 md:text-sm">
                                          "{activity.adityaComment}"
                                        </div>
                                      </div>
                                    )}
                                    {activity.mahiComment && (
                                      <div className="flex gap-2 md:gap-3">
                                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10b981]/20 text-[8px] font-bold text-[#34d399] md:h-6 md:w-6 md:text-[9px]">
                                          MH
                                        </div>
                                        <div className="text-xs text-gray-300 md:text-sm">
                                          "{activity.mahiComment}"
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <footer className="mt-8 border-t border-gray-800 pt-6 pb-10 text-center md:mt-12 md:pt-8 md:pb-12">
          <p className="mb-2 text-[8px] font-bold tracking-[0.2em] text-gray-500 uppercase md:mb-3 md:text-[10px]">
            Administrative Access
          </p>
          <a
            href="https://docs.google.com/spreadsheets/d/1YQ2xoLyN4pXqhuicquJZGWbV6x7wy8vqeCQ5FT05g_0/edit?gid=1509880777#gid=1509880777"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-md border border-gray-800 bg-[#1C1C1C] px-3 py-1.5 text-[9px] font-medium text-gray-400 transition-all hover:border-amber-500 hover:text-amber-500 md:px-4 md:py-2 md:text-xs"
          >
            Edit Source Sheet
            <ExternalLink className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:h-3 md:w-3" />
          </a>
        </footer>
      </div>
    </div>
  );
}
