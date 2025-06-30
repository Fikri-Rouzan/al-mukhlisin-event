<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "../../../lib/supabase";
import Swal from "sweetalert2";
import { User, Briefcase, Phone, MapPin, UserCircle2 } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();

const isEditMode = ref(false);
const committeeForm = ref({
  name: "",
  position: "",
  phone_number: "",
  address: "",
  photo_url: "",
});
const isSaving = ref(false);
const newPhotoFile = ref(null);
const photoPreview = ref(null);

const committeeId = route.params.id;
if (committeeId) {
  isEditMode.value = true;
}

function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    newPhotoFile.value = file;
    photoPreview.value = URL.createObjectURL(file);
  }
}

async function fetchCommitteeData() {
  if (!isEditMode.value) return;
  try {
    const { data, error } = await supabase
      .from("committee_members")
      .select("*")
      .eq("id", committeeId)
      .single();

    if (error) throw error;

    if (data) {
      committeeForm.value = data;
      photoPreview.value = data.photo_url;
    } else {
      throw new Error("Data panitia tidak ditemukan");
    }
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
    router.push({ name: "AdminCommittee" });
  }
}

async function handleSave() {
  isSaving.value = true;
  let finalPhotoUrl = committeeForm.value.photo_url;

  try {
    if (newPhotoFile.value) {
      if (isEditMode.value && committeeForm.value.photo_url) {
        const oldFilePath = new URL(committeeForm.value.photo_url).pathname
          .split("committee-photos/")
          .pop();
        await supabase.storage.from("committee-photos").remove([oldFilePath]);
      }
      const fileName = `${Date.now()}-${newPhotoFile.value.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("committee-photos")
        .upload(fileName, newPhotoFile.value);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage
        .from("committee-photos")
        .getPublicUrl(uploadData.path);
      finalPhotoUrl = urlData.publicUrl;
    }

    const payloadBody = {
      ...committeeForm.value,
      id: isEditMode.value ? committeeId : undefined,
      photo_url: finalPhotoUrl,
    };

    const { error } = await supabase.functions.invoke("manage-committee", {
      method: isEditMode.value ? "PATCH" : "POST",
      body: payloadBody,
    });
    if (error) throw error;

    Swal.fire({
      toast: true,
      position: "top-end",
      title: "Sukses!",
      text: `Data panitia berhasil ${
        isEditMode.value ? "diperbarui" : "ditambahkan"
      }`,
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        container: "swal-container",
      },
    });
    router.push({ name: "AdminCommittee" });
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
    isSaving.value = false;
  }
}

onMounted(fetchCommitteeData);
</script>

<template>
  <div class="px-6 py-4">
    <div class="mb-8">
      <h1 class="text-4xl font-bold">
        {{ isEditMode ? "Edit Data Panitia" : "Tambah Data Panitia" }}
      </h1>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md">
      <form @submit.prevent="handleSave" id="committee-form" class="space-y-4">
        <div>
          <p class="block text-sm font-medium text-gray-700">Foto</p>
          <div
            class="mt-1 flex flex-col items-start sm:flex-row sm:items-center gap-4"
          >
            <div class="w-20 h-20 flex-shrink-0">
              <img
                v-if="photoPreview"
                :src="photoPreview"
                alt="Preview"
                class="w-full h-full rounded-full object-cover"
              />
              <UserCircle2 v-else class="w-full h-full text-gray-300" />
            </div>
            <input
              type="file"
              @change="onFileChange"
              accept="image/*"
              class="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-primary hover:file:bg-violet-100"
            />
          </div>
        </div>

        <div>
          <label
            for="committee-name"
            class="block text-sm font-medium text-gray-700"
            >Nama</label
          >
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <User class="w-5 h-5 text-gray-400" />
            </div>
            <input
              v-model="committeeForm.name"
              type="text"
              id="committee-name"
              placeholder="Masukkan nama"
              required
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label
            for="committee-position"
            class="block text-sm font-medium text-gray-700"
            >Jabatan</label
          >
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Briefcase class="w-5 h-5 text-gray-400" />
            </div>
            <input
              v-model="committeeForm.position"
              type="text"
              placeholder="Masukkan posisi"
              required
              id="committee-position"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label
            for="committee-phone"
            class="block text-sm font-medium text-gray-700"
            >Nomor Telepon</label
          >
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Phone class="w-5 h-5 text-gray-400" />
            </div>
            <input
              v-model="committeeForm.phone_number"
              type="number"
              min="0"
              placeholder="Masukkan nomor telepon"
              required
              id="committee-phone"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label
            for="committee-address"
            class="block text-sm font-medium text-gray-700"
            >Alamat</label
          >
          <div class="relative mt-1">
            <div
              class="absolute top-0 left-0 pt-3 pl-3 flex items-center pointer-events-none"
            >
              <MapPin class="w-5 h-5 text-gray-400" />
            </div>
            <textarea
              v-model="committeeForm.address"
              id="committee-address"
              rows="3"
              placeholder="Masukkan alamat"
              required
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end md:justify-start items-center gap-4 pt-4">
          <router-link
            :to="{ name: 'AdminCommittee' }"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer transition-colors"
          >
            Batal
          </router-link>
          <button
            type="submit"
            :disabled="isSaving"
            class="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-md disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            {{ isSaving ? "Menyimpan..." : "Simpan" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
