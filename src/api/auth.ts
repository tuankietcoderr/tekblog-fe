import { LOCAL_STORAGE_KEY } from "@/constants/local-storage-key"
import apiInstance from "."
import { AxiosError, AxiosResponse } from "axios"

class AuthController implements IApi {
    readonly path: string = "/auth"
    private readonly PATHS = {
        SIGN_IN: `${this.path}/signin`,
        REGISTER: `${this.path}/signup`
    }

    async signin({
        username,
        password
    }: {
        username: string
        password: string
    }): Promise<AxiosResponse<SuccessfulResponse<IUser>>> {
        try {
            const userRes = await apiInstance.post(this.PATHS.SIGN_IN, { username, password })
            const {
                data: { accessToken }
            } = userRes
            localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, accessToken)
            return userRes
        } catch (error) {
            return error.response
        }
    }

    async register(data: Partial<IUser>): Promise<AxiosResponse<SuccessfulResponse<IUser>>> {
        try {
            const userRes = await apiInstance.post(this.PATHS.REGISTER, data)
            return userRes
        } catch (error) {
            return error.response
        }
    }
}

const AuthApiController = new AuthController()

export default AuthApiController
