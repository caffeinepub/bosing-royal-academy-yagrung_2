import { useQuery } from "@tanstack/react-query";
import PageBanner from "../components/PageBanner";
import { useActor } from "../hooks/useActor";

export default function Admissions() {
  const { actor } = useActor();
  const { data: info } = useQuery({
    queryKey: ["admissionInfo"],
    queryFn: () => actor!.getAdmissionInfo(),
    enabled: !!actor,
  });

  return (
    <div>
      <PageBanner title="Admissions" subtitle="Join Our School Community" />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <h2 className="font-serif text-xl font-bold uppercase text-gray-900 mb-4">
              Admission Process
            </h2>
            <div className="w-12 h-1 bg-amber-600 mb-6" />
            <div className="text-gray-700 whitespace-pre-line">
              {info?.processSteps ||
                "1. Pick up the application form from the school office\n2. Complete and submit the form with required documents\n3. Attend the entrance assessment (if applicable)\n4. Interview with school administration\n5. Receive admission confirmation"}
            </div>
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold uppercase text-gray-900 mb-4">
              Requirements
            </h2>
            <div className="w-12 h-1 bg-amber-600 mb-6" />
            <div className="text-gray-700 whitespace-pre-line">
              {info?.requirements ||
                "• Birth certificate\n• Previous school transfer certificate\n• Report cards from last 2 years\n• Passport-sized photographs\n• Parent/guardian identity documents"}
            </div>
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold uppercase text-gray-900 mb-4">
              Fee Structure
            </h2>
            <div className="w-12 h-1 bg-amber-600 mb-6" />
            <div className="text-gray-700 whitespace-pre-line">
              {info?.fees ||
                "Please contact the school office for current fee structure and any available scholarships or financial assistance programs."}
            </div>
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold uppercase text-gray-900 mb-4">
              Contact Admissions
            </h2>
            <div className="w-12 h-1 bg-amber-600 mb-6" />
            <div className="text-gray-700 whitespace-pre-line">
              {info?.contact ||
                "Admissions Office\nBosing Royal Academy Yagrung\nPhone: +975-XXXX-XXXX\nEmail: admissions@bosing-royal-academy.edu.bt\n\nOffice Hours: Monday-Friday, 9 AM - 4 PM"}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
