import CommentApiController from "@/api/comment"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import ROUTE from "@/constants/route"
import { useAuthContext } from "@/context/AuthContext"
import { usePostContext } from "@/context/PostContext"
import { useUserContext } from "@/context/UserContext"
import usePagination from "@/hooks/usePagination"
import apiToast from "@/utils/toast"
import MDEditor, { codeEdit, codePreview } from "@uiw/react-md-editor"
import { useState } from "react"
import toast from "react-hot-toast"
import { Link, useLocation, useParams } from "react-router-dom"
import CommentList from "./CommentList"
import { useTranslation } from "react-i18next"

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

    const { t } = useTranslation(["common"])

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
                                comments: post.commentsCount + 1
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
        <div className='rounded-md border bg-background p-4 shadow-custom' id='comments'>
            <h2 className='text-lg font-bold'>{t("common:Comments")}</h2>
            {user ? (
                <div>
                    <div className='my-4 flex flex-col gap-2 md:flex-row'>
                        <Avatar className='hidden md:block'>
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
                                    placeholder={t("common:what_on_your_mind")}
                                    autoFocus
                                />
                            ) : (
                                <Textarea
                                    className='max-h-[20rem] min-h-[5rem] w-full'
                                    placeholder={t("common:what_on_your_mind")}
                                />
                            )}
                        </div>
                    </div>
                    <div className='flex w-full justify-end gap-4'>
                        {focusing && (
                            <Button variant='ghost' onClick={onCancel}>
                                {t("common:cancel")}
                            </Button>
                        )}
                        <Button disabled={comment === ""} onClick={onSubmit}>
                            {commenting ? "Commenting..." : t("common:Comment")}
                        </Button>
                    </div>
                </div>
            ) : (
                <Button asChild variant='link' className='flex self-center' onClick={() => setFallbackUrl(pathname)}>
                    <Link to={ROUTE.AUTH.SIGIN}>Login to comment</Link>
                </Button>
            )}
            <Separator className='mt-4' />
            {comments?.length === 0 ? (
                <p className='mt-4 text-center text-gray-400'>There's no comment yet. Be the first one to comment!</p>
            ) : (
                <CommentList comments={comments} loading={loading && page === 1} />
            )}

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
