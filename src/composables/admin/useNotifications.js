import Swal from "sweetalert2";

export function useNotifications() {
  const baseOptions = {
    timer: 2000,
    timerProgressBar: true,
    customClass: { container: "swal-container" },
  };

  const showSuccessToast = (title) => {
    Swal.fire({
      ...baseOptions,
      toast: true,
      position: "top-end",
      icon: "success",
      title: title,
      showConfirmButton: false,
    });
  };

  const showErrorAlert = (text) => {
    Swal.fire({
      ...baseOptions,
      icon: "error",
      title: "Terjadi Kesalahan!",
      text: text,
    });
  };

  const showConfirmDialog = (title, text) => {
    return Swal.fire({
      title: title,
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fb2c36",
      confirmButtonText: "Ya, Lanjutkan!",
      cancelButtonText: "Batal",
      customClass: { container: "swal-container" },
    });
  };

  return { showSuccessToast, showErrorAlert, showConfirmDialog };
}
