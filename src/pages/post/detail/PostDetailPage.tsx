import PostApiController from "@/api/post"
import MDEditor from "@uiw/react-md-editor"
import React, { useCallback, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import LeftSideBar from "./components/LeftSideBar"
import RightSideBar from "./components/RightSideBar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserContext } from "@/context/UserContext"
import ROUTE from "@/constants/route"
import DateUtils from "@/utils/date"
import CommentSection from "./components/CommentSection"
import RelatedPosts from "./components/RelatedPosts"
import UserLink from "@/components/UserLink"

const PostDetailPage = () => {
    const { postId } = useParams<{
        postId: string
    }>()
    const [post, setPost] = React.useState<IPost | undefined>(undefined)
    const { user } = useUserContext()
    const authorObject = post?.author as IUser
    const tagsObject = post?.tags as ITag[]
    useEffect(() => {
        ;(async function () {
            const {
                data: { success, data: post }
            } = await PostApiController.getById(postId)
            if (success) {
                setPost(post)
            }
        })()
    }, [postId])

    return (
        <div className='relative grid grid-cols-[2rem_auto_18rem] gap-5 self-start'>
            <LeftSideBar />
            <div className='flex flex-col gap-4'>
                <div className='shadow-custom flex flex-col gap-4 rounded-md bg-white'>
                    <div className=''>
                        <img
                            src={post?.thumbnail}
                            alt={post?.title}
                            className='h-[22rem] w-full rounded-t-md object-cover'
                        />
                    </div>
                    <div className='flex flex-col gap-4 p-4'>
                        <div className='flex items-center gap-2'>
                            <UserLink cmpId={authorObject?._id}>
                                <Avatar className='h-8 w-8'>
                                    <AvatarFallback>{authorObject?.name?.substring(0, 2) || "GE"}</AvatarFallback>
                                    <AvatarImage src={authorObject?.avatar} alt={authorObject?.username || ""} />
                                </Avatar>
                            </UserLink>
                            <div>
                                <Link
                                    to={`${
                                        user?._id === authorObject?._id
                                            ? ROUTE.PROFILE.BASE
                                            : ROUTE.PROFILE.OTHERS.replace(":userId", authorObject?._id)
                                    }`}
                                    className='font-semibold hover:text-blue-600'
                                >
                                    {authorObject?.name || "Anonymous"}
                                </Link>
                                <p className='text-xs text-gray-400'>
                                    {DateUtils.getAgos(post?.createdAt || new Date())}
                                </p>
                            </div>
                        </div>
                        <h1 className='text-3xl font-extrabold'>{post?.title}</h1>
                        <div className='flex flex-wrap gap-3'>
                            {tagsObject?.map((tag) => (
                                <Link
                                    to={`${ROUTE.POST.BY_TAGS.replace(":tagId", tag?._id)}`}
                                    key={tag?._id}
                                    className='text-base text-gray-500 transition-colors hover:text-black'
                                >
                                    #{tag.title}
                                </Link>
                            ))}
                        </div>
                        <div>
                            <MDEditor.Markdown source={post?.content} style={{ backgroundColor: "transparent" }} />
                        </div>
                    </div>
                </div>
                <CommentSection />
                <RelatedPosts />
            </div>
            <RightSideBar author={post?.author as IUser} />
        </div>
    )
}

export default PostDetailPage
