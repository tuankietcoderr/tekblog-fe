import CommentApiController from "@/api/comment"
import ListWithLoading from "@/components/ListWithLoading"
import UserLink from "@/components/UserLink"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import ROUTE from "@/constants/route"
import { defaultPage } from "@/context"
import { usePostContext } from "@/context/PostContext"
import { useUserContext } from "@/context/UserContext"
import usePagination from "@/hooks/usePagination"
import DateUtils from "@/utils/date"
import MDEditor, { codeEdit, codePreview, commands } from "@uiw/react-md-editor"
import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

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
    } = usePagination<IComment>({ fetcher: () => CommentApiController.getByPostId({ postId, page }) })
    const { toast } = useToast()

    const onCancel = () => {
        setComment("")
        setFocusing(false)
    }

    const onSubmit = async () => {
        if (comment === "") return toast({ description: "Comment cannot be empty" })
        const newComment = {
            content: comment,
            post: postId
        } as IComment

        setCommenting(true)

        const {
            data: { data: newC, message, success }
        } = await CommentApiController.create(newComment)
        if (success) {
            setCommenting(false)
            setComment("")
            setFocusing(false)
            setData((prev) => [
                {
                    ...newC,
                    author: user
                },
                ...prev
            ])
            setPosts((prev) => {
                const newPosts = prev?.map((post) => {
                    if (post._id === postId) {
                        return {
                            ...post,
                            comments: [...post.comments, newC._id] as string[]
                        }
                    }
                    return post
                })
                return newPosts
            })
        } else {
            setCommenting(false)
            toast({
                description: message || "Something went wrong"
            })
        }
    }

    return (
        <div className='mx-5 rounded-md bg-white p-4 shadow-custom' id='comments'>
            <h2 className='text-lg font-bold'>Comments</h2>
            {user ? (
                <div>
                    <div className='my-4 flex gap-2'>
                        <Avatar>
                            <AvatarFallback>{user?.name?.substring(0, 2)}</AvatarFallback>
                            <AvatarImage src={user?.avatar} alt={user?.username} />
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
                <Button asChild variant='link' className='flex self-center'>
                    <Link to={ROUTE.AUTH.SIGIN}>Login to comment</Link>
                </Button>
            )}
            <Separator className='mt-4' />
            <ListWithLoading<IComment>
                data={comments}
                isLoading={loading}
                renderItem={(comment) => {
                    const author = comment?.author as IUser
                    return (
                        <div className='my-4 flex gap-2' key={comment?._id}>
                            <UserLink cmpId={author?._id} className='mt-2'>
                                <Avatar>
                                    <AvatarFallback>{author?.name?.substring(0, 2)}</AvatarFallback>
                                    <AvatarImage src={author?.avatar} alt={author?.username} />
                                </Avatar>
                            </UserLink>
                            <div className='flex w-full flex-col gap-2 rounded-md border border-border p-4'>
                                <p>
                                    <UserLink cmpId={author?._id} className='font-semibold'>
                                        {author?.name}
                                    </UserLink>{" "}
                                    <span>•</span>{" "}
                                    <span className='text-xs'>{DateUtils.getAgos(comment?.createdAt)}</span>
                                </p>
                                <MDEditor.Markdown source={comment.content} />
                            </div>
                        </div>
                    )
                }}
                emptyText="There's no comment yet"
                contentContainerClassName='mt-4'
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
