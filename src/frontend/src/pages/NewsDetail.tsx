import { useQuery } from "@tanstack/react-query";
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

export default function NewsDetail({ id }: { id: string }) {
  const { actor } = useActor();
  const { data: article, isLoading } = useQuery({
    queryKey: ["news", id],
    queryFn: () => actor!.getNews(BigInt(id)),
    enabled: !!actor && !!id,
  });

  if (isLoading)
    return <div className="p-16 text-center text-gray-500">Loading...</div>;
  if (!article)
    return (
      <div className="p-16 text-center text-gray-500">
        Article not found.{" "}
        <button
          type="button"
          onClick={() => navigate("/news")}
          className="text-amber-700 underline"
        >
          Back to News
        </button>
      </div>
    );

  return (
    <div>
      <PageBanner title={article.title} subtitle={formatDate(article.date)} />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-sm text-gray-500 mb-6">
          By {article.author} &bull; {formatDate(article.date)}
        </p>
        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
          {article.content}
        </div>
        <button
          type="button"
          onClick={() => navigate("/news")}
          className="mt-10 text-sm font-semibold text-amber-700"
        >
          ← Back to News
        </button>
      </div>
    </div>
  );
}
