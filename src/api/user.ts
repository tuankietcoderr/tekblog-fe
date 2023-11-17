import { AxiosResponse } from "axios"
import apiInstance from "."

class UserController implements IApi {
    readonly path: string = "/user"
    private readonly PATHS = {
        ROOT: this.path
    }

    async getCurrentUser(): Promise<AxiosResponse<SuccessfulResponse<IUser>>> {
        try {
            const userRes = await apiInstance.get(this.PATHS.ROOT)
            return userRes
        } catch (error) {
            return error.response
        }
    }
}

const UserApiController = new UserController()

export default UserApiController
