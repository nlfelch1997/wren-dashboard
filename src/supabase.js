import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fhzfswtebgdgsmfqmtha.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoemZzd3RlYmdkZ3NtZnFtdGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNDM2MjIsImV4cCI6MjA5NDcxOTYyMn0.F5SHFIzvbfubPIjo_ph9wG8CVIt-HnAGjReculn3E0E'

export const supabase = createClient(supabaseUrl, supabaseKey)