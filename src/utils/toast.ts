import { AxiosResponse } from "axios"
import toast from "react-hot-toast"

const apiToast = <T extends any>({
    promise,
    onSuccess = () => {},
    onFail,
    loadingText = "Loading..."
}: {
    promise: Promise<AxiosResponse<SuccessfulResponse<T>>>
    onSuccess?: (data: T) => void
    onFail?: () => void
    loadingText?: string
    showSuccess?: boolean
}) => {
    try {
        toast.promise(promise, {
            loading: loadingText,
            success: ({ data: { success, message, data } }) => {
                if (success) {
                    onSuccess?.(data)
                }
                return message
            },
            error: ({ data: { message, success } }) => {
                if (!success) {
                    onFail?.()
                }
                return message
            }
        })
    } catch (err) {
        toast.error("Something went wrong")
    }
}

export default apiToast
