import "dotenv/config"
import { createClient } from "@supabase/supabase-js"


const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)


export let doesEmailExists = async (email) => {
    const query = await supabase.from('usuarios').select('email').eq('email', email);
    return (query.data.length <= 0 || query.error) ? false : true;
};
