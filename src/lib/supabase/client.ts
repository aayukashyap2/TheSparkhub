import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

export function createSupabaseBrowserClient() {
  const { supabaseUrl, supabaseKey } = getSupabaseEnv();

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
