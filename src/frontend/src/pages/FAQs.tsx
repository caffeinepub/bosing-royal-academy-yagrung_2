import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import PageBanner from "../components/PageBanner";
import { useActor } from "../hooks/useActor";

export default function FAQs() {
  const { actor } = useActor();
  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["publishedFAQs"],
    queryFn: () => actor!.getPublishedFAQs(),
    enabled: !!actor,
  });
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <PageBanner
        title="Frequently Asked Questions"
        subtitle="Answers to Common Questions"
      />
      <div className="max-w-3xl mx-auto px-4 py-16">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : faqs.length === 0 ? (
          <p className="text-center text-gray-500">No FAQs available yet.</p>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq) => {
              const id = String(faq.id);
              const isOpen = open === id;
              return (
                <div
                  key={id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    type="button"
                    className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={() => setOpen(isOpen ? null : id)}
                  >
                    {faq.question}
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-gray-600 text-sm border-t border-gray-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
