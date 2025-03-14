import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types_db'

export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: 'cafeforwork' },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    }
  )
} 