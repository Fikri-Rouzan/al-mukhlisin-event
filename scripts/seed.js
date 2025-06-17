import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

async function createAdminUser() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!supabaseUrl || !serviceKey || !adminEmail || !adminPassword) {
    console.error("Error: Missing required environment variables");
    process.exit(1);
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log("Creating admin...");

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        role: "admin",
      },
    });

    if (error) {
      if (error.message.includes("Admin already exists")) {
        console.warn("Admin already exists. Skipping creation");
        return;
      }
      throw error;
    }

    console.log("✅ Admin created successfully");
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdminUser();
