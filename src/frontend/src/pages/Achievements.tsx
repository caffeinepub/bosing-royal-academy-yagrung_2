import { useQuery } from "@tanstack/react-query";
import { Award } from "lucide-react";
import PageBanner from "../components/PageBanner";
import { useActor } from "../hooks/useActor";

export default function Achievements() {
  const { actor } = useActor();
  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ["allAchievements"],
    queryFn: () => actor!.getAllAchievements(),
    enabled: !!actor,
  });

  return (
    <div>
      <PageBanner
        title="Achievements & Awards"
        subtitle="Our Pride & Excellence"
      />
      <div className="max-w-6xl mx-auto px-4 py-16">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : achievements.length === 0 ? (
          <div className="text-center py-16">
            <Award className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Achievements will be listed here.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((a) => (
              <div
                key={String(a.id)}
                className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-amber-600"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-1 rounded">
                    {a.category}
                  </span>
                  <span className="text-sm font-bold text-gray-500">
                    {String(a.year)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{a.title}</h3>
                <p className="text-sm text-gray-600">{a.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
