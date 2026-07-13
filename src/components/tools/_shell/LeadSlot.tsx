// Shared lead-capture slot (AD-7). One component, one fixed payload shape, one
// configurable endpoint. Feature-flagged OFF in Phase 1 — renders nothing, no
// gate. Capture is result-first by design: it is only ever placed AFTER a result
// exists in a tool's UI.
//
// Phase 2: flip LEADS_ENABLED, render a "email/WhatsApp me this report" form,
// and POST exactly this payload to LEAD_ENDPOINT.

export const LEADS_ENABLED = false;

/** The one payload shape every tool sends — so CRM ingest is a single schema. */
export type LeadPayload = {
  toolSlug: string;
  name: string;
  phone: string;
  email?: string;
  /** short human summary of the result the user is capturing */
  resultSummary: string;
  /** ISO timestamp */
  capturedAt: string;
};

export function LeadSlot(_props: {
  toolSlug: string;
  /** builds the resultSummary string from current result state */
  resultSummary?: string;
}) {
  if (!LEADS_ENABLED) return null;
  // Phase 2 form goes here.
  return null;
}
