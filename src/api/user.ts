import { AxiosResponse } from "axios"
import apiInstance from "."

class UserController implements IApi {
    readonly path: string = "/user"
    private readonly PATHS = {
        ROOT: this.path,
        FOLLOW: `${this.path}/:userId/follow`
    }

    async getCurrentUser(): Promise<AxiosResponse<SuccessfulResponse<IUser>>> {
        try {
            const userRes = await apiInstance.get(this.PATHS.ROOT)
            return userRes
        } catch (error) {
            return error.response
        }
    }

    async follow(userId: string): Promise<AxiosResponse<SuccessfulResponse>> {
        try {
            const followRes = await apiInstance.put(this.PATHS.FOLLOW.replace(":userId", userId))
            return followRes
        } catch (error) {
            return error.response
        }
    }
}

const UserApiController = new UserController()

export default UserApiController
