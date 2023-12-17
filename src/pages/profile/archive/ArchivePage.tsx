import PostApiController from "@/api/post"
import ListWithLoading from "@/components/ListWithLoading"
import PostCard from "@/components/PostCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ROUTE from "@/constants/route"
import useInfiniteScroll from "@/hooks/useInfiniteScroll"
import { Link, useLocation } from "react-router-dom"
import LeftSideBar from "./components/LeftSideBar"

const ArchivePage = () => {
    const { search } = useLocation()
    const searchParams = new URLSearchParams(search)
    const search_type = searchParams.get("type")

    const { page, LastElement, data, loading } = useInfiniteScroll<IPost>({
        fetcher: () => PostApiController.getArchived({ page, type: search_type, limit: 5 }),
        deps: [search_type]
    })

    return (
        <div className='grid grid-cols-[14rem_auto] gap-5'>
            <LeftSideBar />
            <ListWithLoading
                data={data}
                isLoading={loading && page === 1}
                renderItem={(item) => <PostCard post={item} key={item._id} />}
                emptyText='No posts found'
                contentContainerClassName='flex flex-col gap-3'
                listFooter={<LastElement />}
            />
        </div>
    )
}

export default ArchivePage
