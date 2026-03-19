import { useQuery } from "@tanstack/react-query";
import PageBanner from "../components/PageBanner";
import { useActor } from "../hooks/useActor";

export default function About() {
  const { actor } = useActor();
  const { data: siteInfo } = useQuery({
    queryKey: ["siteInfo"],
    queryFn: () => actor!.getSiteInfo(),
    enabled: !!actor,
  });

  return (
    <div>
      <PageBanner title="About Us" subtitle="Our History, Vision & Mission" />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 uppercase mb-4">
            About the School
          </h2>
          <div className="w-12 h-1 bg-amber-600 mb-6" />
          <p className="text-gray-700 leading-relaxed text-lg">
            {siteInfo?.about ||
              "Bosing Royal Academy Yagrung is a prestigious educational institution dedicated to nurturing young minds with quality education, moral values, and a strong foundation for future success. Our school has been a beacon of learning in the Yagrung community."}
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded">
            <h3 className="font-serif text-xl font-bold text-gray-900 uppercase mb-3">
              Our Vision
            </h3>
            <p className="text-gray-700">
              To be a centre of excellence that produces globally competent
              citizens with strong Bhutanese values and a commitment to lifelong
              learning.
            </p>
          </div>
          <div className="bg-blue-50 border-l-4 border-navy p-6 rounded">
            <h3 className="font-serif text-xl font-bold text-gray-900 uppercase mb-3">
              Our Mission
            </h3>
            <p className="text-gray-700">
              To provide quality holistic education that develops intellectual,
              physical, social, and spiritual dimensions of every student.
            </p>
          </div>
        </div>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 uppercase mb-4">
            Core Values
          </h2>
          <div className="w-12 h-1 bg-amber-600 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Excellence",
              "Integrity",
              "Respect",
              "Innovation",
              "Compassion",
              "Discipline",
            ].map((v) => (
              <div key={v} className="bg-gray-50 rounded p-4 text-center">
                <div className="font-semibold text-gray-900">{v}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
