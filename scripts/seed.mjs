import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

if (
  !process.env.VITE_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_KEY ||
  !process.env.ADMIN_EMAIL ||
  !process.env.ADMIN_PASSWORD
) {
  console.error("Error: Missing required environment variables");
  process.exit(1);
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const seedAdmin = async () => {
  console.log("Attempting to create admin...");

  try {
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        email_confirm: true,
      });

    if (authError) {
      if (authError.message.includes("Admin already exists")) {
        console.log("Admin already exists. Skipping creation");
        return;
      }
      throw new Error(`${authError.message}`);
    }

    const user = authData.user;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", user.id);

    if (profileError) {
      throw new Error(`${profileError.message}`);
    }

    console.log("Admin seeding complete!");
  } catch (error) {
    console.error("Error during admin seeding:", error.message);
  }
};

seedAdmin();
