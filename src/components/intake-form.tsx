"use client";
import { CheckCircle2, CircleAlert, TriangleAlert } from "lucide-react";
import { FormEvent, useState } from "react";

type StatusTone = "pending" | "success" | "warning" | "error";
type Status = { tone: StatusTone; text: string } | null;

const statusIcon: Record<StatusTone, typeof CheckCircle2 | null> = { pending: null, success: CheckCircle2, warning: TriangleAlert, error: CircleAlert };

export function IntakeForm({ kind = "application", includeType = true }: { kind?: string; includeType?: boolean }) {
	const [status, setStatus] = useState<Status>(null);
	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		setStatus({ tone: "pending", text: "Sending..." });
		const response = await fetch("/api/submissions", { method: "POST", body: new FormData(form) });
		const result = (await response.json().catch(() => ({}))) as { notificationSent?: boolean };
		if (response.ok && result.notificationSent !== false) setStatus({ tone: "success", text: "Thank you. Our team will be in touch." });
		else if (response.ok) setStatus({ tone: "warning", text: "Your message was saved, but email delivery is delayed. Please email contact@veteransoutdoortherapy.org if your request is urgent." });
		else setStatus({ tone: "error", text: "We could not send this yet. Please email contact@veteransoutdoortherapy.org." });
		if (response.ok) form.reset();
	}
	const Icon = status ? statusIcon[status.tone] : null;
	return <form className="intake-form" onSubmit={submit}><input type="hidden" name="kind" value={kind} /><input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" hidden />{includeType && <label>I am applying as<select className="field" name="applicantType" required><option value="Veteran">Veteran</option><option value="Gold Star family">Gold Star family member</option><option value="Volunteer">Volunteer / fundraiser / host</option></select></label>}<div className="form-row"><label>First name<input className="field" name="firstName" required /></label><label>Last name<input className="field" name="lastName" required /></label></div><div className="form-row"><label>Email<input className="field" name="email" type="email" required /></label><label>Phone<input className="field" name="phone" type="tel" /></label></div><label>How can we help?<textarea className="field" name="message" rows={6} required /></label><label className="consent"><input type="checkbox" required /> I consent to being contacted about this request.</label><button className="button orange" type="submit">Submit securely</button><div role="status" aria-live="polite">{status && <p className={`form-status ${status.tone}`}>{Icon && <Icon size={18} aria-hidden="true" />}<span>{status.text}</span></p>}</div></form>;
}
