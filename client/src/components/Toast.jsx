import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-start",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const fireToast = (icon, title) => {
  Toast.fire({
    icon: icon,
    title: title,
  });
};
