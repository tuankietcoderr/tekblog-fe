import React, { memo, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import DateUtils from "@/utils/date"
import { Link } from "react-router-dom"
import ROUTE from "@/constants/route"
import { useUserContext } from "@/context/UserContext"
import { Bookmark, PenLine } from "lucide-react"
import PostApiController from "@/api/post"
import { usePostContext } from "@/context/PostContext"
import { useAuthContext } from "@/context/AuthContext"
import UserLink from "./UserLink"

type Props = {
    showThumbnail?: boolean
    showBookmark?: boolean
    post: IPost
    showEdit?: boolean
}

const PostCard = ({ showThumbnail = false, showBookmark = true, showEdit = false, post }: Props) => {
    const { thumbnail, author, title, createdAt, tags, likes, comments, saved, _id } = post
    const authorObject = author as IUser
    const tagsObject = tags as ITag[]
    const { user } = useUserContext()
    const { posts, setPosts } = usePostContext()
    const [save, setSave] = React.useState(false)
    const { onOpenDialog } = useAuthContext()
    useEffect(() => {
        const isSaved = saved?.find((saved) => saved === user?._id)
        if (isSaved) {
            setSave(true)
        } else {
            setSave(false)
        }
    }, [saved])

    useEffect(() => {
        if (!user) {
            setSave(false)
        }
    }, [user])

    async function handleSavePost() {
        try {
            const {
                data: {
                    success,
                    data: { save: _save }
                }
            } = await PostApiController.save(_id)
            if (success) {
                setPosts((prev) => {
                    const newPosts = prev?.map((post) => {
                        if (post._id === _id) {
                            return {
                                ...post,
                                saved: (!_save
                                    ? post.saved?.filter((id) => id !== user?._id)
                                    : [...post.saved, user?._id]) as string[]
                            }
                        }
                        return post
                    })
                    return newPosts
                })
            }
        } catch {}
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
                                <AvatarImage
                                    src={authorObject?.avatar}
                                    alt={authorObject?.username}
                                    className='object-cover'
                                />
                            </Avatar>
                        </UserLink>
                        <div>
                            <UserLink cmpId={authorObject?._id} className='text-xs font-semibold hover:text-blue-600'>
                                {authorObject?.name}
                            </UserLink>
                            <p className='text-xs text-gray-400'>{DateUtils.getAgos(createdAt)}</p>
                        </div>
                    </div>
                    {post?.isDraft && <p className='font-semibold text-destructive'>Draft</p>}
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
                    <div className='flex gap-2'>
                        {user && user?._id !== authorObject?._id && showBookmark && (
                            <Bookmark
                                fill={save ? "black" : "transparent"}
                                size={24}
                                onClick={handleSavePost}
                                className='hover:fill-black'
                                cursor={"pointer"}
                            />
                        )}
                        {user && user?._id === authorObject?._id && showEdit && (
                            <Link to={ROUTE.POST.EDIT.replace(":postId", _id)}>
                                <PenLine />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(PostCard)
