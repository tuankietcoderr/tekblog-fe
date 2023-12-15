import UserApiController from "@/api/user"
import ListWithLoading from "@/components/ListWithLoading"
import UserLink from "@/components/UserLink"
import ROUTE from "@/constants/route"
import { useUserContext } from "@/context/UserContext"
import useFetchData from "@/hooks/useFetchData"
import { ArrowRight } from "lucide-react"
import React from "react"
import { Link, useParams } from "react-router-dom"
import FollowItem from "./FollowItem"

const Following = () => {
    const { user } = useUserContext()
    const { userId } = useParams<{
        userId: string
    }>()
    const { data: following, loading } = useFetchData<IUser>({
        fetcher: () =>
            UserApiController.getFollow({
                type: "following",
                userId: userId ?? user?._id
            }),
        deps: [userId]
    })

    return (
        <div className='rounded-md bg-white p-4 shadow-custom'>
            <div className='flex items-center justify-between'>
                <h2 className='mb-2 text-lg font-bold'>Following</h2>
                <Link to={ROUTE.PROFILE.FOLLOW.concat(`?type=following&userId=${userId ?? user?._id}`)}>
                    <ArrowRight cursor={"pointer"} />
                </Link>
            </div>
            <ListWithLoading<IUser>
                data={following?.slice(0, 10) as IUser[]}
                isLoading={loading}
                emptyText={`No following yet`}
                contentContainerClassName='flex flex-col gap-3'
                renderItem={(item, index) => <FollowItem follow={item} key={item?._id + index.toString()} />}
            />
        </div>
    )
}

export default Following
