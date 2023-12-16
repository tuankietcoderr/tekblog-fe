import React, { useEffect, useMemo, useState } from "react"
import { Heart, MessageCircle, Bookmark, Flag } from "lucide-react"
import PostApiController from "@/api/post"
import { useLocation, useParams } from "react-router-dom"
import { useUserContext } from "@/context/UserContext"
import { usePostContext } from "@/context/PostContext"
import { useAuthContext } from "@/context/AuthContext"
import ReportDialog from "@/components/report-dialog"
import { ObjectType } from "@/enum"

const LeftSideBar = () => {
    const { postId } = useParams<{ postId: string }>()
    const { user } = useUserContext()
    const { setPosts, posts } = usePostContext()
    const post = useMemo(() => posts?.find((p) => p._id === postId), [posts, postId])
    const { saved, likes, comments, _id } = post || ({} as IPost)
    const [save, setSave] = useState<boolean>(false)
    const [like, setLike] = useState<boolean>(false)
    const { onOpenDialog } = useAuthContext()
    const { pathname } = useLocation()
    useEffect(() => {
        const isSaved = (saved as string[])?.includes(user?._id)
        setSave(isSaved)
    }, [posts, postId])

    useEffect(() => {
        const isLiked = (likes as string[])?.includes(user?._id)
        setLike(isLiked)
    }, [posts, postId])

    async function handleSavePost() {
        if (!onOpenDialog(pathname)) {
            return
        }
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

    async function handleLikePost() {
        if (!onOpenDialog(pathname)) {
            return
        }
        setPosts((prev) => {
            const newPosts = prev?.map((post) => {
                if (post._id === _id) {
                    return {
                        ...post,
                        likes: (like
                            ? post.likes?.filter((id) => id !== user?._id)
                            : [...post.likes, user?._id]) as string[]
                    }
                }
                return post
            })
            return newPosts
        })
        try {
            const {
                data: { success }
            } = await PostApiController.like(_id)
            if (!success) {
                setPosts((prev) => {
                    const newPosts = prev?.map((post) => {
                        if (post._id === _id) {
                            return {
                                ...post,
                                likes: (!like
                                    ? post.likes?.filter((id) => id !== user?._id)
                                    : [...post.likes, user?._id]) as string[]
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
                            likes: (!like
                                ? post.likes?.filter((id) => id !== user?._id)
                                : [...post.likes, user?._id]) as string[]
                        }
                    }
                    return post
                })
                return newPosts
            })
        }
    }

    const [isOpen, setIsOpen] = useState<boolean>(false)

    function handleReportPost() {
        if (!onOpenDialog(pathname)) {
            return
        }

        setIsOpen(true)
    }

    const actions = [
        {
            icon: (
                <Heart
                    fill={like ? "black" : "transparent"}
                    className='hover:text-slate-600'
                    cursor={"pointer"}
                    onClick={handleLikePost}
                />
            ),
            count: likes?.length || 0
        },
        {
            icon: (
                <a href='#comments'>
                    <MessageCircle className='hover:text-slate-600' cursor={"pointer"} />
                </a>
            ),
            count: comments?.length || 0
        },
        {
            icon: (
                <Bookmark
                    fill={save ? "black" : "transparent"}
                    className='hover:text-slate-600'
                    cursor={"pointer"}
                    onClick={handleSavePost}
                />
            ),
            count: saved?.length || 0
        },
        {
            icon: <Flag cursor={"pointer"} className='hover:text-slate-600' onClick={handleReportPost} />
        }
    ] as {
        icon: React.ReactNode
        count?: number
    }[]

    return (
        <div className='sticky top-[84px] flex flex-col gap-2 self-start'>
            {actions.map((action, index) => (
                <div className='flex flex-col items-center' key={index}>
                    <div>{action.icon}</div>
                    {action.count && <span>{action.count}</span>}
                </div>
            ))}
            {postId && <ReportDialog isOpen={isOpen} setIsOpen={setIsOpen} objectId={postId} type={ObjectType.POST} />}
        </div>
    )
}

export default LeftSideBar
