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
        RELATED: `${this.path}/:postId/related`,
        TAG: `${this.path}/tag/:tagId`,
        ARCHIVED: `${this.path}/archived`
    }
    async getAll({ limit = 10, page = 1 }: Page): Promise<AxiosResponse<SuccessfulResponseWithPagination<IPost[]>>> {
        try {
            const posts = await apiInstance.get(this.PATHS.ROOT, { params: { limit, page } })
            return posts
        } catch (error) {
            throw error.response
        }
    }

    async getById(postId: string): Promise<AxiosResponse<SuccessfulResponse<IPost>>> {
        try {
            const post = await apiInstance.get(this.PATHS.ID.replace(":postId", postId))
            return post
        } catch (error) {
            throw error.response
        }
    }

    async getUserPosts({
        userId,
        page = 1,
        limit = 10,
        isDraft = false
    }: { userId?: string; isDraft?: boolean } & Page): Promise<
        AxiosResponse<SuccessfulResponseWithPagination<IPost[]>>
    > {
        try {
            const posts = await apiInstance.get(this.PATHS.USER.replace(":userId", ""), {
                params: { page, limit, user_id: userId, isDraft }
            })
            return posts
        } catch (error) {
            throw error.response
        }
    }

    async getRelatedPosts(postId: string): Promise<AxiosResponse<SuccessfulResponse<IPost[]>>> {
        try {
            const posts = await apiInstance.get(this.PATHS.RELATED.replace(":postId", postId))
            return posts
        } catch (error) {
            throw error.response
        }
    }

    async getPostsByTag({
        tagId,
        page = 1,
        limit = 10
    }: {
        tagId: string
    } & Page): Promise<AxiosResponse<SuccessfulResponseWithPagination<IPost[]>>> {
        try {
            const posts = await apiInstance.get(this.PATHS.TAG.replace(":tagId", tagId), {
                params: { page, limit }
            })
            return posts
        } catch (error) {
            throw error.response
        }
    }

    async getArchived({
        type = "saved",
        page = 1,
        limit = 10
    }: {
        type: "saved" | "likes" | string
    } & Page) {
        try {
            const posts = await apiInstance.get(this.PATHS.ARCHIVED, { params: { page, limit, type } })
            return posts
        } catch (error) {
            throw error.response
        }
    }

    async create(post: IPost): Promise<AxiosResponse<SuccessfulResponse<IPost>>> {
        try {
            const createdPost = await apiInstance.post(this.PATHS.ROOT, post)
            return createdPost
        } catch (error) {
            throw error.response
        }
    }

    async save(postId: string): Promise<
        AxiosResponse<
            SuccessfulResponse<{
                save: boolean
            }>
        >
    > {
        try {
            const post = await apiInstance.put(this.PATHS.SAVE.replace(":postId", postId))
            return post
        } catch (error) {
            throw error.response
        }
    }

    async like(postId: string): Promise<AxiosResponse<SuccessfulResponse<IPost>>> {
        try {
            const post = await apiInstance.put(this.PATHS.LIKE.replace(":postId", postId))
            return post
        } catch (error) {
            throw error.response
        }
    }

    async update(postId: string, data: IPost): Promise<AxiosResponse<SuccessfulResponse<IPost>>> {
        try {
            const post = await apiInstance.put(this.PATHS.ID.replace(":postId", postId), data)
            return post
        } catch (error) {
            throw error.response
        }
    }

    async delete(postId: string): Promise<AxiosResponse<SuccessfulResponse<IPost>>> {
        try {
            const post = await apiInstance.delete(this.PATHS.ID.replace(":postId", postId))
            return post
        } catch (error) {
            throw error.response
        }
    }
}
const PostApiController = new PostController()
export default PostApiController
