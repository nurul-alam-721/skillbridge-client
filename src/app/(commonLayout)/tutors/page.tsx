"use client";

import { Search, SlidersHorizontal, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTutors } from "@/hooks/userTutors";
import { TutorsFilter } from "@/components/modules/tutor/TutorsFilter";
import { TutorCardSkeleton } from "@/components/modules/tutor/TutorCardSkeleton";
import { TutorCard } from "@/components/modules/tutor/TutorCard";

const SORT_OPTIONS = [
  { label: "Top rated", value: "rating" },
  { label: "Price: Low to high", value: "price_asc" },
  { label: "Price: High to low", value: "price_desc" },
  { label: "Most reviews", value: "reviews" },
  { label: "Most experienced", value: "experience" },
];

const fadedShadow = {
  boxShadow: [
    "0 1px 2px rgba(0,0,0,0.04)",
    "0 4px 8px rgba(0,0,0,0.04)",
    "0 10px 20px rgba(0,0,0,0.04)",
    "0 20px 40px rgba(0,0,0,0.04)",
  ].join(", "),
};

export default function TutorsPage() {
  const {
    tutors,
    categories,
    total,
    loading,
    filters,
    search,
    sort,
    totalPages,
    setSearch,
    setSort,
    updateFilters,
    resetFilters,
  } = useTutors();
console.log("TutorsPage render", { tutors, categories, total, loading, filters, search, sort });
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Find a tutor
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Tutors</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {total > 0
              ? `${total} tutors available`
              : "Explore our expert tutors"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl"
            />
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-52 h-10 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mobile filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="sm:hidden h-10 rounded-xl gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl pb-8">
              <SheetHeader className="mb-5">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <TutorsFilter
                categories={categories}
                filters={filters}
                onChange={updateFilters}
                onReset={resetFilters}
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden sm:block w-56 shrink-0">
            <div
              className="sticky top-6 rounded-2xl border bg-card p-5"
              style={fadedShadow}
            >
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-semibold">Filters</p>
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
              <TutorsFilter
                categories={categories}
                filters={filters}
                onChange={updateFilters}
                onReset={resetFilters}
              />
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <TutorCardSkeleton key={i} />
                ))}
              </div>
            ) : tutors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <BookOpen className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="font-semibold">No tutors found</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="rounded-xl"
                >
                  Reset filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {tutors.map((tutor) => (
                    <TutorCard key={tutor.id} tutor={tutor} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-10">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      disabled={filters.page === 1}
                      onClick={() =>
                        updateFilters({ page: (filters.page ?? 1) - 1 })
                      }
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {filters.page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      disabled={filters.page === totalPages}
                      onClick={() =>
                        updateFilters({ page: (filters.page ?? 1) + 1 })
                      }
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
