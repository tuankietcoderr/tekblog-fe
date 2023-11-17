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
            return error.response
        }
    }

    async getTagsWithPosts(): Promise<AxiosResponse<SuccessfulResponse<TagWithPosts[]>>> {
        try {
            const tagRes = await apiInstance.get(this.PATHS.SOME)
            return tagRes
        } catch (error) {
            return error.response
        }
    }
}

const TagApiControler = new TagController()

export default TagApiControler
