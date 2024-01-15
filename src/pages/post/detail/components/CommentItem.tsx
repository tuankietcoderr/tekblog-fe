import CommentApiController from "@/api/comment"
import UserLink from "@/components/UserLink"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuthContext } from "@/context/AuthContext"
import { useUserContext } from "@/context/UserContext"
import { cn } from "@/lib/utils"
import DateUtils from "@/utils/date"
import MDEditor, { codeEdit, codePreview } from "@uiw/react-md-editor"
import { Expand, FoldVertical, Heart, MoreHorizontal, Reply, UnfoldVertical } from "lucide-react"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useLocation } from "react-router-dom"
import CommentList from "./CommentList"
import { t } from "i18next"
type Props = {
    comment: IComment
}

const CommentItem = ({ comment }: Props) => {
    const author = comment?.author as IUser
    const [isEditing, setIsEditing] = useState(false)
    const { user } = useUserContext()
    const [_comment, setComment] = useState<IComment | null>(comment)
    const [newComment, setNewComment] = useState<string>(comment.content)

    useEffect(() => {
        setComment(comment)
    }, [comment])

    const [isReplying, setIsReplying] = useState(false)
    const [replyComment, setReplyComment] = useState<string>("")
    const [expandReply, setExpandReply] = useState(false)

    const { pathname } = useLocation()
    const { onOpenDialog } = useAuthContext()

    async function handleEdit() {
        setIsEditing(true)
    }

    async function handleSave() {
        if (newComment.length === 0) return toast.error("Comment cannot be empty")
        toast.loading("Saving comment...", {
            duration: Infinity
        })
        const {
            data: { success, message, data }
        } = await CommentApiController.update(comment._id, newComment)
        toast.dismiss()
        if (success) {
            setComment((prev) => ({
                ...prev,
                content: newComment
            }))
            setIsEditing(false)
            toast.success(message)
        } else {
            toast.error(message)
        }
    }

    async function handleCancel() {
        setIsEditing(false)
        setNewComment(comment.content)
    }

    async function handleDelete() {
        toast.loading("Deleting comment...", {
            duration: Infinity
        })
        const {
            data: { success, message }
        } = await CommentApiController.delete(comment._id)
        toast.dismiss()
        if (success) {
            setComment(null)
            toast.success(message)
        } else {
            toast.error(message)
        }
    }

    async function handleLike() {
        if (!onOpenDialog(pathname)) {
            return
        }
        const {
            data: { success, message, data }
        } = await CommentApiController.like(comment._id)
        if (success) {
            setComment((prev) => ({
                ...prev,
                isLikedByMe: data.isLikedByMe,
                likesCount: data.likesCount
            }))
        } else {
            toast.error(message)
        }
    }

    async function focusReply() {
        setIsReplying(true)
    }

    function dismisReply() {
        setIsReplying(false)
        setReplyComment("")
    }

    async function handleReply() {
        if (!onOpenDialog(pathname)) {
            return
        }
        toast.loading("Replying comment...", {
            duration: Infinity
        })
        const {
            data: { success, message, data }
        } = await CommentApiController.create({
            content: replyComment,
            post: comment.post,
            parent: comment._id
        })
        toast.dismiss()
        if (success) {
            setComment((prev) => ({
                ...prev,
                children: [...prev.children, data]
            }))
            setIsReplying(false)
            setReplyComment("")
            !expandReply && setExpandReply(true)
        } else {
            toast.error(message)
        }
    }

    return (
        _comment && (
            <>
                <div className=''>
                    <div className='my-4 flex gap-2'>
                        <UserLink cmpId={author?._id} className='mt-2'>
                            <Avatar className='h-6 w-6 lg:h-10 lg:w-10'>
                                <AvatarFallback>{author?.name?.substring(0, 2)}</AvatarFallback>
                                <AvatarImage src={author?.avatar} alt={author?.username} className='object-cover' />
                            </Avatar>
                        </UserLink>
                        <div className='flex-1'>
                            <div className='flex flex-wrap rounded-md border border-border p-4'>
                                <div className='flex flex-1 flex-col gap-2'>
                                    <p className='flex flex-col flex-wrap gap-1 md:flex-row md:items-center'>
                                        <UserLink cmpId={author?._id} className='font-semibold'>
                                            {author?.name}
                                        </UserLink>{" "}
                                        <span className='hidden md:block'>•</span>{" "}
                                        <span className='text-xs'>
                                            {DateUtils.customFormat(comment?.createdAt, " hh:mm A, DD/MM/YYYY")}
                                        </span>
                                    </p>
                                    {!isEditing ? (
                                        <MDEditor.Markdown
                                            source={_comment.content}
                                            className='bg-background text-foreground'
                                        />
                                    ) : (
                                        <div className='space-y-2'>
                                            <MDEditor
                                                value={newComment}
                                                onChange={setNewComment}
                                                className='max-h-[20rem] min-h-[5rem] w-full'
                                                extraCommands={[codeEdit, codePreview]}
                                                preview='edit'
                                                placeholder="What's on your mind?"
                                                autoFocus
                                            />
                                            <div className='flex justify-end gap-2'>
                                                <Button variant='ghost' onClick={handleCancel}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleSave}>Save</Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {user?._id === author?._id && (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant='ghost' size='icon'>
                                                <MoreHorizontal size={16} />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-fit'>
                                            <div className='flex flex-col gap-2'>
                                                <Button variant='ghost' className='justify-start' onClick={handleEdit}>
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant='ghost'
                                                    className='justify-start text-destructive'
                                                    onClick={handleDelete}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>
                            <div className='mt-2 flex flex-wrap gap-2'>
                                <Button variant='ghost' className='min-w-fit' onClick={handleLike}>
                                    <div className='flex items-center gap-2'>
                                        <Heart size={16} className={cn(_comment.isLikedByMe && "fill-foreground")} />
                                        <span>
                                            {_comment.likesCount}{" "}
                                            {_comment.likesCount > 0 ? t("common:likes") : t("common:like")}
                                        </span>
                                    </div>
                                </Button>
                                <Button variant='ghost' className='min-w-fit' onClick={focusReply}>
                                    <div className='flex items-center gap-2'>
                                        <Reply size={16} />
                                        <span>
                                            {_comment?.children?.length ?? 0}{" "}
                                            {_comment?.children?.length > 0 ? t("common:replies") : t("common:reply")}
                                        </span>
                                    </div>
                                </Button>
                                {_comment?.children && _comment?.children.length > 0 && (
                                    <Button
                                        variant='ghost'
                                        className='min-w-fit'
                                        onClick={() => setExpandReply((prev) => !prev)}
                                    >
                                        <div className='flex items-center gap-2'>
                                            {expandReply ? <FoldVertical size={16} /> : <UnfoldVertical size={16} />}
                                            <span>{expandReply ? t("common:hide") : t("common:expand")}</span>
                                        </div>
                                    </Button>
                                )}
                            </div>
                            {isReplying && (
                                <div className='space-y-2'>
                                    <MDEditor
                                        value={replyComment}
                                        onChange={setReplyComment}
                                        className='max-h-[20rem] min-h-[5rem] w-full'
                                        extraCommands={[codeEdit, codePreview]}
                                        preview='edit'
                                        placeholder="What's on your mind?"
                                        autoFocus
                                    />
                                    <div className='flex justify-end gap-2'>
                                        <Button variant='ghost' onClick={dismisReply}>
                                            {t("common:cancel")}
                                        </Button>
                                        <Button onClick={handleReply}>{t("common:Reply")}</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {expandReply && _comment?.children && (
                    <div className='ml-6 lg:ml-12'>
                        <CommentList loading={false} comments={_comment?.children as IComment[]} />
                    </div>
                )}
            </>
        )
    )
}

export default CommentItem
