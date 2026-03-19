import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import PageBanner from "../components/PageBanner";
import { useActor } from "../hooks/useActor";

export default function Staff() {
  const { actor } = useActor();
  const { data: staff = [], isLoading } = useQuery({
    queryKey: ["allStaff"],
    queryFn: () => actor!.getAllStaff(),
    enabled: !!actor,
  });

  const departments = [
    ...new Set(staff.map((s) => s.department).filter(Boolean)),
  ];

  return (
    <div>
      <PageBanner title="Staff & Faculty" subtitle="Meet Our Dedicated Team" />
      <div className="max-w-7xl mx-auto px-4 py-16">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : staff.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              Staff profiles will appear here soon.
            </p>
          </div>
        ) : (
          <>
            {departments.length > 0 ? (
              departments.map((dept) => (
                <div key={dept} className="mb-12">
                  <h3 className="font-serif text-xl font-bold uppercase text-gray-900 mb-2">
                    {dept}
                  </h3>
                  <div className="w-12 h-1 bg-amber-600 mb-6" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {staff
                      .filter((s) => s.department === dept)
                      .map((s) => (
                        <StaffCard key={String(s.id)} staff={s} />
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {staff.map((s) => (
                  <StaffCard key={String(s.id)} staff={s} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StaffCard({
  staff: s,
}: {
  staff: {
    id: bigint;
    name: string;
    role: string;
    department: string;
    bio: string;
    photoUrl?: string;
  };
}) {
  return (
    <div className="text-center bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-3 overflow-hidden">
        {s.photoUrl ? (
          <img
            src={s.photoUrl}
            alt={s.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Users className="w-10 h-10 text-gray-400" />
        )}
      </div>
      <h4 className="font-semibold text-gray-900 text-sm">{s.name}</h4>
      <p className="text-xs text-amber-700 font-medium">{s.role}</p>
      {s.department && <p className="text-xs text-gray-500">{s.department}</p>}
      {s.bio && (
        <p className="text-xs text-gray-600 mt-2 line-clamp-3">{s.bio}</p>
      )}
    </div>
  );
}
