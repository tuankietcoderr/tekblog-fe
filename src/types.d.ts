declare interface IReport {
    title: string
    content: string
    objectType: ObjectType
    object: string | IUser | IPost | IComment
    refPath?: string
    reporter?: string | IUser
    createdAt?: Date
    updatedAt?: Date
}

declare interface ITag {
    _id?: string
    title: string
    score?: number
}

declare interface IPost {
    _id?: string
    title: string
    content: string
    thumbnail?: string
    isDraft?: boolean
    activeStatus?: ActiveStatus
    author?: string | IUser
    likes?: string[] | IUser[]
    saved?: string[] | IUser[]
    comments?: string[] | IComment[]
    tags?: string[] | ITag[] | (string | ITag)[]
    createdAt?: Date
    updatedAt?: Date
}

declare interface IComment {
    _id?: string
    content: string
    author?: string | IUser
    post: string | IPost
    createdAt?: Date
    updatedAt?: Date
}

declare interface IUser {
    _id?: string
    username: string
    password?: string
    role?: EUserRole
    name: string
    avatar?: string
    email: string
    major: string
    bio?: string
    activeStatus: ActiveStatus
    isEmailVerified: boolean
    followers: string[] | IUser[]
    following: string[] | IUser[]
    createdAt: Date
    updatedAt: Date
}

declare enum EUserRole {
    ADMIN = "admin",
    GUEST = "guest"
}

declare enum ObjectType {
    USER = "USER",
    POST = "POST",
    COMMENT = "COMMENT",
    APPLICATION = "APPLICATION"
}

declare enum ActiveStatus {
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED",
    REMOVED = "REMOVED"
}

declare enum SearchType {
    POST = "post",
    USER = "user",
    TAG = "tag"
}

declare interface Pagination {
    hasNextPage: boolean
    hasPrevPage: boolean
    limit: number
    nextPage: number | null
    prevPage: number | null
    page: number
    pagingCounter: number
    totalDocs: number
    totalPages: number
}

declare type SuccessfulResponse<T = any> = {
    data: T
    success: boolean
    message: string
}

declare type SuccessfulResponseWithPagination<T = any> = SuccessfulResponse<T> & Pagination

declare interface IApi {
    readonly path: string
}

declare type FailResponse<T = any> = Omit<SuccessfulResponse<T>, "data">

declare type TagWithPosts = ITag & {
    posts: Pick<IPost, "_id" | "title" | "comments">[]
}

declare type Page = {
    page?: number
    limit?: number
}
