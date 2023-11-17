import apiInstance from "."
import { AxiosResponse } from "axios"

class PostController implements IApi {
    readonly path: string = "/post"

    private readonly PATHS = {
        ROOT: this.path,
        ID: `${this.path}/:postId`,
        SAVE: `${this.path}/:postId/save`,
        LIKE: `${this.path}/:postId/like`,
        USER: `${this.path}/user/:userId`,
        RELATED: `${this.path}/:postId/related`
    }
    async getAll({ limit = 10, page = 1 }: Page): Promise<AxiosResponse<SuccessfulResponseWithPagination<IPost[]>>> {
        try {
            const posts = await apiInstance.get(this.PATHS.ROOT, { params: { limit, page } })
            return posts
        } catch (error) {
            return error.response
        }
    }

    async getById(postId: string): Promise<AxiosResponse<SuccessfulResponse<IPost>>> {
        try {
            const post = await apiInstance.get(this.PATHS.ID.replace(":postId", postId))
            return post
        } catch (error) {
            return error.response
        }
    }

    async getUserPosts(userId?: string): Promise<AxiosResponse<SuccessfulResponseWithPagination<IPost[]>>> {
        try {
            const posts = await apiInstance.get(this.PATHS.USER.replace(":userId", userId || ""))
            return posts
        } catch (error) {
            return error.response
        }
    }

    async getRelatedPosts(postId: string): Promise<AxiosResponse<SuccessfulResponse<IPost[]>>> {
        try {
            const posts = await apiInstance.get(this.PATHS.RELATED.replace(":postId", postId))
            return posts
        } catch (error) {
            return error.response
        }
    }

    async create(post: IPost): Promise<AxiosResponse<SuccessfulResponse<IPost>>> {
        try {
            const createdPost = await apiInstance.post(this.PATHS.ROOT, post)
            return createdPost
        } catch (error) {
            return error.response
        }
    }

    async save(postId: string): Promise<AxiosResponse<SuccessfulResponse<IPost>>> {
        try {
            const post = await apiInstance.put(this.PATHS.SAVE.replace(":postId", postId))
            return post
        } catch (error) {
            return error.response
        }
    }

    async like(postId: string): Promise<AxiosResponse<SuccessfulResponse<IPost>>> {
        try {
            const post = await apiInstance.put(this.PATHS.LIKE.replace(":postId", postId))
            return post
        } catch (error) {
            return error.response
        }
    }
}
const PostApiController = new PostController()
export default PostApiController
