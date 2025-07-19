import { ref } from "vue";
import { supabase } from "../lib/supabase";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const user = ref(null);
const profile = ref(null);

const showNotification = (options) => {
  const baseOptions = {
    timer: 2000,
    timerProgressBar: true,
    customClass: {
      container: "swal-container",
    },
  };
  Swal.fire({ ...baseOptions, ...options });
};

supabase.auth.onAuthStateChange(async (event, session) => {
  const currentUser = session?.user || null;
  user.value = currentUser;

  if (currentUser) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (error) throw error;
      profile.value = data;
    } catch (error) {
      profile.value = null;
      console.error("Gagal mengambil profil:", error.message);
      showNotification({
        icon: "error",
        title: "Gagal Memuat Profil!",
        text: "Terjadi masalah saat mengambil data profil Anda.",
      });
    }
  } else {
    profile.value = null;
  }
});

export function useAuth() {
  const router = useRouter();

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      showNotification({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Logout Berhasil!",
        showConfirmButton: false,
      });

      router.push("/");
    } catch (error) {
      showNotification({
        icon: "error",
        title: "Logout Gagal!",
        text: error.message,
      });
    }
  };

  return {
    user,
    profile,
    logout,
  };
}
