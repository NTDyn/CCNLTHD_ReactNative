import { createClient } from '@supabase/supabase-js'

// Hàm định dạng database
export const supabase = createClient(
    'https://zdtkbwdpucurfjbiyaps.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkdGtid2RwdWN1cmZqYml5YXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyOTg4ODQsImV4cCI6MjA2MDg3NDg4NH0.AmwF2HnvfWuHFSo9ldPkd81aqPIk8o7IcV2Rg-Emx3U')