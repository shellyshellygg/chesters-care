import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qxotanljbijysofrbcdc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4b3RhbmxqYmlqeXNvZnJiY2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTU0MzQsImV4cCI6MjA5NjYzMTQzNH0.L8so07Y4mfsANHD04jDLV4VZ1RHbBj_7rMtordzTaI8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)