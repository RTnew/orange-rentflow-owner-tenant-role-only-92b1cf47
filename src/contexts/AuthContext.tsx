const signUp = async (email: string, password: string, role: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: role },  // 👈 THIS IS THE MAGIC LINE
      },
    });

    if (error) return { error };

    // Also insert into user_roles table
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({ user_id: data.user.id, role });

    if (roleError) return { error: roleError };

    return { error: null };
  } catch (error) {
    return { error };
  }
};