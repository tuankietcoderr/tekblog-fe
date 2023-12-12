import { AxiosResponse } from "axios"
import apiInstance from "."

class CommentController implements IApi {
    readonly path: string = "/comment"
    private PATHS = {
        ROOT: this.path,
        POST: `${this.path}/post/:postId`
    }
    async create(data: IComment): Promise<AxiosResponse<SuccessfulResponse<IComment>>> {
        try {
            const comment = await apiInstance.post(this.PATHS.POST.replace(":postId", data.post as string), data)
            return comment
        } catch (error) {
            throw error.response
        }
    }

    async getByPostId({
        postId,
        page = 1,
        limit = 5
    }: { postId: string } & Page): Promise<AxiosResponse<SuccessfulResponseWithPagination<IComment[]>>> {
        try {
            const comments = await apiInstance.get(this.PATHS.POST.replace(":postId", postId), {
                params: { page, limit }
            })
            return comments
        } catch (error) {
            throw error.response
        }
    }
}

const CommentApiController = new CommentController()
export default CommentApiController
