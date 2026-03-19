import { useQuery } from "@tanstack/react-query";
import PageBanner from "../components/PageBanner";
import { useActor } from "../hooks/useActor";

export default function Contact() {
  const { actor } = useActor();
  const { data: siteInfo } = useQuery({
    queryKey: ["siteInfo"],
    queryFn: () => actor!.getSiteInfo(),
    enabled: !!actor,
  });

  return (
    <div>
      <PageBanner title="Contact Us" subtitle="Get in Touch" />
      <div className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-serif text-2xl font-bold uppercase text-gray-900 mb-4">
            School Address
          </h2>
          <div className="w-12 h-1 bg-amber-600 mb-6" />
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400 mb-1">
                Address
              </p>
              <p className="text-gray-700">
                {siteInfo?.address || "Yagrung, Bhutan"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400 mb-1">
                Phone
              </p>
              <p className="text-gray-700">
                {siteInfo?.phone || "+975-XXXX-XXXX"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400 mb-1">
                Email
              </p>
              <p className="text-gray-700">
                {siteInfo?.email || "info@bosing-royal-academy.edu.bt"}
              </p>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="font-semibold text-gray-900 mb-2">Office Hours</h3>
            <p className="text-sm text-gray-600">
              Monday - Friday: 8:00 AM - 4:00 PM
            </p>
            <p className="text-sm text-gray-600">
              Saturday: 8:00 AM - 12:00 PM
            </p>
            <p className="text-sm text-gray-600">Sunday & Holidays: Closed</p>
          </div>
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold uppercase text-gray-900 mb-4">
            Send a Message
          </h2>
          <div className="w-12 h-1 bg-amber-600 mb-6" />
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Message sent! We will get back to you soon.");
            }}
          >
            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label
                htmlFor="contact-subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Subject"
                required
              />
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                rows={5}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Your message..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-amber-600 text-white font-semibold rounded hover:bg-amber-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
