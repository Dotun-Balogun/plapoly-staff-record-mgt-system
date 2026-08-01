import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database.types";

/**
 * Supabase client for use in Client Components ("use client").
 * Safe to call multiple times — @supabase/ssr reuses the underlying client.
 *
 * NOTE: Not parameterized with <Database> at the client-creation call site.
 * @supabase/supabase-js's generic Database shape is strict about matching
 * its internal `Relationships` metadata; until you run
 * `supabase gen types typescript --linked` against a live project, hand-typed
 * schemas like ours can trip that inference. Query results are cast to our
 * domain types in the service layer instead (see `src/services/*`), which
 * keeps full type-safety without fighting the generic.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type { Database };
