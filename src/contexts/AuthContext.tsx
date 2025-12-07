const signUp = async (
  email: string,
  password: string,
  fullName: string,
  phone: string,
  role: UserRole
) => {
  try {
    // 1) Create user in Supabase Auth and send metadata including ROLE
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role, // 👈 MOST IMPORTANT
        },
      },
    });

    if (error) {
      console.error("Signup error:", error);
      toast.error("Error creating account");
      return { error };
    }

    const userId = data.user?.id;
    if (!userId) {
      toast.error("User ID missing after signup");
      return { error: new Error("User ID missing") };
    }

    // 2) Insert role into user_roles table
    const { error: roleInsertError } = await supabase
      .from("user_roles")
      .insert({
        user_id: userId,
        role, // 👈 Save owner/tenant/admin
      });

    if (roleInsertError) {
      console.error("Role insert error:", roleInsertError);
      toast.error("Error assigning user role");
      return { error: roleInsertError };
    }

    toast.success("Account Created Successfully!");
    return { error: null };
  } catch (err) {
    console.error("Signup crashed:", err);
    toast.error("Unexpected error");
    return { error: err };
  }
};