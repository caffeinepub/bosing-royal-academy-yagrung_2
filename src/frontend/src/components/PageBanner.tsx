export default function PageBanner({
  title,
  subtitle,
}: { title: string; subtitle?: string }) {
  return (
    <div className="bg-navy text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl font-bold uppercase tracking-wide mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/70 tracking-widest text-sm uppercase">
            {subtitle}
          </p>
        )}
        <div className="w-16 h-1 bg-amber-500 mt-4" />
      </div>
    </div>
  );
}
