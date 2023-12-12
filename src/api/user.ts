import { AxiosResponse } from "axios"
import apiInstance from "."

class UserController implements IApi {
    readonly path: string = "/user"
    private readonly PATHS = {
        ROOT: this.path,
        FOLLOW: `${this.path}/:userId/follow`,
        ID: `${this.path}/:userId`
    }

    async getCurrentUser(): Promise<AxiosResponse<SuccessfulResponse<IUser>>> {
        try {
            const userRes = await apiInstance.get(this.PATHS.ROOT)
            return userRes
        } catch (error) {
            throw error.response
        }
    }

    async follow(userId: string): Promise<AxiosResponse<SuccessfulResponse>> {
        try {
            const followRes = await apiInstance.put(this.PATHS.FOLLOW.replace(":userId", userId))
            return followRes
        } catch (error) {
            throw error.response
        }
    }

    async getById(userId: string): Promise<AxiosResponse<SuccessfulResponse<IUser>>> {
        try {
            const userRes = await apiInstance.get(this.PATHS.ID.replace(":userId", userId))
            return userRes
        } catch (error) {
            throw error.response
        }
    }

    async getFollow({
        userId,
        type
    }: {
        userId: string
        type: "following" | "followers" | string
    }): Promise<AxiosResponse<SuccessfulResponse<IUser[]>>> {
        try {
            const userRes = await apiInstance.get(this.PATHS.FOLLOW.replace(":userId", userId), {
                params: {
                    t: type
                }
            })
            return userRes
        } catch (error) {
            throw error.response
        }
    }

    async updateProfile(data: IUser): Promise<AxiosResponse<SuccessfulResponse<IUser>>> {
        try {
            const userRes = await apiInstance.put(this.PATHS.ROOT, data)
            return userRes
        } catch (error) {
            throw error.response
        }
    }

    async changePassword(data: {
        oldPassword: string
        newPassword: string
    }): Promise<AxiosResponse<SuccessfulResponse>> {
        try {
            const userRes = await apiInstance.put(`${this.path}/change-password`, data)
            return userRes
        } catch (error) {
            throw error.response
        }
    }
}

const UserApiController = new UserController()

export default UserApiController
