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

const ProfilePage = () => {
    const { userId } = useParams<{
        userId: string
    }>()

    const { user } = useUserContext()

    const {
        data,
        loading: userLoading,
        setData
    } = useFetchDetailData({
        fetcher: () => UserApiController.getById(userId),
        deps: [userId],
        canFetch: userId !== undefined
    })

    useEffect(() => {
        if (data) {
            const isFollowed = !!(user?.following as IUser[])?.find((u) => u?._id === userId)
            setData((prev) => {
                return {
                    ...prev,
                    followers: (isFollowed
                        ? [...(prev?.followers || ([] as IUser[])), user]
                        : prev?.followers?.filter((u: IUser) => u?._id !== user?._id)) as IUser[]
                }
            })
        }
    }, [user?.following])

    const {
        data: posts,
        loading: postLoading,
        LastElement,
        page
    } = useInfiniteScroll<IPost>({
        fetcher: () => PostApiController.getUserPosts({ userId: userId ?? user?._id, page }),
        deps: [userId, , user]
    })

    const author = userId !== undefined ? data : user

    return (
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
                <div className='rounded-md bg-white p-4 shadow-custom'>
                    <div className='flex items-center justify-between'>
                        <h2 className='mb-2 text-lg font-bold'>Followers</h2>
                        <Link to={ROUTE.PROFILE.FOLLOW.concat(`?type=followers&userId=${userId ?? user?._id}`)}>
                            <ArrowRight cursor={"pointer"} />
                        </Link>
                    </div>
                    <ListWithLoading<IUser>
                        data={author?.followers?.slice(0, 10) as IUser[]}
                        isLoading={userLoading}
                        emptyText={`No followers yet`}
                        renderItem={(item) => (
                            <div className='flex items-center gap-2' key={item._id}>
                                <UserLink cmpId={item?._id}>
                                    <Avatar>
                                        <AvatarFallback>{item?.name?.substring(0, 2)}</AvatarFallback>
                                        <AvatarImage src={item?.avatar} alt={item?.username} />
                                    </Avatar>
                                </UserLink>
                                <UserLink cmpId={item?._id}>
                                    <div className='text-sm font-semibold'>{item?.name}</div>
                                </UserLink>
                            </div>
                        )}
                    />
                </div>
                <div className='rounded-md bg-white p-4 shadow-custom'>
                    <div className='flex items-center justify-between'>
                        <h2 className='mb-2 text-lg font-bold'>Following</h2>
                        <Link to={ROUTE.PROFILE.FOLLOW.concat(`?type=following&userId=${userId ?? user?._id}`)}>
                            <ArrowRight cursor={"pointer"} />
                        </Link>
                    </div>
                    <ListWithLoading<IUser>
                        data={author?.following?.slice(0, 10) as IUser[]}
                        isLoading={userLoading}
                        emptyText={`No following yet`}
                        renderItem={(item) => (
                            <div className='flex items-center gap-2' key={item._id}>
                                <UserLink cmpId={item?._id}>
                                    <Avatar>
                                        <AvatarFallback>{item?.name?.substring(0, 2)}</AvatarFallback>
                                        <AvatarImage src={item?.avatar} alt={item?.username} />
                                    </Avatar>
                                </UserLink>
                                <UserLink cmpId={item?._id}>
                                    <div className='text-sm font-semibold'>{item?.name}</div>
                                </UserLink>
                            </div>
                        )}
                    />
                </div>
            </div>
            <div className='mt-2'>
                <ListWithLoading<IPost>
                    isLoading={postLoading && page === 1}
                    data={posts}
                    renderItem={(item) => <PostCard post={item} key={item._id} showEdit />}
                    emptyText='No posts yet'
                    listFooter={<LastElement />}
                    contentContainerClassName='flex flex-col gap-3'
                />
            </div>
        </div>
    )
}

export default ProfilePage
