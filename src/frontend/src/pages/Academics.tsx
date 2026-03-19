import PageBanner from "../components/PageBanner";

export default function Academics() {
  return (
    <div>
      <PageBanner title="Academics" subtitle="Programs & Curriculum" />
      <div className="max-w-5xl mx-auto px-4 py-16">
        <p className="text-gray-700 text-lg leading-relaxed mb-12">
          Bosing Royal Academy Yagrung offers a comprehensive curriculum aligned
          with the Royal Government of Bhutan's educational framework, focusing
          on holistic development and academic excellence.
        </p>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {[
            {
              level: "Primary (Classes PP-VI)",
              desc: "Foundation years building literacy, numeracy, and curiosity through interactive learning.",
            },
            {
              level: "Middle School (Classes VII-VIII)",
              desc: "Deepening knowledge across core subjects with introduction to science, technology, and social studies.",
            },
            {
              level: "Secondary (Classes IX-X)",
              desc: "Rigorous preparation for Board Examinations with specialized subject streams.",
            },
            {
              level: "Higher Secondary (Classes XI-XII)",
              desc: "Advanced studies in Science, Commerce, and Arts streams, preparing students for university.",
            },
          ].map(({ level, desc }) => (
            <div
              key={level}
              className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm"
            >
              <h3 className="font-serif font-bold text-gray-900 text-lg mb-2">
                {level}
              </h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 uppercase mb-4">
            Co-Curricular Activities
          </h2>
          <div className="w-12 h-1 bg-amber-600 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Sports & Athletics",
              "Cultural Arts",
              "Debate & Public Speaking",
              "Science Club",
              "Environmental Club",
              "Music & Drama",
              "Community Service",
              "IT Club",
            ].map((a) => (
              <div
                key={a}
                className="bg-amber-50 rounded p-3 text-sm text-center font-medium text-amber-900"
              >
                {a}
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 uppercase mb-4">
            Assessment & Evaluation
          </h2>
          <div className="w-12 h-1 bg-amber-600 mb-6" />
          <p className="text-gray-700">
            We follow the Bhutan Board of Examinations guidelines for continuous
            and comprehensive evaluation, ensuring every student is assessed
            fairly and holistically.
          </p>
        </section>
      </div>
    </div>
  );
}
