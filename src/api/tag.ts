import { AxiosResponse } from "axios"
import apiInstance from "."

class TagController implements IApi {
    readonly path: string = "/tag"

    private readonly PATHS = {
        ROOT: this.path,
        SOME: `${this.path}/some`
    }

    async getAll(): Promise<AxiosResponse<SuccessfulResponseWithPagination<ITag[]>>> {
        try {
            const tagRes = await apiInstance.get(this.PATHS.ROOT)
            return tagRes
        } catch (error) {
            throw error.response
        }
    }

    async getTagsWithPosts(): Promise<AxiosResponse<SuccessfulResponse<TagWithPosts[]>>> {
        try {
            const tagRes = await apiInstance.get(this.PATHS.SOME)
            return tagRes
        } catch (error) {
            throw error.response
        }
    }

    async create(tag: ITag): Promise<AxiosResponse<SuccessfulResponse<ITag>>> {
        try {
            const tagRes = await apiInstance.post(this.PATHS.ROOT, tag)
            return tagRes
        } catch (error) {
            throw error.response
        }
    }
}

const TagApiController = new TagController()

export default TagApiController
