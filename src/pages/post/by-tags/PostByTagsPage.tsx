import PostApiController from "@/api/post"
import useInfiniteScroll from "@/hooks/useInfiniteScroll"
import React from "react"
import { useLocation, useParams } from "react-router-dom"
import Tags from "./components/Tags"
import ListWithLoading from "@/components/ListWithLoading"
import PostCard from "@/components/PostCard"
import { t } from "i18next"

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
        <div className='grid grid-cols-1 gap-5 md:grid-cols-[14rem_auto]'>
            <Tags />
            {tagId !== "all" ? (
                <ListWithLoading<IPost>
                    data={data}
                    isLoading={loading && page === 1}
                    renderItem={(post) => <PostCard post={post} key={post._id} />}
                    emptyText={t("common:no_post")}
                    contentContainerClassName='flex flex-col gap-3'
                    listFooter={!loading && <LastElement />}
                />
            ) : (
                <p className='text-center'>{t("common:choose_tag")}</p>
            )}
        </div>
    )
}

export default PostByTagsPage
