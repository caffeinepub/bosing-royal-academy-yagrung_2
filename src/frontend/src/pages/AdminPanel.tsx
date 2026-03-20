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
  | "logo"
  | "security";

export default function AdminPanel() {
  const { identity, login } = useInternetIdentity();
  const { actor } = useActor();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("siteInfo");
  const [isAdminChecked, setIsAdminChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showInitForm, setShowInitForm] = useState(false);
  const [initToken, setInitToken] = useState("");
  const [initError, setInitError] = useState("");
  const [initPending, setInitPending] = useState(false);
  const [showPinLogin, setShowPinLogin] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const hasSavedPin = !!localStorage.getItem("adminQuickPin");

  useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        const result = await actor.isCallerAdmin();
        setIsAdmin(result);
        setIsAdminChecked(true);
        return result;
      } catch {
        setIsAdmin(false);
        setIsAdminChecked(true);
        return false;
      }
    },
    enabled: !!actor && !!identity,
  });

  const handleInitSubmit = async () => {
    if (!actor || !initToken.trim()) return;
    setInitPending(true);
    setInitError("");
    try {
      await actor._initializeAccessControlWithSecret(initToken.trim());
      qc.invalidateQueries({ queryKey: ["isAdmin"] });
      setShowInitForm(false);
      setInitToken("");
    } catch (e: any) {
      setInitError(
        e?.message ||
          "Invalid token or initialization failed. Please try again.",
      );
    } finally {
      setInitPending(false);
    }
  };

  const handlePinUnlock = () => {
    const stored = localStorage.getItem("adminQuickPin");
    if (!stored || btoa(pinInput) !== stored) {
      setPinError("Incorrect PIN. Please try again.");
      return;
    }
    setPinError("");
    login();
  };

  if (!identity) {
    return (
      <div className="min-h-96 flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-md border border-amber-100 p-8 w-full max-w-md">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2 text-center">
            Admin Access
          </h2>
          <p className="text-gray-500 text-sm text-center mb-6">
            Bosing Royal Academy Yagrung
          </p>

          {!showPinLogin ? (
            <>
              <button
                type="button"
                onClick={login}
                data-ocid="admin.primary_button"
                className="w-full px-6 py-3 bg-amber-600 text-white font-semibold rounded hover:bg-amber-700 transition-colors mb-4"
              >
                🔐 Login with Internet Identity
              </button>
              <div className="relative flex items-center my-4">
                <div className="flex-grow border-t border-gray-200" />
                <span className="mx-3 text-xs text-gray-400 uppercase tracking-widest">
                  or
                </span>
                <div className="flex-grow border-t border-gray-200" />
              </div>
              {hasSavedPin ? (
                <button
                  type="button"
                  data-ocid="admin.secondary_button"
                  onClick={() => {
                    setShowPinLogin(true);
                    setPinError("");
                  }}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-gray-200 transition-colors"
                >
                  🔢 Quick Access with PIN
                </button>
              ) : (
                <div className="text-center text-sm text-gray-400 py-2 px-4 bg-gray-50 rounded border border-gray-200">
                  No PIN set yet. Log in with Internet Identity first, then set
                  a PIN from the Security tab in the admin panel.
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Enter your Quick Access PIN
              </p>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                data-ocid="admin.input"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.replace(/\D/g, ""));
                  setPinError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handlePinUnlock()}
                placeholder="Enter 4-6 digit PIN"
                className="w-full border border-gray-300 rounded px-3 py-3 text-center text-2xl tracking-widest mb-3 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
              {pinError && (
                <p
                  data-ocid="admin.error_state"
                  className="text-sm text-red-600 mb-3 text-center"
                >
                  {pinError}
                </p>
              )}
              <button
                type="button"
                data-ocid="admin.primary_button"
                onClick={handlePinUnlock}
                disabled={pinInput.length < 4}
                className="w-full px-6 py-3 bg-amber-600 text-white font-semibold rounded hover:bg-amber-700 transition-colors disabled:opacity-50 mb-3"
              >
                Unlock with PIN
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPinLogin(false);
                  setPinInput("");
                  setPinError("");
                }}
                className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
              >
                Use Internet Identity instead
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-4 w-full text-sm text-gray-400 hover:text-gray-600"
          >
            ← Go to Website
          </button>
        </div>
      </div>
    );
  }

  if (isAdminChecked && !isAdmin) {
    if (showInitForm) {
      return (
        <div className="min-h-96 flex flex-col items-center justify-center p-8">
          <div className="bg-white rounded-xl shadow-md border border-amber-100 p-8 w-full max-w-md">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
              Initialize Admin Account
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              If you are the first administrator, enter the admin secret token
              provided during setup to claim admin access.
            </p>
            <div className="mb-4">
              <label
                htmlFor="admin-secret-token"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Admin Secret Token
              </label>
              <input
                id="admin-secret-token"
                data-ocid="admin.input"
                type="password"
                value={initToken}
                onChange={(e) => setInitToken(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInitSubmit()}
                placeholder="Enter secret token"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
            {initError && (
              <p
                data-ocid="admin.error_state"
                className="text-sm text-red-600 mb-4"
              >
                {initError}
              </p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                data-ocid="admin.submit_button"
                onClick={handleInitSubmit}
                disabled={initPending || !initToken.trim()}
                className="px-6 py-3 bg-amber-600 text-white font-semibold rounded hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {initPending ? "Submitting..." : "Submit"}
              </button>
              <button
                type="button"
                data-ocid="admin.cancel_button"
                onClick={() => {
                  setShowInitForm(false);
                  setInitToken("");
                  setInitError("");
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

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
          data-ocid="admin.primary_button"
          onClick={() => setShowInitForm(true)}
          className="px-6 py-3 bg-amber-600 text-white font-semibold rounded hover:bg-amber-700 transition-colors mb-4"
        >
          Claim Admin Access
        </button>
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
    { key: "security", label: "🔒 Security" },
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
        {!actor ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
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
            {tab === "security" && <SecurityTab />}
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

function SecurityTab() {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState("");
  const [hasSavedPin, setHasSavedPin] = useState(
    !!localStorage.getItem("adminQuickPin"),
  );

  const handleSetPin = () => {
    if (!/^\d{4,6}$/.test(pin)) {
      setPinError("PIN must be 4-6 digits only.");
      return;
    }
    if (pin !== confirmPin) {
      setPinError("PINs do not match.");
      return;
    }
    localStorage.setItem("adminQuickPin", btoa(pin));
    setHasSavedPin(true);
    setPin("");
    setConfirmPin("");
    setPinError("");
    setPinSuccess("PIN set successfully! You can now use it for quick access.");
    setTimeout(() => setPinSuccess(""), 4000);
  };

  const handleRemovePin = () => {
    localStorage.removeItem("adminQuickPin");
    setHasSavedPin(false);
    setPinSuccess("PIN removed.");
    setTimeout(() => setPinSuccess(""), 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-lg">
      <h2 className="font-serif text-xl font-bold mb-2">Security</h2>
      <p className="text-sm text-gray-500 mb-6">
        Manage alternative access methods for the admin panel.
      </p>

      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="font-semibold text-gray-800 mb-1">Quick Access PIN</h3>
        <p className="text-sm text-gray-500 mb-5">
          Set a PIN to quickly access the admin panel without going through
          Internet Identity each time. The PIN is stored securely in your
          browser.
        </p>

        {hasSavedPin && (
          <div className="flex items-center gap-3 mb-5 p-3 bg-green-50 border border-green-200 rounded">
            <span className="text-green-600 text-lg">✓</span>
            <span className="text-sm font-medium text-green-700">
              PIN is set
            </span>
            <button
              type="button"
              data-ocid="security.delete_button"
              onClick={handleRemovePin}
              className="ml-auto px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors font-medium"
            >
              Remove PIN
            </button>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label
              htmlFor="sec-pin"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {hasSavedPin ? "Change PIN" : "New PIN"} (4-6 digits)
            </label>
            <input
              id="sec-pin"
              data-ocid="security.input"
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ""));
                setPinError("");
              }}
              placeholder="Enter 4-6 digit PIN"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="sec-confirm-pin"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm PIN
            </label>
            <input
              id="sec-confirm-pin"
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={confirmPin}
              onChange={(e) => {
                setConfirmPin(e.target.value.replace(/\D/g, ""));
                setPinError("");
              }}
              placeholder="Repeat PIN"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>
        </div>

        {pinError && (
          <p
            data-ocid="security.error_state"
            className="text-sm text-red-600 mt-3"
          >
            {pinError}
          </p>
        )}
        {pinSuccess && (
          <p
            data-ocid="security.success_state"
            className="text-sm text-green-600 mt-3"
          >
            {pinSuccess}
          </p>
        )}

        <button
          type="button"
          data-ocid="security.submit_button"
          onClick={handleSetPin}
          disabled={pin.length < 4 || confirmPin.length < 4}
          className="mt-4 px-5 py-2 bg-amber-600 text-white text-sm font-semibold rounded hover:bg-amber-700 transition-colors disabled:opacity-50"
        >
          Set PIN
        </button>
      </div>
    </div>
  );
}
