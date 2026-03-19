import PageBanner from "../components/PageBanner";

export default function StudentLife() {
  return (
    <div>
      <PageBanner title="Student Life" subtitle="Experience, Grow, Thrive" />
      <div className="max-w-5xl mx-auto px-4 py-16">
        <p className="text-gray-700 text-lg leading-relaxed mb-12">
          Life at Bosing Royal Academy Yagrung extends beyond the classroom. We
          believe in nurturing well-rounded individuals through diverse
          activities and experiences.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Sports & Athletics",
              desc: "We offer a wide range of sports including archery, football, basketball, and athletics. Annual sports days celebrate our students' physical achievements.",
            },
            {
              title: "Cultural Activities",
              desc: "Regular cultural events, dances, and festivals keep our Bhutanese heritage alive and help students appreciate their roots.",
            },
            {
              title: "Clubs & Societies",
              desc: "From Science Club to Debate Society, students have numerous opportunities to pursue their interests and develop leadership skills.",
            },
            {
              title: "Community Service",
              desc: "We instill a sense of responsibility through community service projects, environmental drives, and social initiatives.",
            },
            {
              title: "Arts & Crafts",
              desc: "Creative arts programs allow students to express themselves and develop aesthetic sensibilities through painting, drama, and traditional crafts.",
            },
            {
              title: "Health & Wellness",
              desc: "Regular health checkups, nutritional guidance, and wellness programs ensure our students are physically and mentally healthy.",
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm"
            >
              <h3 className="font-serif font-bold text-gray-900 text-lg mb-2 text-amber-800">
                {title}
              </h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
