import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImageCropDialog } from "@/components/admin/ImageCropDialog";
import {
  createAward,
  deleteAward,
  updateAward,
  useAwardsList,
  type Award,
  type AwardInput,
} from "@/lib/awards";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/awards/")({
  component: AdminAwards,
});

const emptyForm: AwardInput = { title: "", issuer: "", date: "", url: "", image: "", order: 0 };

function AdminAwards() {
  const { data: awards } = useAwardsList();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AwardInput>(emptyForm);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function startNew() {
    setEditingId("new");
    setForm(emptyForm);
  }

  function startEdit(a: Award) {
    setEditingId(a.id);
    setForm({ ...a });
  }

  function cancel() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editingId && editingId !== "new") {
        await updateAward(editingId, form);
      } else {
        await createAward(form);
      }
      await queryClient.invalidateQueries({ queryKey: ["awards"] });
      toast.success("Saved.");
      cancel();
    } catch {
      toast.error("Failed to save award.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this award?")) return;
    await deleteAward(id);
    await queryClient.invalidateQueries({ queryKey: ["awards"] });
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Awards & Certificates</h1>
        {editingId === null && <Button onClick={startNew}>Add award</Button>}
      </div>

      {editingId !== null && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Issuer</Label>
              <Input value={form.issuer} onChange={(e) => setForm((f) => ({ ...f, issuer: e.target.value }))} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date (e.g. "Mar 2024")</Label>
              <Input value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Credential URL (optional)</Label>
              <Input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Badge image (optional)</Label>
            <div className="flex items-center gap-4">
              {form.image && (
                <img src={form.image} alt="" className="h-14 w-14 rounded-xl object-cover border border-border" />
              )}
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {form.image && (
                <Button variant="outline" size="sm" onClick={() => setForm((f) => ({ ...f, image: "" }))}>
                  Remove
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Order (lower shows first)</Label>
            <Input
              type="number"
              className="w-24"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button variant="outline" onClick={cancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-3">
        {(awards ?? []).map((a) => (
          <div key={a.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-4 min-w-0">
              {a.image && (
                <img src={a.image} alt="" className="h-12 w-12 rounded-lg object-cover shrink-0" />
              )}
              <div className="min-w-0">
                <div className="font-medium text-foreground truncate">{a.title}</div>
                <div className="text-xs text-muted-foreground truncate">{a.issuer} · {a.date}</div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => startEdit(a)}>Edit</Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(a.id)}>Delete</Button>
            </div>
          </div>
        ))}
        {(awards ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">No awards yet.</p>
        )}
      </div>

      <ImageCropDialog
        imageSrc={cropSrc}
        aspect={1}
        outputWidth={400}
        onCancel={() => setCropSrc(null)}
        onConfirm={(dataUrl) => {
          setForm((f) => ({ ...f, image: dataUrl }));
          setCropSrc(null);
        }}
      />
    </AdminShell>
  );
}
