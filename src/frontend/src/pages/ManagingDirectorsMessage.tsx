import PageBanner from "../components/PageBanner";

export default function ManagingDirectorsMessage() {
  const message = `On behalf of the management and staff of Bosing Royal Academy Yagrung, I extend a warm welcome to all students, parents, and well-wishers of our institution.

As Managing Director, my commitment is to ensure that the operational and strategic foundation of this academy enables every student to receive a world-class education grounded in Bhutanese values and Gross National Happiness principles.

We have invested deeply in qualified teachers, modern learning resources, and a safe, supportive campus environment. We continuously review and upgrade our programmes to keep pace with the evolving educational landscape, ensuring our graduates are well-prepared for higher education and productive careers.

School growth is not measured only in enrolment numbers, but in the growth of each student's character, knowledge, and confidence. I am proud of the strides we have made and remain focused on raising the bar for quality education in our region.

I am grateful to our dedicated staff, supportive parents, and inspiring students who make Bosing Royal Academy Yagrung a truly exceptional place to learn and grow. Let us continue this journey together.`;

  const paragraphs = message.split("\n").filter(Boolean);

  return (
    <div>
      <PageBanner
        title="Message from Managing Director"
        subtitle="Management Vision & School Growth"
      />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0">
            <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-4xl text-gray-400">&#128100;</span>
            </div>
            <div className="text-center mt-4">
              <p className="font-bold text-gray-900">The Managing Director</p>
              <p className="text-sm text-gray-500">Managing Director</p>
              <p className="text-xs text-gray-400">
                Bosing Royal Academy Yagrung
              </p>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-2xl font-bold text-gray-900 uppercase mb-4">
              Message from the Managing Director
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
