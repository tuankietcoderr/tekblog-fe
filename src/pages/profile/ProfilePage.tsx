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
import { t } from "i18next"

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
            <div className='grid grid-cols-1 md:grid-cols-[18rem_auto]'>
                <div className='top-[84px] flex flex-col gap-5 self-start px-1 py-2 md:sticky md:max-h-[80vh] md:overflow-auto md:px-4 md:scrollbar-none'>
                    <ProfileInfo author={author} />
                    {user && (userId === user?._id || userId === undefined) && (
                        <div className='flex flex-col space-y-2 rounded-md border bg-background p-4 shadow-custom'>
                            <Button variant='outline' asChild>
                                <Link to={ROUTE.PROFILE.ARCHIVE.concat("?type=likes")}>{t("archive")}</Link>
                            </Button>
                            <Button variant='outline' asChild>
                                <Link to={ROUTE.POST.DRAFT}>{t("draft")}</Link>
                            </Button>
                        </div>
                    )}

                    <Followers />
                    <Following />
                </div>
                <div className='mt-4 md:mt-2'>
                    <UserPosts />
                </div>
            </div>
        </FollowProvider>
    )
}

export default ProfilePage
