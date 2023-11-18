import React, { memo, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import DateUtils from "@/utils/date"
import { Link } from "react-router-dom"
import ROUTE from "@/constants/route"
import { useUserContext } from "@/context/UserContext"
import { Bookmark } from "lucide-react"
import PostApiController from "@/api/post"
import { usePostContext } from "@/context/PostContext"
import { useAuthContext } from "@/context/AuthContext"
import UserLink from "./UserLink"

type Props = {
    isHot?: boolean
    showThumbnail?: boolean
    showBookmark?: boolean
    post: IPost
}

const PostCard = ({ isHot = false, showThumbnail = false, showBookmark = true, post }: Props) => {
    const { thumbnail, author, title, createdAt, tags, likes, comments, saved, _id } = post
    const authorObject = author as IUser
    const tagsObject = tags as ITag[]
    const { user } = useUserContext()
    const { setPosts } = usePostContext()
    const [save, setSave] = React.useState(false)
    const { onOpenDialog } = useAuthContext()
    useEffect(() => {
        const isSaved = saved?.find((saved) => saved === user?._id)
        if (isSaved) {
            setSave(true)
        }
        if (!user) {
            setSave(false)
        }
    }, [saved, user])
    async function handleSavePost() {
        setPosts((prev) => {
            const newPosts = prev?.map((post) => {
                if (post._id === _id) {
                    return {
                        ...post,
                        saved: (save
                            ? post.saved?.filter((id) => id !== user?._id)
                            : [...post.saved, user?._id]) as string[]
                    }
                }
                return post
            })
            return newPosts
        })
        try {
            const {
                data: { success }
            } = await PostApiController.save(_id)
            if (!success) {
                setPosts((prev) => {
                    const newPosts = prev?.map((post) => {
                        if (post._id === _id) {
                            return {
                                ...post,
                                saved: (!save
                                    ? post.saved?.filter((id) => id !== user?._id)
                                    : [...post.saved, user?._id]) as string[]
                            }
                        }
                        return post
                    })
                    return newPosts
                })
            }
        } catch {
            setPosts((prev) => {
                const newPosts = prev?.map((post) => {
                    if (post._id === _id) {
                        return {
                            ...post,
                            saved: (!save
                                ? post.saved?.filter((id) => id !== user?._id)
                                : [...post.saved, user?._id]) as string[]
                        }
                    }
                    return post
                })
                return newPosts
            })
        }
    }

    return (
        <div className='rounded-md bg-white shadow-custom'>
            {showThumbnail && (
                <div>
                    <img className='h-80 w-full rounded-t-md object-cover' src={thumbnail} alt={title} />
                </div>
            )}
            <div className='flex flex-col gap-3 p-3'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-2'>
                        <UserLink cmpId={authorObject?._id}>
                            <Avatar className='h-8 w-8'>
                                <AvatarFallback>{authorObject?.name?.substring(0, 2)}</AvatarFallback>
                                <AvatarImage src={authorObject?.avatar} alt={authorObject?.username} />
                            </Avatar>
                        </UserLink>
                        <div>
                            <UserLink cmpId={authorObject?._id} className='text-xs font-semibold hover:text-blue-600'>
                                {authorObject?.name}
                            </UserLink>
                            <p className='text-xs text-gray-400'>{DateUtils.getAgos(createdAt)}</p>
                        </div>
                    </div>
                    {isHot && <p className='font-semibold text-destructive'>Hot 🔥</p>}
                </div>
                <Link
                    to={ROUTE.POST.DETAIL.replace(":postId", post?._id)}
                    className='w-fit text-2xl font-bold hover:text-blue-600'
                >
                    {title}
                </Link>
                <div className='flex flex-wrap gap-3'>
                    {tagsObject &&
                        tagsObject.map((tag) => (
                            <Link
                                unstable_viewTransition
                                to={`${ROUTE.POST.BY_TAGS.replace(":tagId", tag?._id)}`}
                                key={tag?._id}
                                className='text-base text-gray-500 transition-colors hover:text-black'
                            >
                                #{tag.title}
                            </Link>
                        ))}
                </div>
                <div className='flex items-center justify-between'>
                    <div className='flex gap-3'>
                        <p>
                            <b>{likes?.length || 0}</b> likes
                        </p>
                        <p>
                            <b>{comments?.length || 0}</b> comments
                        </p>
                    </div>
                    {showBookmark && (
                        <Bookmark
                            fill={save ? "black" : "transparent"}
                            size={24}
                            onClick={handleSavePost}
                            cursor={"pointer"}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default memo(PostCard)
