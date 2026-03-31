import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oajmnpdvdvbvyhzzfcrq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ham1ucGR2ZHZidnloenpmY3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MTMxNTEsImV4cCI6MjA5MDQ4OTE1MX0.IwEw37BzbZOa6tGx4ECpUVPXArSwZfUS2AargHTH-ts'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
