import PageBanner from "../components/PageBanner";

export default function ChairmansDeskPage() {
  const message = `It is my great honour and privilege to welcome you to Bosing Royal Academy Yagrung. As Chairman, I envision this institution to be a beacon of academic excellence, moral integrity, and cultural pride for the people of Bhutan.

Our academy stands on the pillars of discipline, innovation, and compassion. We believe that education is not merely the transfer of knowledge, but the holistic development of every young mind entrusted to our care. Every child who walks through our doors deserves the best opportunity to discover their potential and contribute meaningfully to society.

We are deeply committed to building an environment where students are inspired to think critically, lead with courage, and act with kindness. The support of our parents, community, and the nation gives us the strength to pursue this noble mission.

I look forward to walking this journey of excellence with you — our students, parents, and fellow educators. Together, we shall build a brighter future for Yagrung and Bhutan.`;

  const paragraphs = message.split("\n").filter(Boolean);

  return (
    <div>
      <PageBanner
        title="From the Desk of Chairman"
        subtitle="Leadership Vision & Commitment to Excellence"
      />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0">
            <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-4xl text-gray-400">&#128100;</span>
            </div>
            <div className="text-center mt-4">
              <p className="font-bold text-gray-900">The Chairman</p>
              <p className="text-sm text-gray-500">Chairman</p>
              <p className="text-xs text-gray-400">
                Bosing Royal Academy Yagrung
              </p>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-2xl font-bold text-gray-900 uppercase mb-4">
              From the Desk of Chairman
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
