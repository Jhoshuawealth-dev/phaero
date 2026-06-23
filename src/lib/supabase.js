import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gxrvdjgiezflxwmrngdc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cnZkamdpZXpmbHh3bXJuZ2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3OTk1NzMsImV4cCI6MjA5NzM3NTU3M30.OHPHzrl_45miwVcRn2loyLDjIkuDllwbiUnzaKZDyaM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
