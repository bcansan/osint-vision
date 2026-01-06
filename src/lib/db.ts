import { supabaseAdmin } from './supabase';

export async function getUser(clerkId: string) {
    const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('clerk_id', clerkId)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is code for no rows found
    return data;
}

export async function createUser(clerkId: string, email: string) {
    const { data, error } = await supabaseAdmin
        .from('users')
        .insert({
            clerk_id: clerkId,
            email: email,
            tier: 'free',
            analyses_used: 0,
            analyses_limit: 1
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function incrementUsage(userId: string) {
    // Use RPC or raw SQL for atomic increment if possible, 
    // but for now we follow the user's requested pattern with a slight adjustment for Supabase syntax
    const { data, error } = await supabaseAdmin
        .rpc('increment_analyses_used', { user_id_param: userId });

    if (error) {
        // Fallback to update if RPC doesn't exist yet
        const { data: userData, error: fetchError } = await supabaseAdmin
            .from('users')
            .select('analyses_used')
            .eq('id', userId)
            .single();

        if (fetchError) throw fetchError;

        const { data: updatedData, error: updateError } = await supabaseAdmin
            .from('users')
            .update({
                analyses_used: (userData.analyses_used || 0) + 1
            })
            .eq('id', userId)
            .select()
            .single();

        if (updateError) throw updateError;
        return updatedData;
    }

    return data;
}

export async function logUsage(
    userId: string,
    mode: string,
    cost: number,
    success: boolean,
    errorMessage?: string
) {
    const { error } = await supabaseAdmin
        .from('usage_logs')
        .insert({
            user_id: userId,
            mode,
            cost,
            success,
            error_message: errorMessage
        });

    if (error) throw error;
}

export async function isAdminEmail(email: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
        .from('admin_emails')
        .select('email')
        .eq('email', email)
        .single();

    return !error && !!data;
}

export async function updateUserTier(
    userId: string,
    tier: 'free' | 'pro' | 'developer',
    limit: number
) {
    const { error } = await supabaseAdmin
        .from('users')
        .update({
            tier,
            analyses_limit: limit,
            analyses_used: 0,
            period_start: new Date().toISOString(),
            period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', userId);

    if (error) throw error;
}
