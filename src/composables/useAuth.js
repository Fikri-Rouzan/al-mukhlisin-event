import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabase";
import { useRouter } from "vue-router";

const user = ref(null);
const profile = ref(null);

export function useAuth() {
  const router = useRouter();

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      profile.value = data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      profile.value = null;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      user.value = null;
      profile.value = null;
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  onMounted(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      user.value = session?.user || null;
      if (user.value) {
        await fetchProfile(user.value.id);
      } else {
        profile.value = null;
      }
    });
  });

  return {
    user,
    profile,
    logout,
  };
}
