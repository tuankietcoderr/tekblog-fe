import CommentApiController from "@/api/comment"
import ListWithLoading from "@/components/ListWithLoading"
import Spinner from "@/components/Spinner"
import UserLink from "@/components/UserLink"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import ROUTE from "@/constants/route"
import { defaultPage } from "@/context"
import { useAuthContext } from "@/context/AuthContext"
import { usePostContext } from "@/context/PostContext"
import { useUserContext } from "@/context/UserContext"
import usePagination from "@/hooks/usePagination"
import DateUtils from "@/utils/date"
import apiToast from "@/utils/toast"
import MDEditor, { codeEdit, codePreview, commands } from "@uiw/react-md-editor"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link, useLocation, useParams } from "react-router-dom"
import CommentItem from "./CommentItem"

const CommentSection = () => {
    const { user } = useUserContext()
    const { setPosts } = usePostContext()
    const { postId } = useParams<{ postId: string }>()
    const [comment, setComment] = useState("")
    const [commenting, setCommenting] = useState(false)
    const [focusing, setFocusing] = useState(false)
    const {
        data: comments,
        page,
        setPage,
        setData,
        pagination,
        loading
    } = usePagination<IComment>({
        fetcher: () => CommentApiController.getByPostId({ postId, page }),
        deps: [postId]
    })
    const { setFallbackUrl } = useAuthContext()
    const { pathname } = useLocation()

    const onCancel = () => {
        setComment("")
        setFocusing(false)
    }

    const onSubmit = async () => {
        if (comment === "") return toast.error("Comment cannot be empty")
        const newComment = {
            content: comment,
            post: postId
        } as IComment

        setCommenting(true)

        apiToast({
            promise: CommentApiController.create(newComment),
            onSuccess: (data) => {
                setCommenting(false)
                setComment("")
                setFocusing(false)
                setData((prev) => [
                    {
                        ...data,
                        author: user
                    },
                    ...prev
                ])
                setPosts((prev) => {
                    const newPosts = prev?.map((post) => {
                        if (post._id === postId) {
                            return {
                                ...post,
                                comments: [...post.comments, data._id] as string[]
                            }
                        }
                        return post
                    })
                    return newPosts
                })
            },
            onFail: () => {
                setCommenting(false)
            },
            loadingText: "Commenting..."
        })
    }

    return (
        <div className='mx-5 rounded-md bg-white p-4 shadow-custom' id='comments'>
            <h2 className='text-lg font-bold'>Comments</h2>
            {user ? (
                <div>
                    <div className='my-4 flex gap-2'>
                        <Avatar>
                            <AvatarFallback>{user?.name?.substring(0, 2)}</AvatarFallback>
                            <AvatarImage src={user?.avatar} alt={user?.username} className='object-cover' />
                        </Avatar>
                        <div onFocus={() => setFocusing(true)} className='w-full'>
                            {focusing ? (
                                <MDEditor
                                    value={comment}
                                    onChange={setComment}
                                    className='max-h-[20rem] min-h-[5rem] w-full'
                                    extraCommands={[codeEdit, codePreview]}
                                    preview='edit'
                                    placeholder="What's on your mind?"
                                    autoFocus
                                />
                            ) : (
                                <Textarea
                                    className='max-h-[20rem] min-h-[5rem] w-full'
                                    placeholder="What's on your mind?"
                                />
                            )}
                        </div>
                    </div>
                    <div className='flex w-full justify-end gap-4'>
                        <Button disabled={comment === ""} onClick={onSubmit}>
                            {commenting ? "Commenting..." : "Comment"}
                        </Button>
                        {focusing && (
                            <Button variant='ghost' onClick={onCancel}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <Button asChild variant='link' className='flex self-center' onClick={() => setFallbackUrl(pathname)}>
                    <Link to={ROUTE.AUTH.SIGIN}>Login to comment</Link>
                </Button>
            )}
            <Separator className='mt-4' />
            <ListWithLoading<IComment>
                data={comments}
                isLoading={loading && page === 1}
                renderItem={(comment) => <CommentItem comment={comment} key={comment?._id} />}
                emptyText="There's no comment yet"
                contentContainerClassName='mt-4'
                listFooter={loading && <Spinner />}
            />

            {page < pagination.totalPages && (
                <div className='grid place-items-center'>
                    <Button variant='ghost' className='font-semibold' onClick={() => setPage((prev) => prev + 1)}>
                        {loading ? "Loading..." : "Load more..."}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default CommentSection
