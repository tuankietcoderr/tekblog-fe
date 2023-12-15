import { LOCAL_STORAGE_KEY } from "@/constants/local-storage-key"
import apiInstance from "."
import { AxiosError, AxiosResponse } from "axios"

class AuthController implements IApi {
    readonly path: string = "/auth"
    private readonly PATHS = {
        SIGN_IN: `${this.path}/signin`,
        REGISTER: `${this.path}/signup`,
        FORGOT_PASSWORD: `${this.path}/forgot-password`
    }

    async signin({
        usernameOrEmail,
        password
    }: {
        usernameOrEmail: string
        password: string
    }): Promise<AxiosResponse<SuccessfulResponse<IUser>>> {
        try {
            const userRes = await apiInstance.post(this.PATHS.SIGN_IN, { usernameOrEmail, password })
            const {
                data: { accessToken }
            } = userRes
            localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, accessToken)
            return userRes
        } catch (error) {
            throw error.response
        }
    }

    async register(data: Partial<IUser>): Promise<AxiosResponse<SuccessfulResponse<IUser>>> {
        try {
            const userRes = await apiInstance.post(this.PATHS.REGISTER, data)
            const {
                data: { accessToken }
            } = userRes
            localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, accessToken)
            return userRes
        } catch (error) {
            throw error.response
        }
    }

    async forgotPassword(usernameOrEmail: string): Promise<AxiosResponse<SuccessfulResponse>> {
        try {
            const res = await apiInstance.get(this.PATHS.FORGOT_PASSWORD, {
                params: { usernameOrEmail }
            })
            return res
        } catch (error) {
            throw error.response
        }
    }
}

const AuthApiController = new AuthController()

export default AuthApiController
