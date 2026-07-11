import { useState } from "react";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { SectionHeading } from "./SectionHeading";
import { useContactContent } from "@/lib/portfolio-content";
import { submitMessage } from "@/lib/messages";
import { sendContactEmailCopy } from "@/lib/notify";

export function Contact() {
  const [sending, setSending] = useState(false);
  const contact = useContactContent();
  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl border border-border bg-surface-2 p-8 md:p-14">
          <SectionHeading
            eyebrow={contact.eyebrow}
            title={contact.title}
            description={contact.description}
          />
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-10">
            <div className="space-y-6">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-foreground/85 hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5 text-primary" />
                {contact.email}
              </a>
              <div className="flex gap-3">
                <a href={contact.linkedinUrl} aria-label="LinkedIn" className="h-11 w-11 grid place-items-center rounded-full border border-border bg-card hover:border-primary hover:text-primary transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href={contact.githubUrl} aria-label="GitHub" className="h-11 w-11 grid place-items-center rounded-full border border-border bg-card hover:border-primary hover:text-primary transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                {contact.note}
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = new FormData(form);
                const values = {
                  name: String(data.get("name") ?? ""),
                  email: String(data.get("email") ?? ""),
                  message: String(data.get("message") ?? ""),
                };
                setSending(true);
                submitMessage(values)
                  .then(() => {
                    toast.success("Thanks — I'll be in touch shortly.");
                    form.reset();
                    void sendContactEmailCopy(values);
                  })
                  .catch(() => {
                    toast.error("Something went wrong — please try again.");
                  })
                  .finally(() => setSending(false));
              }}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input required name="name" placeholder="Name" className="w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
                <input required type="email" name="email" placeholder="Email" className="w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
              </div>
              <textarea required name="message" rows={5} placeholder="Tell me about the role or project…" className="w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none" />
              <button type="submit" disabled={sending} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                {sending ? "Sending…" : "Send message"}
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}