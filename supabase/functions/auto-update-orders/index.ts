import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get orders that need status updates
    const now = new Date()
    const prepTime = new Date(now.getTime() - 15 * 60 * 1000) // 15 minutes ago
    const readyTime = new Date(now.getTime() - 30 * 60 * 1000) // 30 minutes ago

    // Update pending orders to preparing (after 2 minutes)
    const { error: pendingError } = await supabaseClient
      .from('orders')
      .update({ status: 'preparing' })
      .eq('status', 'pending')
      .lt('created_at', new Date(now.getTime() - 2 * 60 * 1000).toISOString())

    if (pendingError) throw pendingError

    // Update preparing orders to ready_for_pickup (after 15 minutes)
    const { error: preparingError } = await supabaseClient
      .from('orders')
      .update({ status: 'ready_for_pickup' })
      .eq('status', 'preparing')
      .lt('created_at', prepTime.toISOString())

    if (preparingError) throw preparingError

    // Update ready orders to completed (after 30 minutes)
    const { error: readyError } = await supabaseClient
      .from('orders')
      .update({ status: 'completed' })
      .eq('status', 'ready_for_pickup')
      .lt('created_at', readyTime.toISOString())

    if (readyError) throw readyError

    return new Response(
      JSON.stringify({ message: 'Order statuses updated successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})