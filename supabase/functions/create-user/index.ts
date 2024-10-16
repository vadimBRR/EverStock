import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@1.30.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { data, type } = (await req.json());

    const { id, email_addresses, first_name, last_name, image_url } = data;
    const email = email_addresses[0].email_address;
    const full_name = `${first_name ?? ''} ${last_name ?? ''}`.trim();

    if (type === 'user.created') {
      const { data: insertData, error } = await supabase
        .from('users')
        .insert({ id, email, avatar_url: image_url, full_name: full_name });

      if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
      }

      return new Response(JSON.stringify(insertData), {
        headers: { 'Content-Type': 'application/json' },
        status: 201,
      });
    } else if (type === 'user.updated') {
      const { data: updateData, error } = await supabase
        .from('users')
        .update({ email, avatar_url: image_url, full_name: full_name })
        .eq('id', id);

      if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
      }

      return new Response(JSON.stringify(updateData), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    } else {
      return new Response('Invalid event type', { status: 400 });
    }
  } catch (err) {
    console.log(err);

    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
