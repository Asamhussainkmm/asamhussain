import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageCropDialog } from "@/components/admin/ImageCropDialog";
import {
  savePortfolioSection,
  useHeroContent,
  useAboutContent,
  useSkillsContent,
  useExperienceContent,
  useContactContent,
  useProjectsContent,
  useTestimonialsContent,
  type HeroContent,
  type AboutContent,
  type SkillsContent,
  type ExperienceContent,
  type ContactContent,
  type ProjectsContent,
  type TestimonialsContent,
  type SkillGroup,
  type ExperienceEntry,
  type TestimonialBadge,
} from "@/lib/portfolio-content";

export const Route = createFileRoute("/admin/content/")({
  component: AdminContent,
});

function useSaver(section: string) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  async function save(data: object) {
    setSaving(true);
    try {
      await savePortfolioSection(section, data);
      await queryClient.invalidateQueries({ queryKey: ["portfolio", section] });
      toast.success("Saved.");
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  }
  return { save, saving };
}

function AdminContent() {
  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold text-foreground">Content</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Edit the text on your site directly — no need to touch Firestore by hand.
      </p>
      <Tabs defaultValue="hero" className="mt-6">
        <div className="overflow-x-auto">
          <TabsList>
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="projects">Projects section</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials section</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="hero"><HeroForm /></TabsContent>
        <TabsContent value="about"><AboutForm /></TabsContent>
        <TabsContent value="projects"><ProjectsSectionForm /></TabsContent>
        <TabsContent value="skills"><SkillsForm /></TabsContent>
        <TabsContent value="experience"><ExperienceForm /></TabsContent>
        <TabsContent value="testimonials"><TestimonialsSectionForm /></TabsContent>
        <TabsContent value="contact"><ContactForm /></TabsContent>
      </Tabs>
    </AdminShell>
  );
}

function HeroForm() {
  const remote = useHeroContent();
  const { save, saving } = useSaver("hero");
  const [form, setForm] = useState<HeroContent>(remote);
  const [stackText, setStackText] = useState(remote.stack.join(", "));
  useEffect(() => {
    setForm(remote);
    setStackText(remote.stack.join(", "));
  }, [remote]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4 mt-2">
      <Field label="Availability badge" value={form.badge} onChange={(v) => setForm((f) => ({ ...f, badge: v }))} />
      <Field label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
      <Field label="Role title" value={form.roleTitle} onChange={(v) => setForm((f) => ({ ...f, roleTitle: v }))} />
      <Field label="Stack (comma separated)" value={stackText} onChange={setStackText} />
      <TextField label="Tagline" value={form.tagline} onChange={(v) => setForm((f) => ({ ...f, tagline: v }))} />
      <Button
        disabled={saving}
        onClick={() =>
          save({ ...form, stack: stackText.split(",").map((s) => s.trim()).filter(Boolean) })
        }
      >
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}

function AboutForm() {
  const remote = useAboutContent();
  const { save, saving } = useSaver("about");
  const [form, setForm] = useState<AboutContent>(remote);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  useEffect(() => setForm(remote), [remote]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4 mt-2">
      <Field label="Eyebrow" value={form.eyebrow} onChange={(v) => setForm((f) => ({ ...f, eyebrow: v }))} />
      <Field label="Title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
      <TextField label="Intro paragraph" value={form.intro} onChange={(v) => setForm((f) => ({ ...f, intro: v }))} />
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="'Currently at' prefix" value={form.currentRolePrefix} onChange={(v) => setForm((f) => ({ ...f, currentRolePrefix: v }))} />
        <Field label="Company name" value={form.currentRoleCompany} onChange={(v) => setForm((f) => ({ ...f, currentRoleCompany: v }))} />
        <Field label="Company URL" value={form.currentRoleUrl} onChange={(v) => setForm((f) => ({ ...f, currentRoleUrl: v }))} />
      </div>
      <TextField label="Rest of that sentence" value={form.currentRoleSuffix} onChange={(v) => setForm((f) => ({ ...f, currentRoleSuffix: v }))} />
      <TextField label="Closing paragraph" value={form.outro} onChange={(v) => setForm((f) => ({ ...f, outro: v }))} />
      <Field label="Initials (fallback if no photo)" value={form.initials} onChange={(v) => setForm((f) => ({ ...f, initials: v }))} />
      <div className="space-y-2">
        <Label>Photo</Label>
        <div className="flex items-center gap-4">
          {form.photo && (
            <img src={form.photo} alt="" className="h-16 w-16 rounded-full object-cover border border-border" />
          )}
          <Input type="file" accept="image/*" onChange={handlePhotoChange} />
          {form.photo && (
            <Button variant="outline" size="sm" onClick={() => setForm((f) => ({ ...f, photo: "" }))}>
              Remove
            </Button>
          )}
        </div>
      </div>
      <Button disabled={saving} onClick={() => save(form)}>
        {saving ? "Saving…" : "Save"}
      </Button>
      <ImageCropDialog
        imageSrc={cropSrc}
        aspect={1}
        outputWidth={600}
        onCancel={() => setCropSrc(null)}
        onConfirm={(dataUrl) => {
          setForm((f) => ({ ...f, photo: dataUrl }));
          setCropSrc(null);
        }}
      />
    </div>
  );
}

function SkillsForm() {
  const remote = useSkillsContent();
  const { save, saving } = useSaver("skills");
  const [form, setForm] = useState<SkillsContent>(remote);
  useEffect(() => setForm(remote), [remote]);

  function updateGroup(i: number, patch: Partial<SkillGroup>) {
    setForm((f) => ({
      ...f,
      groups: f.groups.map((g, idx) => (idx === i ? { ...g, ...patch } : g)),
    }));
  }
  function addGroup() {
    setForm((f) => ({ ...f, groups: [...f.groups, { label: "New group", items: [] }] }));
  }
  function removeGroup(i: number) {
    setForm((f) => ({ ...f, groups: f.groups.filter((_, idx) => idx !== i) }));
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4 mt-2">
      <Field label="Eyebrow" value={form.eyebrow} onChange={(v) => setForm((f) => ({ ...f, eyebrow: v }))} />
      <Field label="Title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
      <TextField label="Description" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
      <div className="space-y-3">
        <Label>Skill groups</Label>
        {form.groups.map((g, i) => (
          <div key={i} className="rounded-xl border border-border p-4 space-y-2">
            <div className="flex gap-2">
              <Input value={g.label} onChange={(e) => updateGroup(i, { label: e.target.value })} placeholder="Group label" />
              <Button variant="outline" size="sm" onClick={() => removeGroup(i)}>Remove</Button>
            </div>
            <Input
              value={g.items.join(", ")}
              onChange={(e) => updateGroup(i, { items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
              placeholder="Items, comma separated"
            />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addGroup}>Add group</Button>
      </div>
      <Button disabled={saving} onClick={() => save(form)}>{saving ? "Saving…" : "Save"}</Button>
    </div>
  );
}

function ExperienceForm() {
  const remote = useExperienceContent();
  const { save, saving } = useSaver("experience");
  const [form, setForm] = useState<ExperienceContent>(remote);
  useEffect(() => setForm(remote), [remote]);

  function updateEntry(i: number, patch: Partial<ExperienceEntry>) {
    setForm((f) => ({
      ...f,
      entries: f.entries.map((e, idx) => (idx === i ? { ...e, ...patch } : e)),
    }));
  }
  function addEntry() {
    setForm((f) => ({
      ...f,
      entries: [...f.entries, { role: "", company: "", period: "", location: "", detail: "" }],
    }));
  }
  function removeEntry(i: number) {
    setForm((f) => ({ ...f, entries: f.entries.filter((_, idx) => idx !== i) }));
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4 mt-2">
      <Field label="Eyebrow" value={form.eyebrow} onChange={(v) => setForm((f) => ({ ...f, eyebrow: v }))} />
      <Field label="Title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
      <div className="space-y-3">
        <Label>Entries</Label>
        {form.entries.map((entry, i) => (
          <div key={i} className="rounded-xl border border-border p-4 space-y-2">
            <div className="grid sm:grid-cols-2 gap-2">
              <Input value={entry.role} onChange={(e) => updateEntry(i, { role: e.target.value })} placeholder="Role" />
              <Input value={entry.company} onChange={(e) => updateEntry(i, { company: e.target.value })} placeholder="Company" />
              <Input value={entry.period} onChange={(e) => updateEntry(i, { period: e.target.value })} placeholder="Period" />
              <Input value={entry.location} onChange={(e) => updateEntry(i, { location: e.target.value })} placeholder="Location" />
            </div>
            <Textarea rows={2} value={entry.detail} onChange={(e) => updateEntry(i, { detail: e.target.value })} placeholder="Detail" />
            <Button variant="outline" size="sm" onClick={() => removeEntry(i)}>Remove</Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addEntry}>Add entry</Button>
      </div>
      <Button disabled={saving} onClick={() => save(form)}>{saving ? "Saving…" : "Save"}</Button>
    </div>
  );
}

function ProjectsSectionForm() {
  const remote = useProjectsContent();
  const { save, saving } = useSaver("projects");
  const [form, setForm] = useState<ProjectsContent>(remote);
  useEffect(() => setForm(remote), [remote]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4 mt-2">
      <p className="text-xs text-muted-foreground">
        This is the section heading only — add/edit individual projects on the Projects page.
      </p>
      <Field label="Eyebrow" value={form.eyebrow} onChange={(v) => setForm((f) => ({ ...f, eyebrow: v }))} />
      <Field label="Title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
      <TextField label="Description" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
      <TextField label="Footer note" value={form.footerNote} onChange={(v) => setForm((f) => ({ ...f, footerNote: v }))} />
      <Button disabled={saving} onClick={() => save(form)}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}

function TestimonialsSectionForm() {
  const remote = useTestimonialsContent();
  const { save, saving } = useSaver("testimonials");
  const [form, setForm] = useState<TestimonialsContent>(remote);
  useEffect(() => setForm(remote), [remote]);

  function updateBadge(i: number, patch: Partial<TestimonialBadge>) {
    setForm((f) => ({ ...f, badges: f.badges.map((b, idx) => (idx === i ? { ...b, ...patch } : b)) }));
  }
  function addBadge() {
    setForm((f) => ({ ...f, badges: [...f.badges, { emoji: "⭐", label: "New badge" }] }));
  }
  function removeBadge(i: number) {
    setForm((f) => ({ ...f, badges: f.badges.filter((_, idx) => idx !== i) }));
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4 mt-2">
      <p className="text-xs text-muted-foreground">
        This is the section heading and trust badges — add/edit individual testimonials on the
        Testimonials page.
      </p>
      <Field label="Eyebrow" value={form.eyebrow} onChange={(v) => setForm((f) => ({ ...f, eyebrow: v }))} />
      <Field label="Title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
      <div className="space-y-3">
        <Label>Badges</Label>
        {form.badges.map((b, i) => (
          <div key={i} className="flex gap-2">
            <Input className="w-16" value={b.emoji} onChange={(e) => updateBadge(i, { emoji: e.target.value })} />
            <Input value={b.label} onChange={(e) => updateBadge(i, { label: e.target.value })} />
            <Button variant="outline" size="sm" onClick={() => removeBadge(i)}>Remove</Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addBadge}>Add badge</Button>
      </div>
      <Button disabled={saving} onClick={() => save(form)}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}

function ContactForm() {
  const remote = useContactContent();
  const { save, saving } = useSaver("contact");
  const [form, setForm] = useState<ContactContent>(remote);
  useEffect(() => setForm(remote), [remote]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4 mt-2">
      <Field label="Eyebrow" value={form.eyebrow} onChange={(v) => setForm((f) => ({ ...f, eyebrow: v }))} />
      <Field label="Title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
      <TextField label="Description" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
        <Field label="LinkedIn URL" value={form.linkedinUrl} onChange={(v) => setForm((f) => ({ ...f, linkedinUrl: v }))} />
        <Field label="GitHub URL" value={form.githubUrl} onChange={(v) => setForm((f) => ({ ...f, githubUrl: v }))} />
      </div>
      <Field label="Note" value={form.note} onChange={(v) => setForm((f) => ({ ...f, note: v }))} />
      <Button disabled={saving} onClick={() => save(form)}>{saving ? "Saving…" : "Save"}</Button>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
