/**
 * Emails a copy of a contact form submission via Web3Forms. Best-effort —
 * Firestore (see messages.ts) is the source of truth for the admin inbox, so
 * a failure here should never block or fail the visitor's submission.
 */
export async function sendContactEmailCopy(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return;

  try {
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New portfolio contact message from ${input.name}`,
        name: input.name,
        email: input.email,
        message: input.message,
      }),
    });
  } catch {
    // Ignore — the message is already saved in Firestore regardless.
  }
}
