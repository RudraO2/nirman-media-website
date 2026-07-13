"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ZodType } from "zod";

// The single place any tool reads/writes URL state (AD-5). Tools never touch
// searchParams directly, so encoding stays uniform and every tool is shareable
// via its link.
//
// NOTE: because this calls useSearchParams(), any page that renders a component
// using this hook MUST wrap it in <Suspense> — under `output: export` the
// production build fails otherwise ("Missing Suspense boundary with useSearchParams").
//
// State lives in React (source of truth for rendering) and is mirrored to the
// URL via history.replaceState — no router navigation, so live recompute on
// every keystroke/drag stays cheap.

type Primitive = number | string | boolean;

export function useToolState<T extends Record<string, Primitive>>(
  schema: ZodType<T>,
  defaults: T
): [T, (patch: Partial<T>) => void] {
  const searchParams = useSearchParams();

  const [state, setState] = useState<T>(() => {
    const raw: Record<string, Primitive> = { ...defaults };
    for (const key of Object.keys(defaults)) {
      const v = searchParams.get(key);
      if (v === null) continue;
      const dv = defaults[key];
      if (typeof dv === "number") raw[key] = Number(v);
      else if (typeof dv === "boolean") raw[key] = v === "true";
      else raw[key] = v;
    }
    const parsed = schema.safeParse(raw);
    return parsed.success ? parsed.data : defaults;
  });

  const patch = useCallback(
    (p: Partial<T>) => {
      setState((prev) => {
        const merged = { ...prev, ...p };
        const parsed = schema.safeParse(merged);
        const next = parsed.success ? parsed.data : merged;

        if (typeof window !== "undefined") {
          const params = new URLSearchParams();
          for (const key of Object.keys(defaults)) {
            const val = next[key];
            // keep the URL short: only serialize values that differ from default
            if (val !== undefined && val !== defaults[key]) {
              params.set(key, String(val));
            }
          }
          const qs = params.toString();
          const url = qs
            ? `${window.location.pathname}?${qs}`
            : window.location.pathname;
          window.history.replaceState(null, "", url);
        }

        return next as T;
      });
    },
    [schema, defaults]
  );

  return [state, patch];
}
