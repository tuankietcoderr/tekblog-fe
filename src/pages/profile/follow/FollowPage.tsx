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
        <div>
            <Tabs defaultValue={search_type}>
                <TabsList>
                    <TabsTrigger value='followers' asChild>
                        <Link to={ROUTE.PROFILE.FOLLOW.concat(`?type=followers&userId=${search_userId}`)} replace>
                            Followers
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger value='following' asChild>
                        <Link to={ROUTE.PROFILE.FOLLOW.concat(`?type=following&userId=${search_userId}`)} replace>
                            Following
                        </Link>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value={search_type}>
                    <ListWithLoading
                        data={data}
                        isLoading={loading}
                        renderItem={(item) => <PeopleCard {...item} key={item._id} />}
                        emptyText='No follow found'
                        contentContainerClassName='flex flex-col gap-3'
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default FollowPage
