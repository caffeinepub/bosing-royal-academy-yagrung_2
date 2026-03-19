import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { navigate } from "../App";
import PageBanner from "../components/PageBanner";
import { useActor } from "../hooks/useActor";

function formatDate(ts: bigint | number) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function News() {
  const { actor } = useActor();
  const { data: news = [], isLoading } = useQuery({
    queryKey: ["publishedNews"],
    queryFn: () => actor!.getPublishedNews(),
    enabled: !!actor,
  });

  return (
    <div>
      <PageBanner
        title="News & Announcements"
        subtitle="Stay Updated with School News"
      />
      <div className="max-w-5xl mx-auto px-4 py-16">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : news.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              No news published yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {news.map((item) => (
              <article
                key={String(item.id)}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/news/${String(item.id)}`)}
                onKeyDown={(e) =>
                  e.key === "Enter" && navigate(`/news/${String(item.id)}`)
                }
              >
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-gray-300" />
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-500 mb-1">
                    {formatDate(item.date)} &bull; {item.author}
                  </p>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {item.content}
                  </p>
                  <button
                    type="button"
                    className="mt-3 text-sm font-semibold text-amber-700"
                  >
                    Read More →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
