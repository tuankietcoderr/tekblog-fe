import PostApiController from "@/api/post"
import ListWithLoading from "@/components/ListWithLoading"
import PostCard from "@/components/PostCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ROUTE from "@/constants/route"
import useInfiniteScroll from "@/hooks/useInfiniteScroll"
import { Link, useLocation } from "react-router-dom"

const ArchivePage = () => {
    const { search } = useLocation()
    const searchParams = new URLSearchParams(search)
    const search_type = searchParams.get("type")

    const { page, LastElement, data, loading } = useInfiniteScroll<IPost>({
        fetcher: () => PostApiController.getArchived({ page, type: search_type, limit: 5 }),
        deps: [search_type]
    })

    return (
        <div>
            <Tabs defaultValue={search_type}>
                <TabsList>
                    <TabsTrigger value='likes' asChild>
                        <Link to={ROUTE.PROFILE.ARCHIVE.concat("?type=likes")} replace>
                            Likes
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger value='saved' asChild>
                        <Link to={ROUTE.PROFILE.ARCHIVE.concat("?type=saved")} replace>
                            Saved
                        </Link>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value={search_type}>
                    <ListWithLoading
                        data={data}
                        isLoading={loading && page === 1}
                        renderItem={(item) => <PostCard post={item} key={item._id} />}
                        emptyText='No posts found'
                        contentContainerClassName='flex flex-col gap-3'
                        listFooter={<LastElement />}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default ArchivePage
