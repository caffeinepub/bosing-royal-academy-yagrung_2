import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import PageBanner from "../components/PageBanner";
import { useActor } from "../hooks/useActor";

function formatDate(ts: bigint | number) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Events() {
  const { actor } = useActor();
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["publishedEvents"],
    queryFn: () => actor!.getPublishedEvents(),
    enabled: !!actor,
  });

  return (
    <div>
      <PageBanner title="Events" subtitle="Upcoming School Events" />
      <div className="max-w-5xl mx-auto px-4 py-16">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No upcoming events at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((ev) => (
              <div
                key={String(ev.id)}
                className="bg-white rounded-lg shadow-sm p-6 flex gap-6 items-start"
              >
                <div className="bg-navy text-white text-center rounded p-3 min-w-16">
                  <div className="text-xs font-medium">
                    {new Date(Number(ev.date) / 1_000_000).toLocaleString(
                      "default",
                      { month: "short" },
                    )}
                  </div>
                  <div className="text-2xl font-bold">
                    {new Date(Number(ev.date) / 1_000_000).getDate()}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {ev.title}
                  </h3>
                  <p className="text-sm text-amber-700 mb-2">
                    {formatDate(ev.date)} &bull; {ev.location}
                  </p>
                  <p className="text-gray-600">{ev.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
