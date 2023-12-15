import UserApiController from "@/api/user"
import ListWithLoading from "@/components/ListWithLoading"
import UserLink from "@/components/UserLink"
import ROUTE from "@/constants/route"
import { useUserContext } from "@/context/UserContext"
import useFetchData from "@/hooks/useFetchData"
import { ArrowRight } from "lucide-react"
import React, { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import FollowItem from "./FollowItem"
import { useFollowContext } from "@/context/FollowContext"

const Followers = () => {
    const { user } = useUserContext()
    const { isFollow, setIsFollow } = useFollowContext()
    const { userId } = useParams<{
        userId: string
    }>()
    const {
        data: followers,
        loading,
        setData
    } = useFetchData<IUser>({
        fetcher: () =>
            UserApiController.getFollow({
                type: "followers",
                userId: userId ?? user?._id
            }),
        deps: [userId, isFollow]
    })

    return (
        <div className='rounded-md bg-white p-4 shadow-custom'>
            <div className='flex items-center justify-between'>
                <h2 className='mb-2 text-lg font-bold'>Followers</h2>
                <Link to={ROUTE.PROFILE.FOLLOW.concat(`?type=followers&userId=${userId ?? user?._id}`)}>
                    <ArrowRight cursor={"pointer"} />
                </Link>
            </div>
            <ListWithLoading<IUser>
                data={followers?.slice(0, 10) as IUser[]}
                isLoading={loading}
                emptyText={`No followers yet`}
                contentContainerClassName='flex flex-col gap-3'
                renderItem={(item, index) => <FollowItem follow={item} key={item?._id + index.toString()} />}
            />
        </div>
    )
}

export default Followers
