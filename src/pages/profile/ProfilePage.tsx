import ROUTE from "@/constants/route"
import { useUserContext } from "@/context/UserContext"
import React, { useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import ProfileInfo from "../post/detail/components/RightSideBar/ProfileInfo"
import useFetchDetailData from "@/hooks/useFetchDetailData"
import UserApiController from "@/api/user"
import useFetchData from "@/hooks/useFetchData"
import PostApiController from "@/api/post"
import ListWithLoading from "@/components/ListWithLoading"
import useInfiniteScroll from "@/hooks/useInfiniteScroll"
import PostCard from "@/components/PostCard"
import UserLink from "@/components/UserLink"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import UserPosts from "./components/UserPosts"
import Followers from "./components/Followers"
import Following from "./components/Following"
import { FollowProvider } from "@/context/FollowContext"

const ProfilePage = () => {
    const { userId } = useParams<{
        userId: string
    }>()

    const { user } = useUserContext()

    const { data } = useFetchDetailData({
        fetcher: () => UserApiController.getById(userId),
        deps: [userId],
        canFetch: userId !== undefined
    })

    const author = userId !== undefined ? data : user

    return (
        <FollowProvider author={author}>
            <div className='grid grid-cols-[18rem_auto]'>
                <div className='sticky top-[84px] flex max-h-[80vh] flex-col gap-5 self-start overflow-auto px-4 py-2 scrollbar-none'>
                    <ProfileInfo author={author} />
                    {user && (userId === user?._id || userId === undefined) && (
                        <Button className='border-none bg-white shadow-custom' variant='outline' asChild>
                            <Link to={ROUTE.PROFILE.ARCHIVE.concat("?type=likes")}>Archive</Link>
                        </Button>
                    )}
                    {user && (userId === user?._id || userId === undefined) && (
                        <Button className='border-none bg-white shadow-custom' variant='outline' asChild>
                            <Link to={ROUTE.POST.DRAFT}>Draft</Link>
                        </Button>
                    )}

                    <Followers />
                    <Following />
                </div>
                <div className='mt-2'>
                    <UserPosts />
                </div>
            </div>
        </FollowProvider>
    )
}

export default ProfilePage
