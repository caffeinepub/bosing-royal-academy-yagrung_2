import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { navigate } from "../App";
import { ExternalBlob } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type Tab =
  | "siteInfo"
  | "news"
  | "events"
  | "staff"
  | "gallery"
  | "faqs"
  | "achievements"
  | "admissions"
  | "logo";

export default function AdminPanel() {
  const { identity, login } = useInternetIdentity();
  const { actor } = useActor();
  const [tab, setTab] = useState<Tab>("siteInfo");
  const [isAdminChecked, setIsAdminChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      const result = await actor.isCallerAdmin();
      setIsAdmin(result);
      setIsAdminChecked(true);
      return result;
    },
    enabled: !!actor && !!identity,
  });

  if (!identity) {
    return (
      <div className="min-h-96 flex flex-col items-center justify-center p-16">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
          Admin Access Required
        </h2>
        <p className="text-gray-600 mb-6">
          Please log in with Internet Identity to access the admin panel.
        </p>
        <button
          type="button"
          onClick={login}
          className="px-6 py-3 bg-amber-600 text-white font-semibold rounded hover:bg-amber-700 transition-colors"
        >
          Login with Internet Identity
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          ← Go to Website
        </button>
      </div>
    );
  }

  if (isAdminChecked && !isAdmin) {
    return (
      <div className="min-h-96 flex flex-col items-center justify-center p-16">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-2">You do not have admin access.</p>
        <p className="text-xs text-gray-400 mb-6">
          If you are the school administrator, please contact support to set up
          your admin account.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-sm text-amber-700 hover:text-amber-900"
        >
          ← Back to Website
        </button>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "siteInfo", label: "Site Info" },
    { key: "news", label: "News" },
    { key: "events", label: "Events" },
    { key: "staff", label: "Staff" },
    { key: "gallery", label: "Gallery" },
    { key: "faqs", label: "FAQs" },
    { key: "achievements", label: "Achievements" },
    { key: "admissions", label: "Admissions" },
    { key: "logo", label: "🖼 Logo" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <div className="bg-navy text-white px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="font-serif text-xl font-bold">
            Admin Panel - Bosing Royal Academy Yagrung
          </h1>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm text-white/70 hover:text-white"
          >
            ← View Website
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((t) => (
            <button
              type="button"
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                tab === t.key
                  ? "bg-amber-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {actor && (
          <>
            {tab === "siteInfo" && <SiteInfoTab actor={actor} />}
            {tab === "news" && <NewsTab actor={actor} />}
            {tab === "events" && <EventsTab actor={actor} />}
            {tab === "staff" && <StaffTab actor={actor} />}
            {tab === "gallery" && <GalleryTab actor={actor} />}
            {tab === "faqs" && <FAQsTab actor={actor} />}
            {tab === "achievements" && <AchievementsTab actor={actor} />}
            {tab === "admissions" && <AdmissionsTab actor={actor} />}
            {tab === "logo" && <LogoTab actor={actor} />}
          </>
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SiteInfoTab({ actor }: { actor: any }) {
  const qc = useQueryClient();
  const { data: info } = useQuery({
    queryKey: ["siteInfo"],
    queryFn: () => actor.getSiteInfo(),
  });
  const [form, setForm] = useState({
    schoolName: "",
    tagline: "",
    address: "",
    phone: "",
    email: "",
    about: "",
    principalName: "",
    principalMessage: "",
  });
  const [saved, setSaved] = useState(false);

  useState(() => {
    if (info)
      setForm({
        schoolName: info.schoolName || "",
        tagline: info.tagline || "",
        address: info.address || "",
        phone: info.phone || "",
        email: info.email || "",
        about: info.about || "",
        principalName: info.principalName || "",
        principalMessage: info.principalMessage || "",
      });
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => actor.setSiteInfo(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["siteInfo"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  // Sync form when data loads
  if (info && !form.schoolName && info.schoolName) {
    setForm({
      schoolName: info.schoolName || "",
      tagline: info.tagline || "",
      address: info.address || "",
      phone: info.phone || "",
      email: info.email || "",
      about: info.about || "",
      principalName: info.principalName || "",
      principalMessage: info.principalMessage || "",
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
      <h2 className="font-serif text-xl font-bold mb-6">Site Information</h2>
      <div className="space-y-4">
        <Field
          label="School Name"
          value={form.schoolName}
          onChange={(v) => setForm({ ...form, schoolName: v })}
        />
        <Field
          label="Tagline"
          value={form.tagline}
          onChange={(v) => setForm({ ...form, tagline: v })}
        />
        <Field
          label="Address"
          value={form.address}
          onChange={(v) => setForm({ ...form, address: v })}
        />
        <Field
          label="Phone"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
        />
        <Field
          label="Email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />
        <Field
          label="About"
          value={form.about}
          onChange={(v) => setForm({ ...form, about: v })}
          multiline
        />
        <Field
          label="Principal Name"
          value={form.principalName}
          onChange={(v) => setForm({ ...form, principalName: v })}
        />
        <Field
          label="Principal Message"
          value={form.principalMessage}
          onChange={(v) => setForm({ ...form, principalMessage: v })}
          multiline
        />
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => mutate()}
          disabled={isPending}
          className="px-6 py-2 bg-amber-600 text-white font-semibold rounded hover:bg-amber-700 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
        {saved && <span className="text-green-600 text-sm">Saved!</span>}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NewsTab({ actor }: { actor: any }) {
  const qc = useQueryClient();
  const { data: news = [] } = useQuery({
    queryKey: ["allNewsAdmin"],
    queryFn: () => actor.getAllNewsAdmin(),
  });
  const [editing, setEditing] = useState<null | "new" | bigint>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    author: "",
    published: false,
  });

  const { mutate: save, isPending } = useMutation({
    mutationFn: async () => {
      const now = BigInt(Date.now()) * BigInt(1_000_000);
      if (editing === "new") {
        await actor.createNews({
          id: BigInt(0),
          title: form.title,
          content: form.content,
          author: form.author,
          date: now,
          published: form.published,
        });
      } else if (editing !== null) {
        await actor.updateNews(editing, {
          id: editing,
          title: form.title,
          content: form.content,
          author: form.author,
          date: now,
          published: form.published,
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allNewsAdmin"] });
      qc.invalidateQueries({ queryKey: ["publishedNews"] });
      setEditing(null);
    },
  });

  const { mutate: del } = useMutation({
    mutationFn: (id: bigint) => actor.deleteNews(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allNewsAdmin"] });
      qc.invalidateQueries({ queryKey: ["publishedNews"] });
    },
  });

  const startEdit = (item: {
    id: bigint;
    title: string;
    content: string;
    author: string;
    published: boolean;
  }) => {
    setForm({
      title: item.title,
      content: item.content,
      author: item.author,
      published: item.published,
    });
    setEditing(item.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-xl font-bold">News & Announcements</h2>
        <button
          type="button"
          onClick={() => {
            setForm({ title: "", content: "", author: "", published: false });
            setEditing("new");
          }}
          className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded hover:bg-amber-700"
        >
          + New Article
        </button>
      </div>
      {editing !== null && (
        <div className="mb-6 p-4 border border-amber-200 rounded-lg bg-amber-50">
          <h3 className="font-semibold mb-4">
            {editing === "new" ? "New Article" : "Edit Article"}
          </h3>
          <div className="space-y-3">
            <Field
              label="Title"
              value={form.title}
              onChange={(v) => setForm({ ...form, title: v })}
            />
            <Field
              label="Author"
              value={form.author}
              onChange={(v) => setForm({ ...form, author: v })}
            />
            <Field
              label="Content"
              value={form.content}
              onChange={(v) => setForm({ ...form, content: v })}
              multiline
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
              />
              Published
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => save()}
              disabled={isPending}
              className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {news.map(
          (item: {
            id: bigint;
            title: string;
            content: string;
            author: string;
            published: boolean;
          }) => (
            <div
              key={String(item.id)}
              className="flex items-center justify-between p-3 border rounded"
            >
              <div>
                <span className="font-medium text-sm">{item.title}</span>
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded ${item.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {item.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => del(item.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EventsTab({ actor }: { actor: any }) {
  const qc = useQueryClient();
  const { data: events = [] } = useQuery({
    queryKey: ["allEvents"],
    queryFn: () => actor.getAllEvents(),
  });
  const [editing, setEditing] = useState<null | "new" | bigint>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    dateStr: "",
    published: false,
  });

  const { mutate: save, isPending } = useMutation({
    mutationFn: async () => {
      const date =
        BigInt(new Date(form.dateStr || Date.now()).getTime()) *
        BigInt(1_000_000);
      if (editing === "new") {
        await actor.createEvent({
          id: BigInt(0),
          title: form.title,
          description: form.description,
          location: form.location,
          date,
          published: form.published,
        });
      } else if (editing !== null) {
        await actor.updateEvent(editing, {
          id: editing,
          title: form.title,
          description: form.description,
          location: form.location,
          date,
          published: form.published,
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allEvents"] });
      qc.invalidateQueries({ queryKey: ["publishedEvents"] });
      setEditing(null);
    },
  });

  const { mutate: del } = useMutation({
    mutationFn: (id: bigint) => actor.deleteEvent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allEvents"] });
      qc.invalidateQueries({ queryKey: ["publishedEvents"] });
    },
  });

  const startEdit = (item: {
    id: bigint;
    title: string;
    description: string;
    location: string;
    date: bigint;
    published: boolean;
  }) => {
    const d = new Date(Number(item.date) / 1_000_000);
    setForm({
      title: item.title,
      description: item.description,
      location: item.location,
      dateStr: d.toISOString().slice(0, 10),
      published: item.published,
    });
    setEditing(item.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-xl font-bold">Events</h2>
        <button
          type="button"
          onClick={() => {
            setForm({
              title: "",
              description: "",
              location: "",
              dateStr: "",
              published: false,
            });
            setEditing("new");
          }}
          className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded hover:bg-amber-700"
        >
          + New Event
        </button>
      </div>
      {editing !== null && (
        <div className="mb-6 p-4 border border-amber-200 rounded-lg bg-amber-50">
          <h3 className="font-semibold mb-4">
            {editing === "new" ? "New Event" : "Edit Event"}
          </h3>
          <div className="space-y-3">
            <Field
              label="Title"
              value={form.title}
              onChange={(v) => setForm({ ...form, title: v })}
            />
            <Field
              label="Description"
              value={form.description}
              onChange={(v) => setForm({ ...form, description: v })}
              multiline
            />
            <Field
              label="Location"
              value={form.location}
              onChange={(v) => setForm({ ...form, location: v })}
            />
            <div>
              <label
                htmlFor="event-date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <input
                id="event-date"
                type="date"
                value={form.dateStr}
                onChange={(e) => setForm({ ...form, dateStr: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
              />
              Published
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => save()}
              disabled={isPending}
              className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {events.map(
          (item: {
            id: bigint;
            title: string;
            description: string;
            location: string;
            date: bigint;
            published: boolean;
          }) => (
            <div
              key={String(item.id)}
              className="flex items-center justify-between p-3 border rounded"
            >
              <div>
                <span className="font-medium text-sm">{item.title}</span>
                <span className="ml-2 text-xs text-gray-500">
                  {new Date(Number(item.date) / 1_000_000).toLocaleDateString()}
                </span>
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded ${item.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {item.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => del(item.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StaffTab({ actor }: { actor: any }) {
  const qc = useQueryClient();
  const { data: staff = [] } = useQuery({
    queryKey: ["allStaff"],
    queryFn: () => actor.getAllStaff(),
  });
  const [editing, setEditing] = useState<null | "new" | bigint>(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    department: "",
    bio: "",
    photoUrl: "",
    order: "0",
  });

  const { mutate: save, isPending } = useMutation({
    mutationFn: async () => {
      const s = {
        id: BigInt(0),
        name: form.name,
        role: form.role,
        department: form.department,
        bio: form.bio,
        photoUrl: form.photoUrl || undefined,
        order: BigInt(Number.parseInt(form.order) || 0),
      };
      if (editing === "new") {
        await actor.createStaff(s);
      } else if (editing !== null) {
        await actor.updateStaff(editing, { ...s, id: editing });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allStaff"] });
      setEditing(null);
    },
  });

  const { mutate: del } = useMutation({
    mutationFn: (id: bigint) => actor.deleteStaff(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allStaff"] }),
  });

  const startEdit = (item: {
    id: bigint;
    name: string;
    role: string;
    department: string;
    bio: string;
    photoUrl?: string;
    order: bigint;
  }) => {
    setForm({
      name: item.name,
      role: item.role,
      department: item.department,
      bio: item.bio,
      photoUrl: item.photoUrl || "",
      order: String(item.order),
    });
    setEditing(item.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-xl font-bold">Staff & Faculty</h2>
        <button
          type="button"
          onClick={() => {
            setForm({
              name: "",
              role: "",
              department: "",
              bio: "",
              photoUrl: "",
              order: "0",
            });
            setEditing("new");
          }}
          className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded hover:bg-amber-700"
        >
          + Add Staff
        </button>
      </div>
      {editing !== null && (
        <div className="mb-6 p-4 border border-amber-200 rounded-lg bg-amber-50">
          <h3 className="font-semibold mb-4">
            {editing === "new" ? "Add Staff" : "Edit Staff"}
          </h3>
          <div className="space-y-3">
            <Field
              label="Name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />
            <Field
              label="Role / Designation"
              value={form.role}
              onChange={(v) => setForm({ ...form, role: v })}
            />
            <Field
              label="Department"
              value={form.department}
              onChange={(v) => setForm({ ...form, department: v })}
            />
            <Field
              label="Bio"
              value={form.bio}
              onChange={(v) => setForm({ ...form, bio: v })}
              multiline
            />
            <Field
              label="Photo URL (optional)"
              value={form.photoUrl}
              onChange={(v) => setForm({ ...form, photoUrl: v })}
            />
            <Field
              label="Display Order"
              value={form.order}
              onChange={(v) => setForm({ ...form, order: v })}
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => save()}
              disabled={isPending}
              className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {staff.map(
          (item: {
            id: bigint;
            name: string;
            role: string;
            department: string;
            bio: string;
            photoUrl?: string;
            order: bigint;
          }) => (
            <div
              key={String(item.id)}
              className="flex items-center justify-between p-3 border rounded"
            >
              <div>
                <span className="font-medium text-sm">{item.name}</span>
                <span className="ml-2 text-xs text-amber-700">{item.role}</span>
                {item.department && (
                  <span className="ml-2 text-xs text-gray-500">
                    {item.department}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => del(item.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GalleryTab({ actor }: { actor: any }) {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({
    queryKey: ["galleryItems"],
    queryFn: () => actor.getAllGalleryItems(),
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { mutate: del } = useMutation({
    mutationFn: (id: bigint) => actor.deleteGalleryImage(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["galleryItems"] }),
  });

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file || !title) return;
    setUploading(true);
    setProgress(0);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((p) =>
        setProgress(p),
      );
      await actor.addGalleryItem(title, category || "General", blob);
      qc.invalidateQueries({ queryKey: ["galleryItems"] });
      setTitle("");
      setCategory("");
      if (fileRef.current) fileRef.current.value = "";
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="font-serif text-xl font-bold mb-6">Gallery</h2>
      <div className="p-4 border border-amber-200 rounded-lg bg-amber-50 mb-6">
        <h3 className="font-semibold mb-4">Upload New Image</h3>
        <div className="space-y-3">
          <Field label="Title" value={title} onChange={setTitle} />
          <Field
            label="Category (e.g. Events, Sports)"
            value={category}
            onChange={setCategory}
          />
          <div>
            <label
              htmlFor="gallery-file"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image File
            </label>
            <input
              id="gallery-file"
              type="file"
              accept="image/*"
              ref={fileRef}
              className="text-sm"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading || !title}
            className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded disabled:opacity-50"
          >
            {uploading ? `Uploading ${progress}%` : "Upload Image"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {items.map(
          (item: { id: bigint; title: string; blob: ExternalBlob }) => (
            <div key={String(item.id)} className="relative group">
              <div className="aspect-square rounded overflow-hidden bg-gray-100">
                <img
                  src={item.blob.getDirectURL()}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {item.title}
              </p>
              <button
                type="button"
                onClick={() => del(item.id)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FAQsTab({ actor }: { actor: any }) {
  const qc = useQueryClient();
  const { data: faqs = [] } = useQuery({
    queryKey: ["allFAQs"],
    queryFn: () => actor.getAllFAQs(),
  });
  const [editing, setEditing] = useState<null | "new" | bigint>(null);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    order: "0",
    published: false,
  });

  const { mutate: save, isPending } = useMutation({
    mutationFn: async () => {
      const f = {
        id: BigInt(0),
        question: form.question,
        answer: form.answer,
        order: BigInt(Number.parseInt(form.order) || 0),
        published: form.published,
      };
      if (editing === "new") {
        await actor.createFAQ(f);
      } else if (editing !== null) {
        await actor.updateFAQ(editing, { ...f, id: editing });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allFAQs"] });
      qc.invalidateQueries({ queryKey: ["publishedFAQs"] });
      setEditing(null);
    },
  });
  const { mutate: del } = useMutation({
    mutationFn: (id: bigint) => actor.deleteFAQ(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allFAQs"] });
      qc.invalidateQueries({ queryKey: ["publishedFAQs"] });
    },
  });
  const startEdit = (item: {
    id: bigint;
    question: string;
    answer: string;
    order: bigint;
    published: boolean;
  }) => {
    setForm({
      question: item.question,
      answer: item.answer,
      order: String(item.order),
      published: item.published,
    });
    setEditing(item.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-xl font-bold">FAQs</h2>
        <button
          type="button"
          onClick={() => {
            setForm({ question: "", answer: "", order: "0", published: false });
            setEditing("new");
          }}
          className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded hover:bg-amber-700"
        >
          + Add FAQ
        </button>
      </div>
      {editing !== null && (
        <div className="mb-6 p-4 border border-amber-200 rounded-lg bg-amber-50">
          <div className="space-y-3">
            <Field
              label="Question"
              value={form.question}
              onChange={(v) => setForm({ ...form, question: v })}
            />
            <Field
              label="Answer"
              value={form.answer}
              onChange={(v) => setForm({ ...form, answer: v })}
              multiline
            />
            <Field
              label="Display Order"
              value={form.order}
              onChange={(v) => setForm({ ...form, order: v })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
              />
              Published
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => save()}
              disabled={isPending}
              className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {faqs.map(
          (item: {
            id: bigint;
            question: string;
            answer: string;
            order: bigint;
            published: boolean;
          }) => (
            <div
              key={String(item.id)}
              className="flex items-center justify-between p-3 border rounded"
            >
              <div>
                <span className="font-medium text-sm">{item.question}</span>
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded ${item.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {item.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => del(item.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AchievementsTab({ actor }: { actor: any }) {
  const qc = useQueryClient();
  const { data: achievements = [] } = useQuery({
    queryKey: ["allAchievements"],
    queryFn: () => actor.getAllAchievements(),
  });
  const [editing, setEditing] = useState<null | "new" | bigint>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    year: String(new Date().getFullYear()),
    category: "",
  });

  const { mutate: save, isPending } = useMutation({
    mutationFn: async () => {
      const a = {
        id: BigInt(0),
        title: form.title,
        description: form.description,
        year: BigInt(Number.parseInt(form.year) || new Date().getFullYear()),
        category: form.category,
      };
      if (editing === "new") {
        await actor.createAchievement(a);
      } else if (editing !== null) {
        await actor.updateAchievement(editing, { ...a, id: editing });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allAchievements"] });
      setEditing(null);
    },
  });
  const { mutate: del } = useMutation({
    mutationFn: (id: bigint) => actor.deleteAchievement(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allAchievements"] }),
  });
  const startEdit = (item: {
    id: bigint;
    title: string;
    description: string;
    year: bigint;
    category: string;
  }) => {
    setForm({
      title: item.title,
      description: item.description,
      year: String(item.year),
      category: item.category,
    });
    setEditing(item.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-xl font-bold">Achievements & Awards</h2>
        <button
          type="button"
          onClick={() => {
            setForm({
              title: "",
              description: "",
              year: String(new Date().getFullYear()),
              category: "",
            });
            setEditing("new");
          }}
          className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded hover:bg-amber-700"
        >
          + Add Achievement
        </button>
      </div>
      {editing !== null && (
        <div className="mb-6 p-4 border border-amber-200 rounded-lg bg-amber-50">
          <div className="space-y-3">
            <Field
              label="Title"
              value={form.title}
              onChange={(v) => setForm({ ...form, title: v })}
            />
            <Field
              label="Description"
              value={form.description}
              onChange={(v) => setForm({ ...form, description: v })}
              multiline
            />
            <Field
              label="Year"
              value={form.year}
              onChange={(v) => setForm({ ...form, year: v })}
            />
            <Field
              label="Category"
              value={form.category}
              onChange={(v) => setForm({ ...form, category: v })}
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => save()}
              disabled={isPending}
              className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {achievements.map(
          (item: {
            id: bigint;
            title: string;
            description: string;
            year: bigint;
            category: string;
          }) => (
            <div
              key={String(item.id)}
              className="flex items-center justify-between p-3 border rounded"
            >
              <div>
                <span className="font-medium text-sm">{item.title}</span>
                <span className="ml-2 text-xs text-amber-700">
                  {item.category}
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  {String(item.year)}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => del(item.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AdmissionsTab({ actor }: { actor: any }) {
  const qc = useQueryClient();
  const { data: info } = useQuery({
    queryKey: ["admissionInfo"],
    queryFn: () => actor.getAdmissionInfo(),
  });
  const [form, setForm] = useState({
    processSteps: "",
    requirements: "",
    fees: "",
    contact: "",
  });
  const [saved, setSaved] = useState(false);

  if (info && !form.processSteps && info.processSteps) {
    setForm({
      processSteps: info.processSteps || "",
      requirements: info.requirements || "",
      fees: info.fees || "",
      contact: info.contact || "",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: () => actor.setAdmissionInfo(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admissionInfo"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
      <h2 className="font-serif text-xl font-bold mb-6">
        Admissions Information
      </h2>
      <div className="space-y-4">
        <Field
          label="Admission Process Steps"
          value={form.processSteps}
          onChange={(v) => setForm({ ...form, processSteps: v })}
          multiline
        />
        <Field
          label="Requirements"
          value={form.requirements}
          onChange={(v) => setForm({ ...form, requirements: v })}
          multiline
        />
        <Field
          label="Fee Information"
          value={form.fees}
          onChange={(v) => setForm({ ...form, fees: v })}
          multiline
        />
        <Field
          label="Contact Information"
          value={form.contact}
          onChange={(v) => setForm({ ...form, contact: v })}
          multiline
        />
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => mutate()}
          disabled={isPending}
          className="px-6 py-2 bg-amber-600 text-white font-semibold rounded hover:bg-amber-700 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
        {saved && <span className="text-green-600 text-sm">Saved!</span>}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const fieldId = `field-${label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  return (
    <div>
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={fieldId}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        />
      ) : (
        <input
          id={fieldId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        />
      )}
    </div>
  );
}

function LogoTab({ actor }: { actor: any }) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const { data: logoBlob } = useQuery({
    queryKey: ["siteLogo"],
    queryFn: () => actor.getLogoBlob(),
  });

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setUploadStatus("idle");
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((p) =>
        setProgress(p),
      );
      await actor.setLogoBlob(blob);
      qc.invalidateQueries({ queryKey: ["siteLogo"] });
      if (fileRef.current) fileRef.current.value = "";
      setUploadStatus("success");
    } catch {
      setUploadStatus("error");
    } finally {
      setUploading(false);
    }
  };

  const logoUrl = logoBlob ? logoBlob.getDirectURL() : null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-xl">
      <h2 className="font-serif text-xl font-bold mb-2">School Logo</h2>
      <p className="text-sm text-gray-500 mb-6">
        Upload your school logo here. It will appear in the website header and
        footer.
      </p>

      {/* Current logo preview */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Current Logo
        </h3>
        <div
          data-ocid="logo.panel"
          className="w-full h-40 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="School logo"
              className="max-h-36 max-w-full object-contain"
            />
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">🏫</div>
              <p className="text-sm">No logo uploaded yet</p>
              <p className="text-xs">
                The text initials "BRA" are shown instead
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload new logo */}
      <div className="p-4 border border-amber-200 rounded-lg bg-amber-50">
        <h3 className="font-semibold mb-4">Upload New Logo</h3>
        <div className="space-y-3">
          <div>
            <label
              htmlFor="logo-file"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Image File (PNG or SVG recommended for best quality)
            </label>
            <input
              data-ocid="logo.upload_button"
              id="logo-file"
              type="file"
              accept="image/*"
              ref={fileRef}
              className="text-sm"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <button
            data-ocid="logo.primary_button"
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded disabled:opacity-50"
          >
            {uploading ? `Uploading ${progress}%` : "Upload Logo"}
          </button>
          {uploadStatus === "success" && (
            <span
              data-ocid="logo.success_state"
              className="text-sm text-green-600 font-medium"
            >
              ✓ Logo updated successfully!
            </span>
          )}
          {uploadStatus === "error" && (
            <span
              data-ocid="logo.error_state"
              className="text-sm text-red-600 font-medium"
            >
              ✗ Upload failed. Please try again.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
