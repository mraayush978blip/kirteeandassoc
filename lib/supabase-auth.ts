// Client-safe Supabase REST Authentication Helper (Zero-dependency)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wxxhabblkxszfsogbbju.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4eGhhYmJsa3hzemZzb2diYmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1ODY3ODEsImV4cCI6MjEwODE2Mjc4MX0.wwhXzDR3J9azBYWOcLxLqg_-1kK2HlY9cZfV35nZxD0';

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
  user_metadata?: Record<string, unknown>;
}

export interface AuthSession {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user: AuthUser;
}

export async function loginWithSupabase(email: string, password: string): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.error_description || data.msg || data.message || 'Invalid email or password.',
      };
    }

    return {
      success: true,
      session: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role,
          user_metadata: data.user.user_metadata,
        },
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error during authentication.',
    };
  }
}

export async function sendMagicLink(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.error_description || data.msg || data.message || 'Failed to send OTP link.',
      };
    }

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error sending magic link.',
    };
  }
}
