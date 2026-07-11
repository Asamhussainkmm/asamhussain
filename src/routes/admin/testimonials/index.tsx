import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
  useTestimonialsList,
  type Testimonial,
  type TestimonialInput,
} from "@/lib/testimonials";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/testimonials/")({
  component: AdminTestimonials,
});

const emptyForm: TestimonialInput = { quote: "", name: "", roleCompany: "", avatar: "", order: 0 };

function AdminTestimonials() {
  const { data: testimonials } = useTestimonialsList();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialInput>(emptyForm);
  const [saving, setSaving] = useState(false);

  function startNew() {
    setEditingId("new");
    setForm(emptyForm);
  }

  function startEdit(t: Testimonial) {
    setEditingId(t.id);
    setForm({ ...t });
  }

  function cancel() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editingId && editingId !== "new") {
        await updateTestimonial(editingId, form);
      } else {
        await createTestimonial(form);
      }
      await queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Saved.");
      cancel();
    } catch {
      toast.error("Failed to save testimonial.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await deleteTestimonial(id);
    await queryClient.invalidateQueries({ queryKey: ["testimonials"] });
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Testimonials</h1>
        {editingId === null && <Button onClick={startNew}>Add testimonial</Button>}
      </div>

      {editingId !== null && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="space-y-2">
            <Label>Quote</Label>
            <Textarea
              rows={4}
              value={form.quote}
              onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Role · Company</Label>
              <Input
                value={form.roleCompany}
                onChange={(e) => setForm((f) => ({ ...f, roleCompany: e.target.value }))}
              />
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
        {(testimonials ?? []).map((t) => (
          <div key={t.id} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
            <div className="min-w-0">
              <p className="text-sm text-foreground/80 italic line-clamp-2">{t.quote}</p>
              <div className="text-xs text-muted-foreground mt-1">{t.name} · {t.roleCompany}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => startEdit(t)}>Edit</Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(t.id)}>Delete</Button>
            </div>
          </div>
        ))}
        {(testimonials ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">No testimonials yet.</p>
        )}
      </div>
    </AdminShell>
  );
}
