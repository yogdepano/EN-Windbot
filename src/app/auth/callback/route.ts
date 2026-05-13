import { createClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && user) {
      // Ensure discord_id is populated in profile since the trigger misses it
      const providerId = user.identities?.find(i => i.provider === 'discord')?.id || user.user_metadata?.provider_id;
      if (providerId) {
        await supabase.from('profiles').update({ discord_id: providerId }).eq('id', user.id);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
    
    // If we reach here, there was an error exchanging the code
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error?.message || 'Unknown authentication error')}`);
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=No_code_provided`);
}
