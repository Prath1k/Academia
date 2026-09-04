import { supabase, isSupabaseConfigured } from './supabaseClient';
import { UserRole } from '../types/database';
import { MOCK_PROFILES } from '../data/mockFallbackData';

const PENDING_ROLE_KEY = 'academia_pending_auth_role';
const ACTIVE_SESSION_USER_KEY = 'academia_active_session_user';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  avatarUrl?: string;
  institutionOrCompany?: string;
  department?: string;
  bio?: string;
  phone?: string;
  isDemoUser?: boolean;
}

export const authService = {
  // 1. Google OAuth with Role Preservation
  async signInWithGoogle(role: UserRole): Promise<{ error?: string }> {
    localStorage.setItem(PENDING_ROLE_KEY, role);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
        });
        if (error) return { error: error.message };
        return {};
      } catch (err: unknown) {
        return { error: (err as Error).message };
      }
    } else {
      // If running without live Google OAuth keys yet, simulate a smooth role login
      this.simulateDemoLogin(role);
      return {};
    }
  },

  // 2. Email & Password Sign In
  async signInWithEmail(email: string, pass: string, role: UserRole): Promise<{ user?: AuthUser; error?: string }> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass
        });
        if (error) return { error: error.message };
        if (data.user) {
          const authUser = await this.syncUserProfile(data.user.id, data.user.email || email, role);
          this.saveLocalSession(authUser);
          return { user: authUser };
        }
      } catch (err: unknown) {
        return { error: (err as Error).message };
      }
    }
    // Fallback demo login
    return this.simulateDemoLogin(role, email);
  },

  // 3. Email Sign Up
  async signUpWithEmail(
    email: string,
    pass: string,
    role: UserRole,
    fullName: string,
    institutionOrCompany: string
  ): Promise<{ user?: AuthUser; error?: string; message?: string }> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: {
              role,
              full_name: fullName,
              institution_or_company: institutionOrCompany
            }
          }
        });
        if (error) return { error: error.message };
        if (data.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            email,
            role,
            fullName,
            institutionOrCompany
          };
          // Insert profile into Supabase profiles table
          const { error: profileError } = await supabase.from('profiles').upsert([
            {
              id: data.user.id,
              role,
              full_name: fullName,
              email,
              institution_or_company: institutionOrCompany
            }
          ]);
          if (profileError) return { error: profileError.message };
          this.saveLocalSession(authUser);
          return { user: authUser, message: 'Account registered successfully!' };
        }
      } catch (err: unknown) {
        return { error: (err as Error).message };
      }
    }
    return this.simulateDemoLogin(role, email, fullName, institutionOrCompany);
  },

  // 4. Sign Out
  async signOut(): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out warning:', err);
      }
    }
    localStorage.removeItem(ACTIVE_SESSION_USER_KEY);
    localStorage.removeItem(PENDING_ROLE_KEY);
  },

  // 5. Get current active session
  async getCurrentUser(): Promise<AuthUser | null> {
    // Check if coming back from OAuth redirect
    const pendingRole = (localStorage.getItem(PENDING_ROLE_KEY) as UserRole) || 'student';

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const user = session.user;
          const assignedRole = (user.user_metadata?.role as UserRole) || pendingRole;
          const authUser = await this.syncUserProfile(
            user.id,
            user.email || '',
            assignedRole,
            user.user_metadata?.full_name || user.email?.split('@')[0],
            user.user_metadata?.avatar_url
          );
          localStorage.removeItem(PENDING_ROLE_KEY);
          this.saveLocalSession(authUser);
          return authUser;
        }
      } catch (err) {
        console.warn('Session retrieval error:', err);
      }

      // A live app must not treat a client-controlled demo session as auth.
      return null;
    }

    // Check stored local session
    const saved = localStorage.getItem(ACTIVE_SESSION_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as AuthUser;
      } catch {
        // invalid JSON
      }
    }

    return null;
  },

  // Helper: Sync Supabase User with public.profiles
  async syncUserProfile(
    userId: string,
    email: string,
    role: UserRole,
    fullName?: string,
    avatarUrl?: string
  ): Promise<AuthUser> {
    const defaultName = fullName || email.split('@')[0] || 'User';

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: existing } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (existing) {
          if (existing.role === 'student') {
            await this.ensureStudentProfile(userId);
          }
          return {
            id: existing.id,
            email: existing.email,
            role: existing.role,
            fullName: existing.full_name,
            avatarUrl: existing.avatar_url,
            institutionOrCompany: existing.institution_or_company,
            department: existing.department,
            bio: existing.bio,
            phone: existing.phone
          };
        } else {
          // Upsert new profile record
          const { error: profileError } = await supabase.from('profiles').upsert([
            {
              id: userId,
              role,
              full_name: defaultName,
              email,
              avatar_url: avatarUrl,
              institution_or_company: role === 'student' ? 'State University' : role === 'academician' ? 'Research Institute' : 'Corporate Partner'
            }
          ]);
          if (profileError) throw new Error(profileError.message);
          if (role === 'student') {
            await this.ensureStudentProfile(userId);
          }
        }
      } catch (err) {
        console.warn('Profile sync error:', err);
      }
    }

    return {
      id: userId,
      email,
      role,
      fullName: defaultName,
      avatarUrl
    };
  },

  async updateProfile(
    userId: string,
    updates: {
      fullName: string;
      institutionOrCompany: string;
      department: string;
      bio: string;
      phone: string;
    }
  ): Promise<AuthUser> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.fullName,
          institution_or_company: updates.institutionOrCompany,
          department: updates.department,
          bio: updates.bio,
          phone: updates.phone
        })
        .eq('id', userId)
        .select('*')
        .single();
      if (error) throw new Error(error.message);
      const updatedUser: AuthUser = {
        id: data.id,
        email: data.email,
        role: data.role,
        fullName: data.full_name,
        avatarUrl: data.avatar_url,
        institutionOrCompany: data.institution_or_company,
        department: data.department,
        bio: data.bio,
        phone: data.phone
      };
      this.saveLocalSession(updatedUser);
      return updatedUser;
    }

    const saved = localStorage.getItem(ACTIVE_SESSION_USER_KEY);
    const updatedUser: AuthUser = {
      ...(saved ? JSON.parse(saved) : {}),
      id: userId,
      fullName: updates.fullName,
      institutionOrCompany: updates.institutionOrCompany
    } as AuthUser;
    this.saveLocalSession(updatedUser);
    return updatedUser;
  },

  async ensureStudentProfile(userId: string): Promise<void> {
    if (!supabase || !isSupabaseConfigured()) return;
    const { data, error } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('profile_id', userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) {
      const { error: insertError } = await supabase.from('student_profiles').insert({
        profile_id: userId,
        degree: 'Student',
        major: 'Undeclared'
      });
      if (insertError) throw new Error(insertError.message);
    }
  },

  // Helper: Simulated / Demo Quick Login for testing & judging
  simulateDemoLogin(role: UserRole, email?: string, name?: string, org?: string): { user: AuthUser } {
    const defaultMock = MOCK_PROFILES.find(p => p.role === role) || MOCK_PROFILES[0];
    const authUser: AuthUser = {
      id: defaultMock.id,
      email: email || defaultMock.email,
      role,
      fullName: name || defaultMock.full_name,
      avatarUrl: defaultMock.avatar_url,
      institutionOrCompany: org || defaultMock.institution_or_company,
      department: defaultMock.department,
      bio: defaultMock.bio,
      phone: defaultMock.phone,
      isDemoUser: true
    };
    this.saveLocalSession(authUser);
    return { user: authUser };
  },

  saveLocalSession(user: AuthUser) {
    localStorage.setItem(ACTIVE_SESSION_USER_KEY, JSON.stringify(user));
  }
};
