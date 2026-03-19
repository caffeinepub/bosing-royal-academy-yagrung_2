import { useQuery } from "@tanstack/react-query";
import { BookOpen, Calendar, ChevronRight, Image, Users } from "lucide-react";
import { navigate } from "../App";
import { useActor } from "../hooks/useActor";

function formatDate(ts: bigint | number) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Home() {
  const { actor } = useActor();

  const { data: siteInfo } = useQuery({
    queryKey: ["siteInfo"],
    queryFn: () => actor!.getSiteInfo(),
    enabled: !!actor,
  });

  const { data: news = [] } = useQuery({
    queryKey: ["publishedNews"],
    queryFn: () => actor!.getPublishedNews(),
    enabled: !!actor,
  });

  const { data: events = [] } = useQuery({
    queryKey: ["publishedEvents"],
    queryFn: () => actor!.getPublishedEvents(),
    enabled: !!actor,
  });

  const { data: staff = [] } = useQuery({
    queryKey: ["allStaff"],
    queryFn: () => actor!.getAllStaff(),
    enabled: !!actor,
  });

  const { data: gallery = [] } = useQuery({
    queryKey: ["galleryItems"],
    queryFn: () => actor!.getAllGalleryItems(),
    enabled: !!actor,
  });

  const schoolName = siteInfo?.schoolName || "Bosing Royal Academy Yagrung";
  const tagline = siteInfo?.tagline || "Excellence in Education";

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[560px] flex items-center justify-center bg-navy-dark"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, oklch(0.16 0.06 240 / 0.92), oklch(0.16 0.06 240 / 0.85))",
        }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 text-center text-white px-4 py-16">
          <p className="text-sm tracking-[0.3em] uppercase text-amber-300 mb-4">
            Welcome to
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-wide mb-4 uppercase">
            {schoolName}
          </h1>
          <p className="text-lg md:text-xl text-white/80 tracking-widest uppercase mb-8">
            {tagline}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              type="button"
              onClick={() => navigate("/about")}
              className="px-8 py-3 bg-amber-600 text-white font-semibold uppercase tracking-wide rounded hover:bg-amber-700 transition-colors"
            >
              Discover Our Vision
            </button>
            <button
              type="button"
              onClick={() => navigate("/admissions")}
              className="px-8 py-3 border-2 border-white text-white font-semibold uppercase tracking-wide rounded hover:bg-white hover:text-navy transition-colors"
            >
              Apply Now
            </button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            ["Excellence", "In Education"],
            ["Dedicated", "Teachers"],
            ["Holistic", "Development"],
            ["Rich", "Heritage"],
          ].map(([a, b]) => (
            <div key={a}>
              <div className="font-bold text-lg">{a}</div>
              <div className="text-sm text-white/80">{b}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Welcome section */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-amber-600 mb-2">
            Our Story
          </p>
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4 uppercase">
            Welcome to {schoolName}
          </h2>
          <div className="w-12 h-1 bg-amber-600 mb-6" />
          <p className="text-gray-600 leading-relaxed mb-6">
            {siteInfo?.about ||
              "Bosing Royal Academy Yagrung is committed to providing quality education that nurtures the minds and character of our students. We believe in the holistic development of every child, fostering academic excellence, moral values, and a love for learning."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/about")}
            className="flex items-center gap-2 text-amber-700 font-semibold hover:gap-3 transition-all"
          >
            Read More <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="bg-gray-100 rounded-lg h-72 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <BookOpen className="w-16 h-16 mx-auto mb-2 opacity-30" />
            <p className="text-sm">School Building</p>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.2em] uppercase text-amber-600 mb-2">
              Stay Updated
            </p>
            <h2 className="font-serif text-3xl font-bold text-gray-900 uppercase">
              Latest News & Updates
            </h2>
            <div className="w-12 h-1 bg-amber-600 mx-auto mt-4" />
          </div>
          {news.length === 0 ? (
            <p className="text-center text-gray-500">
              No news yet. Check back soon!
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {news.slice(0, 3).map((item) => (
                <article
                  key={String(item.id)}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-40 bg-gray-100 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-gray-300" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-2">
                      {formatDate(item.date)}
                    </p>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {item.content}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(`/news/${String(item.id)}`)}
                      className="text-sm font-semibold text-amber-700 hover:text-amber-900"
                    >
                      Read More →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => navigate("/news")}
              className="px-6 py-2 border-2 border-amber-600 text-amber-700 font-semibold rounded hover:bg-amber-600 hover:text-white transition-colors"
            >
              View All News
            </button>
          </div>
        </div>
      </section>

      {/* Events & Staff */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
        {/* Events */}
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-amber-600 mb-2">
            What's Happening
          </p>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4 uppercase">
            Upcoming Events
          </h2>
          <div className="w-12 h-1 bg-amber-600 mb-6" />
          {events.length === 0 ? (
            <p className="text-gray-500">No upcoming events.</p>
          ) : (
            <div className="space-y-4">
              {events.slice(0, 4).map((ev) => (
                <div key={String(ev.id)} className="flex gap-4 items-start">
                  <div className="bg-navy text-white text-center rounded p-2 min-w-14">
                    <div className="text-xs font-medium">
                      {new Date(Number(ev.date) / 1_000_000).toLocaleString(
                        "default",
                        { month: "short" },
                      )}
                    </div>
                    <div className="text-xl font-bold">
                      {new Date(Number(ev.date) / 1_000_000).getDate()}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{ev.title}</h4>
                    <p className="text-sm text-gray-500">{ev.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="mt-6 text-sm font-semibold text-amber-700 hover:text-amber-900"
          >
            View All Events →
          </button>
        </div>

        {/* Staff Spotlight */}
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-amber-600 mb-2">
            Our Team
          </p>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4 uppercase">
            Faculty Spotlight
          </h2>
          <div className="w-12 h-1 bg-amber-600 mb-6" />
          {staff.length === 0 ? (
            <p className="text-gray-500">Staff profiles coming soon.</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {staff.slice(0, 3).map((s) => (
                <div key={String(s.id)} className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-2 overflow-hidden">
                    {s.photoUrl ? (
                      <img
                        src={s.photoUrl}
                        alt={s.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {s.name}
                  </p>
                  <p className="text-xs text-gray-500">{s.role}</p>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => navigate("/staff")}
            className="mt-6 text-sm font-semibold text-amber-700 hover:text-amber-900"
          >
            Meet All Staff →
          </button>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.2em] uppercase text-amber-600 mb-2">
              Our Campus
            </p>
            <h2 className="font-serif text-3xl font-bold text-gray-900 uppercase">
              Gallery
            </h2>
            <div className="w-12 h-1 bg-amber-600 mx-auto mt-4" />
          </div>
          {gallery.length === 0 ? (
            <div className="text-center py-10">
              <Image className="w-16 h-16 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">Gallery photos coming soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {gallery.slice(0, 8).map((item) => (
                <div
                  key={String(item.id)}
                  className="aspect-square rounded overflow-hidden bg-gray-200"
                >
                  <img
                    src={item.blob.getDirectURL()}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => navigate("/gallery")}
              className="px-6 py-2 border-2 border-amber-600 text-amber-700 font-semibold rounded hover:bg-amber-600 hover:text-white transition-colors"
            >
              View Full Gallery
            </button>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-navy text-white py-16 text-center">
        <h2 className="font-serif text-3xl font-bold uppercase mb-4">
          Join Our Community
        </h2>
        <p className="text-white/70 max-w-xl mx-auto mb-8">
          Give your child the best foundation for a bright future. Apply for
          admission to Bosing Royal Academy Yagrung today.
        </p>
        <button
          type="button"
          onClick={() => navigate("/admissions")}
          className="px-8 py-3 bg-amber-600 text-white font-semibold uppercase tracking-wide rounded hover:bg-amber-700 transition-colors"
        >
          Apply Now
        </button>
      </section>
    </div>
  );
}
