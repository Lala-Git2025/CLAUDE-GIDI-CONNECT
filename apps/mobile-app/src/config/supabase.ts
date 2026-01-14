import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://xvtjcpwkrsoyrhhptdmc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dGpjcHdrcnNveXJoaHB0ZG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MzEyNDUsImV4cCI6MjA3MTQwNzI0NX0.F8Qbp8zUNVi0ONWsIxFJcWrRmVIFJuah8tEBf92K160';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
