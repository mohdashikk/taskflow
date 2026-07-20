import { createClient } from "@supabase/supabase-js";
const url = "https://oseonkqubhztqjoyhwlz.supabase.co";
const key = "sb_publishable_iEEbv1t6abJ0GmVhbvhu6A_XROj3K-E";
const sb = createClient(url, key);
const res = await sb.rpc("get_table_def", {}).maybeSingle?.();
