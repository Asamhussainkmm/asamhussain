import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { deleteMessage, setMessageRead, useMessages } from "@/lib/messages";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/messages/")({
  component: AdminMessages,
});

function AdminMessages() {
  const { data: messages, isLoading } = useMessages();
  const queryClient = useQueryClient();

  async function toggleRead(id: string, read: boolean) {
    await setMessageRead(id, read);
    await queryClient.invalidateQueries({ queryKey: ["messages"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    await deleteMessage(id);
    await queryClient.invalidateQueries({ queryKey: ["messages"] });
  }

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
      <p className="text-sm text-muted-foreground mt-1">Submissions from your contact form.</p>

      <div className="mt-8 space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {(messages ?? []).map((m) => (
          <div
            key={m.id}
            className={`rounded-xl border p-4 ${m.read ? "border-border bg-card" : "border-primary/40 bg-card"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="font-medium text-foreground">
                  {m.name} <span className="text-muted-foreground font-normal">· {m.email}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {m.createdAt ? m.createdAt.toLocaleString() : ""}
                </div>
                <p className="text-sm text-foreground/80 mt-3 whitespace-pre-wrap">{m.message}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => toggleRead(m.id, !m.read)}>
                  {m.read ? "Mark unread" : "Mark read"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => remove(m.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
        {!isLoading && (messages ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        )}
      </div>
    </AdminShell>
  );
}
