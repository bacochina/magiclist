import { createClient as createClientBase } from "@supabase/supabase-js"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClientBase(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })
} 