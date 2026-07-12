import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  createProject,
  deleteProject,
  updateProject,
  useProjects,
  type Project,
  type ProjectInput,
} from "@/lib/projects";
import { resizeImageToDataUrl } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/projects/")({
  component: AdminProjects,
});

const emptyForm: ProjectInput = {
  slug: "",
  name: "",
  role: "",
  description: "",
  tags: [],
  link: "",
  image: "",
  caseStudy: "",
  order: 0,
  featured: false,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function AdminProjects() {
  const { data: projects } = useProjects();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectInput>(emptyForm);
  const [tagsText, setTagsText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function startNew() {
    setEditingId("new");
    setForm(emptyForm);
    setTagsText("");
  }

  function startEdit(p: Project) {
    setEditingId(p.id);
    setForm({ ...p });
    setTagsText(p.tags.join(", "));
  }

  function cancel() {
    setEditingId(null);
    setForm(emptyForm);
    setTagsText("");
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await resizeImageToDataUrl(file);
      setForm((f) => ({ ...f, image: url }));
    } catch {
      toast.error("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    const data: ProjectInput = {
      ...form,
      slug: form.slug || slugify(form.name),
      tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      if (editingId && editingId !== "new") {
        await updateProject(editingId, data);
      } else {
        await createProject(data);
      }
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Saved.");
      cancel();
    } catch {
      toast.error("Failed to save project.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    await deleteProject(id);
    await queryClient.invalidateQueries({ queryKey: ["projects"] });
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
        {editingId === null && <Button onClick={startNew}>Add project</Button>}
      </div>

      {editingId !== null && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                placeholder={slugify(form.name) || "auto-generated"}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Role / subtitle</Label>
            <Input
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Short description (card view)</Label>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Case study (full page — paragraphs separated by blank lines)</Label>
            <Textarea
              rows={8}
              value={form.caseStudy}
              onChange={(e) => setForm((f) => ({ ...f, caseStudy: e.target.value }))}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Live link</Label>
              <Input
                value={form.link}
                onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Image</Label>
            <div className="flex items-center gap-4">
              {form.image && (
                <img src={form.image} alt="" className="h-16 w-16 rounded-lg object-cover border border-border" />
              )}
              <Input type="file" accept="image/*" onChange={handleImageChange} disabled={uploading} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Label>Order (lower shows first)</Label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                className="w-24"
              />
            </div>
            <div className="flex items-center gap-3">
              <Label>Featured</Label>
              <Switch
                checked={form.featured}
                onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving || uploading}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button variant="outline" onClick={cancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-3">
        {(projects ?? []).map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              {p.image && (
                <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover shrink-0" />
              )}
              <div className="min-w-0">
                <div className="font-medium text-foreground truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground truncate">/{p.slug}</div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => startEdit(p)}>
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(p.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
        {(projects ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">No projects yet.</p>
        )}
      </div>
    </AdminShell>
  );
}
