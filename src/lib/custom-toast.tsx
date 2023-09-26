import { toast } from "vue-sonner";
import { markRaw } from "vue";
import ToastCustom from "@components/ToastCustom.vue";

type Options = {
  onClickBtn: () => void
  labelBtn: string
}

export function customToast(message: string, options?: Partial<Options>, optionsLib?: object) {
  toast.custom(
    markRaw(
      <ToastCustom
        message={message}
        onClickBtn={options?.onClickBtn}
        labelBtn={options?.labelBtn}
      />
    ),
    {duration: 5000, ...optionsLib}
  )
}
