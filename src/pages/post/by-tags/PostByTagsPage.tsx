import PostApiController from "@/api/post"
import useInfiniteScroll from "@/hooks/useInfiniteScroll"
import React from "react"
import { useLocation, useParams } from "react-router-dom"
import Tags from "./components/Tags"
import ListWithLoading from "@/components/ListWithLoading"
import PostCard from "@/components/PostCard"

const PostByTagsPage = () => {
    const { tagId } = useParams<{
        tagId: string
    }>()

    const { page, data, loading, LastElement } = useInfiniteScroll<IPost>({
        fetcher: () => PostApiController.getPostsByTag({ tagId, page }),
        deps: [tagId],
        canFetch: tagId !== "all"
    })

    return (
        <div className='grid grid-cols-[14rem_auto] gap-5'>
            <Tags />
            {tagId !== "all" ? (
                <ListWithLoading<IPost>
                    data={data}
                    isLoading={loading && page === 1}
                    renderItem={(post) => <PostCard post={post} key={post._id} />}
                    emptyText='No posts found'
                    contentContainerClassName='flex flex-col gap-3'
                    listFooter={!loading && <LastElement />}
                />
            ) : (
                <p className='text-center'>Choose tag to view tag's posts</p>
            )}
        </div>
    )
}

export default PostByTagsPage
