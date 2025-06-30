import { ref, reactive, watch } from "vue";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";

function debounce(fn, delay = 500) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function useEvents() {
  const events = ref([]);
  const allCommittee = ref([]);
  const allSpeakers = ref([]);

  const loading = ref(true);
  const isModalOpen = ref(false);
  const isEditMode = ref(false);
  const isSaving = ref(false);

  const form = reactive({ data: {} });
  const newPhotoFile = ref(null);
  const photoPreview = ref(null);

  const searchQuery = ref("");
  const currentPage = ref(1);
  const rowsPerPage = ref(10);
  const totalItems = ref(0);

  async function fetchAllData() {
    try {
      loading.value = true;
      const from = (currentPage.value - 1) * rowsPerPage.value;
      const to = from + rowsPerPage.value - 1;

      let eventsQuery = supabase
        .from("events")
        .select("*", { count: "exact" })
        .order("event_date", { ascending: false });

      if (searchQuery.value) {
        const query = `%${searchQuery.value}%`;
        eventsQuery = eventsQuery.or(
          `name.ilike.${query},category.ilike.${query}`
        );
      }

      const [eventsRes, committeeRes, speakersRes] = await Promise.all([
        eventsQuery.range(from, to),
        supabase.from("committee_members").select("id, name"),
        supabase.from("speakers").select("id, name"),
      ]);

      if (eventsRes.error) throw eventsRes.error;
      if (committeeRes.error) throw committeeRes.error;
      if (speakersRes.error) throw speakersRes.error;

      events.value = eventsRes.data;
      totalItems.value = eventsRes.count;
      allCommittee.value = committeeRes.data;
      allSpeakers.value = speakersRes.data;
    } catch (error) {
      showErrorAlert(error.message);
    } finally {
      loading.value = false;
    }
  }

  watch(
    searchQuery,
    debounce(() => {
      currentPage.value = 1;
      fetchAllData();
    })
  );

  watch(rowsPerPage, () => {
    currentPage.value = 1;
    fetchAllData();
  });

  function changePage(page) {
    if (page > 0 && page <= Math.ceil(totalItems.value / rowsPerPage.value)) {
      currentPage.value = page;
      fetchAllData();
    }
  }

  async function saveItem() {
    isSaving.value = true;
    let finalPhotoUrl = form.data.photo_url;

    try {
      if (newPhotoFile.value) {
        if (isEditMode.value && form.data.photo_url) {
          const oldFilePath = new URL(form.data.photo_url).pathname
            .split("event-photos/")
            .pop();
          await supabase.storage.from("event-photos").remove([oldFilePath]);
        }
        const fileName = `${Date.now()}-${newPhotoFile.value.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("event-photos")
          .upload(fileName, newPhotoFile.value);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("event-photos")
          .getPublicUrl(uploadData.path);
        finalPhotoUrl = urlData.publicUrl;
      }

      const payload = {
        ...form.data,
        photo_url: finalPhotoUrl,
        committee_ids: form.data.committee.map((c) => c.id),
        speaker_ids: form.data.speakers.map((s) => s.id),
      };
      delete payload.committee;
      delete payload.speakers;
      delete payload.created_at;

      const { error } = await supabase.functions.invoke("manage-event", {
        method: isEditMode.value ? "PATCH" : "POST",
        body: payload,
      });

      if (error) throw error;
      showSuccessAlert(
        `Data kegiatan berhasil ${
          isEditMode.value ? "diperbarui" : "ditambahkan"
        }`
      );
      closeModal();
      fetchAllData();
    } catch (error) {
      showErrorAlert(error.message);
    } finally {
      isSaving.value = false;
    }
  }

  async function deleteItem(event) {
    const { isConfirmed } = await showConfirmAlert(event.name);
    if (isConfirmed) {
      try {
        const { error } = await supabase.functions.invoke("manage-event", {
          method: "DELETE",
          body: { id: event.id, photo_url: event.photo_url },
        });
        if (error) throw error;
        showSuccessAlert(`Data kegiatan ${event.name} berhasil dihapus`);
        fetchAllData();
      } catch (error) {
        showErrorAlert(error.message);
      }
    }
  }

  function openModal(initialData) {
    isEditMode.value = false;
    form.data = { ...initialData };
    resetPhotoState();
    isModalOpen.value = true;
  }

  async function openEditModal(event) {
    isEditMode.value = true;
    const { data, error } = await supabase.rpc("get_event_details", {
      p_event_id: event.id,
    });
    if (error) return showErrorAlert(error.message);

    const eventDetails = data.details;
    if (eventDetails.event_date) {
      eventDetails.event_date = eventDetails.event_date.slice(0, 16);
    }

    form.data = {
      ...eventDetails,
      committee: data.committee,
      speakers: data.speakers,
    };
    resetPhotoState();
    photoPreview.value = event.photo_url;
    isModalOpen.value = true;
  }

  function closeModal() {
    isModalOpen.value = false;
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      newPhotoFile.value = file;
      photoPreview.value = URL.createObjectURL(file);
    }
  }

  function resetPhotoState() {
    newPhotoFile.value = null;
    photoPreview.value = null;
  }

  function showSuccessAlert(text) {
    Swal.fire({
      toast: true,
      position: "top-end",
      title: "Sukses!",
      text,
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        container: "swal-container",
      },
    });
  }

  function showErrorAlert(text) {
    Swal.fire({
      title: "Error!",
      text,
      icon: "error",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        container: "swal-container",
      },
    });
  }

  function showConfirmAlert(name) {
    return Swal.fire({
      title: "Apa Anda Yakin?",
      text: `Anda akan menghapus ${name} dari data kegiatan`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fb2c36",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Tidak, Batalkan!",
      customClass: {
        container: "swal-container",
      },
    });
  }

  return {
    events,
    allCommittee,
    allSpeakers,
    loading,
    isModalOpen,
    isEditMode,
    isSaving,
    form,
    photoPreview,
    searchQuery,
    currentPage,
    totalItems,
    rowsPerPage,
    changePage,
    fetchAllData,
    saveItem,
    deleteItem,
    openModal,
    openEditModal,
    closeModal,
    handleFileChange,
  };
}
