import { useQuery } from "@tanstack/react-query";
import PageBanner from "../components/PageBanner";
import { useActor } from "../hooks/useActor";

export default function PrincipalsMessage() {
  const { actor } = useActor();
  const { data: siteInfo } = useQuery({
    queryKey: ["siteInfo"],
    queryFn: () => actor!.getSiteInfo(),
    enabled: !!actor,
  });

  const message =
    siteInfo?.principalMessage ||
    "Welcome to Bosing Royal Academy Yagrung. We are committed to providing our students with the finest education, helping them grow into responsible citizens of Bhutan and the world.\n\nOur dedicated faculty and staff work tirelessly to create a nurturing environment where every student can thrive academically, socially, and emotionally.\n\nWe invite you to be part of our school community and join us in our journey of learning and excellence.";

  const paragraphs = message.split("\n").filter(Boolean);

  return (
    <div>
      <PageBanner
        title="Principal's Message"
        subtitle="A Word From Our Leader"
      />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0">
            <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-4xl text-gray-400">&#128100;</span>
            </div>
            <div className="text-center mt-4">
              <p className="font-bold text-gray-900">
                {siteInfo?.principalName || "The Principal"}
              </p>
              <p className="text-sm text-gray-500">Principal</p>
              <p className="text-xs text-gray-400">
                Bosing Royal Academy Yagrung
              </p>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-2xl font-bold text-gray-900 uppercase mb-4">
              Message from the Principal
            </h2>
            <div className="w-12 h-1 bg-amber-600 mb-6" />
            <div className="text-gray-700 leading-relaxed space-y-4">
              {paragraphs.map((para) => (
                <p key={para.slice(0, 30)}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
