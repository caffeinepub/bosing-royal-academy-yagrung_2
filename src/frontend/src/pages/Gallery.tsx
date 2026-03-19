import { useQuery } from "@tanstack/react-query";
import { Image } from "lucide-react";
import { useState } from "react";
import type { GalleryItem } from "../backend";
import PageBanner from "../components/PageBanner";
import { useActor } from "../hooks/useActor";

export default function Gallery() {
  const { actor } = useActor();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["galleryItems"],
    queryFn: () => actor!.getAllGalleryItems(),
    enabled: !!actor,
  });
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(
      new Set(items.map((i: GalleryItem) => i.category).filter(Boolean)),
    ),
  ];
  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((i: GalleryItem) => i.category === activeCategory);

  return (
    <div>
      <PageBanner title="Gallery" subtitle="Our School in Pictures" />
      <div className="max-w-7xl mx-auto px-4 py-16">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <Image className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Gallery photos will appear here.</p>
          </div>
        ) : (
          <>
            {categories.length > 1 && (
              <div className="flex gap-2 flex-wrap mb-8">
                {categories.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                      activeCategory === c
                        ? "bg-amber-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item: GalleryItem) => (
                <div
                  key={String(item.id)}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={item.blob.getDirectURL()}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
