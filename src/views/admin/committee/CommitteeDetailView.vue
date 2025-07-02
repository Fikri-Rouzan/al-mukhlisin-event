<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "../../../lib/supabase";
import Swal from "sweetalert2";
import { ArrowLeft, UserCircle2 } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const member = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const memberId = route.params.id;
    const { data, error } = await supabase
      .from("committee_members")
      .select("*")
      .eq("id", memberId)
      .single();

    if (error) throw error;
    member.value = data;
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        container: "swal-container",
      },
    });
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="px-6 py-4">
    <button
      @click="router.back()"
      class="mb-6 inline-flex items-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 cursor-pointer transition-colors"
    >
      <ArrowLeft :size="20" />
      <span>Kembali</span>
    </button>

    <div v-if="loading" class="text-center py-10">Loading...</div>
    <div v-else-if="!member" class="text-center py-10">
      Data panitia tidak ditemukan
    </div>

    <div v-else class="bg-white p-6 sm:p-8 rounded-lg shadow-md">
      <div
        class="flex flex-col items-center md:flex-row md:items-start md:space-x-8"
      >
        <div class="w-32 h-32 md:w-40 md:h-40 mb-6 md:mb-0 flex-shrink-0">
          <img
            v-if="member.photo_url"
            :src="member.photo_url"
            alt="Photo"
            class="w-full h-full rounded-full object-cover border-4 border-gray-100"
          />
          <UserCircle2 v-else class="w-full h-full text-gray-300" />
        </div>

        <div class="w-full text-center md:text-left">
          <div class="space-y-6">
            <div>
              <p class="text-2xl sm:text-3xl font-bold text-primary capitalize">
                {{ member.name }}
              </p>
            </div>

            <hr class="my-4" />

            <div class="text-left space-y-1">
              <h3
                class="font-bold text-gray-500 uppercase text-base tracking-wider"
              >
                Jabatan
              </h3>
              <p class="text-lg text-gray-800 capitalize">
                {{ member.position }}
              </p>
            </div>

            <div class="text-left space-y-1">
              <h3
                class="font-bold text-gray-500 uppercase text-base tracking-wider"
              >
                Nomor Telepon
              </h3>
              <p class="text-lg text-gray-800">
                {{ member.phone_number || "-" }}
              </p>
            </div>

            <div class="text-left space-y-1">
              <h3
                class="font-bold text-gray-500 uppercase text-base tracking-wider"
              >
                Alamat
              </h3>
              <p class="text-lg text-gray-800 whitespace-pre-wrap">
                {{ member.address || "-" }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
