import { AxiosResponse } from "axios"
import apiInstance from "."

class VerifyController implements IApi {
    readonly path: string = "/verify"

    private readonly PATHS = {
        ROOT: this.path,
        EMAIL: `${this.path}/email`,
        SEND: `${this.path}/email/send`
    }

    async verifyEmail(token: string): Promise<AxiosResponse<SuccessfulResponse>> {
        try {
            const verifyRes = await apiInstance.put(this.PATHS.EMAIL, {
                token
            })
            return verifyRes
        } catch (error) {
            throw error.response
        }
    }

    async sendVerifyEmail(): Promise<AxiosResponse<SuccessfulResponse>> {
        try {
            const verifyRes = await apiInstance.post(this.PATHS.SEND)
            return verifyRes
        } catch (error) {
            throw error.response
        }
    }
}

const VerifyApiController = new VerifyController()

export default VerifyApiController
