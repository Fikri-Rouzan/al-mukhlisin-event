import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabase";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

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
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Gagal Mengambil Profil Pengguna!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      profile.value = null;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Logout Berhasil!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      user.value = null;
      profile.value = null;
      router.push("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Logout Gagal!",
        text: error.message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
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
