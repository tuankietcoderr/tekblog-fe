import PostApiController from "@/api/post"
import ListWithLoading from "@/components/ListWithLoading"
import PostCard from "@/components/PostCard"
import { useUserContext } from "@/context/UserContext"
import useInfiniteScroll from "@/hooks/useInfiniteScroll"
import React from "react"

const DraftPage = () => {
    const { user } = useUserContext()
    const { page, LastElement, data, loading } = useInfiniteScroll<IPost>({
        fetcher: () =>
            PostApiController.getUserPosts({
                userId: user?._id,
                isDraft: true,
                limit: 5,
                page
            }),
        deps: [user],
        canFetch: !!user
    })
    return (
        <div>
            <ListWithLoading
                data={data}
                isLoading={loading && page === 1}
                renderItem={(item) => <PostCard post={item} key={item?._id} showEdit />}
                emptyText='No draft found'
                listFooter={<LastElement />}
                contentContainerClassName='flex flex-col gap-3'
            />
        </div>
    )
}

export default DraftPage
