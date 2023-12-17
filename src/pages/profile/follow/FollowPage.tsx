import PostApiController from "@/api/post"
import UserApiController from "@/api/user"
import ListWithLoading from "@/components/ListWithLoading"
import PeopleCard from "@/components/PeopleCard"
import PostCard from "@/components/PostCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ROUTE from "@/constants/route"
import { useUserContext } from "@/context/UserContext"
import useFetchData from "@/hooks/useFetchData"
import useFetchDetailData from "@/hooks/useFetchDetailData"
import useInfiniteScroll from "@/hooks/useInfiniteScroll"
import { Link, useLocation } from "react-router-dom"
import LeftSideBar from "./components/LeftSideBar"

const FollowPage = () => {
    const { search } = useLocation()
    const searchParams = new URLSearchParams(search)
    const search_type = searchParams.get("type")
    const search_userId = searchParams.get("userId")

    if (!search_userId) {
        throw new Error("userId is required")
    }

    const { data, loading } = useFetchData<IUser>({
        fetcher: () =>
            UserApiController.getFollow({
                type: search_type?.toString(),
                userId: search_userId
            }),
        deps: [search_type]
    })

    return (
        <div className='grid grid-cols-[14rem_auto] gap-5'>
            <LeftSideBar />
            <ListWithLoading
                data={data}
                isLoading={loading}
                renderItem={(item) => <PeopleCard {...item} key={item._id} />}
                emptyText='No follow found'
                contentContainerClassName='flex flex-col gap-3'
            />
        </div>
    )
}

export default FollowPage
