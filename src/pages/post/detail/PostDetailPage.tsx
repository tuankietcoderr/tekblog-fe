import PostApiController from "@/api/post"
import MDEditor from "@uiw/react-md-editor"
import React, { useCallback, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import LeftSideBar from "./components/LeftSideBar"
import RightSideBar from "./components/RightSideBar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserContext } from "@/context/UserContext"
import ROUTE from "@/constants/route"
import DateUtils from "@/utils/date"
import CommentSection from "./components/CommentSection"
import RelatedPosts from "./components/RelatedPosts"
import UserLink from "@/components/UserLink"
import useFetchDetailData from "@/hooks/useFetchDetailData"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { useTranslation } from "react-i18next"

const PostDetailPage = () => {
    const { postId } = useParams<{
        postId: string
    }>()
    const { user } = useUserContext()

    const { data: post, loading } = useFetchDetailData<IPost>({
        fetcher: () => PostApiController.getById(postId),
        deps: [postId]
    })

    const authorObject = post?.author as IUser
    const tagsObject = post?.tags as ITag[]

    const contentRef = useRef<HTMLDivElement>(null)

    const { t } = useTranslation(["common"])

    return (
        <div className='relative grid grid-cols-1 gap-4 self-start lg:grid-cols-[18rem_auto_2rem]'>
            <RightSideBar author={post?.author as IUser} />
            <div className='order-2 flex flex-col gap-4 overflow-auto md:order-1'>
                <div className='flex flex-col gap-4 rounded-md border'>
                    {post?.isDraft && (
                        <Alert variant='destructive' className='w-full bg-background shadow-custom'>
                            <AlertTitle>Warning</AlertTitle>
                            <AlertDescription>This post is still in draft mode.</AlertDescription>
                        </Alert>
                    )}
                    <div className='w-full'>
                        <img
                            src={post?.thumbnail}
                            alt={post?.title}
                            className='h-[10rem] w-full rounded-t-md object-cover md:h-[22rem]'
                        />
                        <div className='flex flex-col gap-4 rounded-b-md bg-background p-4 shadow-custom'>
                            <div className='flex items-center gap-2'>
                                <UserLink cmpId={authorObject?._id}>
                                    <Avatar className='h-8 w-8'>
                                        <AvatarFallback>{authorObject?.name?.substring(0, 2) || "GE"}</AvatarFallback>
                                        <AvatarImage
                                            src={authorObject?.avatar}
                                            alt={authorObject?.username || ""}
                                            className='object-cover'
                                        />
                                    </Avatar>
                                </UserLink>
                                <div>
                                    <UserLink cmpId={authorObject?._id} className='font-semibold hover:text-blue-600'>
                                        {authorObject?.name || "Anonymous"}
                                    </UserLink>
                                    <p className='text-base text-gray-400'>
                                        {DateUtils.customFormat(post?.createdAt!, "hh:mm A, DD/MM/YYYY")}
                                    </p>
                                </div>
                            </div>
                            <h1 className='text-3xl font-extrabold'>{post?.title}</h1>
                            <div className='flex flex-wrap gap-3'>
                                {tagsObject?.map((tag) => (
                                    <Link
                                        to={`${ROUTE.POST.BY_TAGS.replace(":tagId", tag?._id)}`}
                                        key={tag?._id}
                                        className='text-base text-gray-500 transition-colors hover:text-foreground'
                                    >
                                        #{tag.title}
                                    </Link>
                                ))}
                            </div>
                            <div className='w-full max-w-none' ref={contentRef}>
                                <MDEditor.Markdown
                                    source={post?.content}
                                    style={{ backgroundColor: "transparent", width: "100%" }}
                                    className='text-foreground'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <CommentSection />
                <RelatedPosts />
            </div>
            <LeftSideBar />
        </div>
    )
}

export default PostDetailPage
