import PostApiController from "@/api/post"
import ListWithLoading from "@/components/ListWithLoading"
import PostCard from "@/components/PostCard"
import { useUserContext } from "@/context/UserContext"
import useInfiniteScroll from "@/hooks/useInfiniteScroll"
import React from "react"
import { useParams } from "react-router-dom"

const UserPosts = () => {
    const { user } = useUserContext()
    const { userId } = useParams<{
        userId: string
    }>()

    const {
        data: posts,
        loading: postLoading,
        LastElement,
        page
    } = useInfiniteScroll<IPost>({
        fetcher: () => PostApiController.getUserPosts({ userId: userId ?? user?._id, page }),
        deps: [userId]
    })
    return (
        <ListWithLoading<IPost>
            isLoading={postLoading && page === 1}
            data={posts}
            renderItem={(item) => <PostCard post={item} key={item._id} showEdit />}
            emptyText='No posts yet'
            listFooter={<LastElement />}
            contentContainerClassName='flex flex-col gap-3'
        />
    )
}

export default UserPosts
