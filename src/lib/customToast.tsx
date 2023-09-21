import { toast } from "vue-sonner";
import { markRaw } from "vue";
import ToastCustom from "@components/ToastCustom.vue";

export function customToast(message, options) {
  return toast.custom(
    markRaw(
      <ToastCustom
        message={message}
        to={options.to}
      />
    ),
    options
  )
}
