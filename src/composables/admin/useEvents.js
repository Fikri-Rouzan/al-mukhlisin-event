import { ref, reactive, watch } from "vue";
import { supabase } from "../../lib/supabase";

import { useNotifications } from "./useNotifications";
import { usePagination } from "./usePagination";
import { useSearch } from "./useSearch";
import { usePhotoUpload } from "./usePhotoUpload";

export function useEvents() {
  const events = ref([]);
  const allCommittee = ref([]);
  const allSpeakers = ref([]);
  const form = reactive({ data: {} });
  const loading = ref(true);
  const isModalOpen = ref(false);
  const isEditMode = ref(false);
  const isSaving = ref(false);
  const totalItems = ref(0);

  const { showSuccessToast, showErrorAlert, showConfirmDialog } =
    useNotifications();
  const {
    uploadPhoto,
    deletePhoto,
    handleFileChange,
    resetPhotoState,
    ...photoState
  } = usePhotoUpload("event-photos");
  const { currentPage, rowsPerPage, offset, changePage, resetPage } =
    usePagination(totalItems);
  const { searchQuery } = useSearch(() => {
    resetPage();
    fetchAllData();
  });

  async function fetchAllData() {
    loading.value = true;
    try {
      let eventsQuery = supabase
        .from("events")
        .select("*, committee_members(id, name), speakers(id, name)", {
          count: "exact",
        })
        .order("event_date", { ascending: false });

      if (searchQuery.value) {
        const query = `%${searchQuery.value}%`;
        eventsQuery = eventsQuery.or(
          `name.ilike.${query},category.ilike.${query}`
        );
      }

      const eventsPromise = eventsQuery.range(
        offset.value,
        offset.value + rowsPerPage.value - 1
      );

      const committeePromise =
        allCommittee.value.length === 0
          ? supabase.from("committee_members").select("id, name")
          : Promise.resolve({ data: allCommittee.value });

      const speakersPromise =
        allSpeakers.value.length === 0
          ? supabase.from("speakers").select("id, name")
          : Promise.resolve({ data: allSpeakers.value });

      const [eventsRes, committeeRes, speakersRes] = await Promise.all([
        eventsPromise,
        committeePromise,
        speakersPromise,
      ]);

      if (eventsRes.error) throw eventsRes.error;
      if (committeeRes.error) throw committeeRes.error;
      if (speakersRes.error) throw speakersRes.error;

      events.value = eventsRes.data;
      totalItems.value = eventsRes.count;
      if (allCommittee.value.length === 0)
        allCommittee.value = committeeRes.data;
      if (allSpeakers.value.length === 0) allSpeakers.value = speakersRes.data;
    } catch (error) {
      showErrorAlert(error.message);
    } finally {
      loading.value = false;
    }
  }

  watch([currentPage, rowsPerPage], fetchAllData);

  async function saveItem() {
    isSaving.value = true;
    try {
      const oldPhotoUrlOnForm = form.data.photo_url;
      let finalPhotoUrl = oldPhotoUrlOnForm;

      if (photoState.newPhotoFile.value) {
        finalPhotoUrl = await uploadPhoto();
      }

      const payload = {
        ...form.data,
        photo_url: finalPhotoUrl,
        old_photo_url:
          isEditMode.value && photoState.newPhotoFile.value
            ? oldPhotoUrlOnForm
            : null,
        committee_ids: form.data.committee?.map((c) => c.id) || [],
        speaker_ids: form.data.speakers?.map((s) => s.id) || [],
      };
      delete payload.committee;
      delete payload.speakers;
      delete payload.created_at;

      const { error } = await supabase.functions.invoke("manage-event", {
        method: isEditMode.value ? "PATCH" : "POST",
        body: payload,
      });

      if (error) throw error;
      showSuccessToast(
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
    const { isConfirmed } = await showConfirmDialog(
      "Anda Yakin?",
      `Data kegiatan "${event.name}" akan dihapus.`
    );
    if (!isConfirmed) return;

    try {
      const { error } = await supabase.functions.invoke("manage-event", {
        method: "DELETE",
        body: { id: event.id, photo_url: event.photo_url },
      });
      if (error) throw error;
      showSuccessToast(`Data kegiatan "${event.name}" berhasil dihapus.`);
      fetchAllData();
    } catch (error) {
      showErrorAlert(error.message);
    }
  }

  function openModal(initialData = {}) {
    isEditMode.value = false;
    form.data = { committee: [], speakers: [], ...initialData };
    resetPhotoState();
    isModalOpen.value = true;
  }

  async function openEditModal(event) {
    isEditMode.value = true;
    loading.value = true;
    try {
      const { data, error } = await supabase.rpc("get_event_details", {
        p_event_id: event.id,
      });
      if (error) throw error;

      const eventDetails = data.details || {};
      if (eventDetails.event_date) {
        eventDetails.event_date = eventDetails.event_date.slice(0, 16);
      }

      form.data = {
        ...eventDetails,
        committee: data.committee || [],
        speakers: data.speakers || [],
      };

      resetPhotoState();
      if (event.photo_url) {
        photoState.photoPreview.value = event.photo_url;
      }
      isModalOpen.value = true;
    } catch (error) {
      showErrorAlert(error.message);
    } finally {
      loading.value = false;
    }
  }

  function closeModal() {
    isModalOpen.value = false;
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
    ...photoState,
  };
}
