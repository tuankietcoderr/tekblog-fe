import CommentApiController from "@/api/comment"
import UserLink from "@/components/UserLink"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useUserContext } from "@/context/UserContext"
import DateUtils from "@/utils/date"
import MDEditor, { codeEdit, codePreview } from "@uiw/react-md-editor"
import { MoreHorizontal } from "lucide-react"
import React, { useState } from "react"
import toast from "react-hot-toast"
type Props = {
    comment: IComment
    setComment: React.Dispatch<React.SetStateAction<IComment[]>>
}

const CommentItem = ({ comment, setComment }: Props) => {
    const author = comment?.author as IUser
    const [isEditing, setIsEditing] = useState(false)
    const [newComment, setNewComment] = useState<string>(comment.content)
    const { user } = useUserContext()
    console.log({ user, comment })

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
        if (success) {
            toast.dismiss()
            setComment((prev) =>
                prev.map((c) =>
                    c._id === comment._id
                        ? {
                              ...c,
                              content: newComment
                          }
                        : c
                )
            )
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
            setComment((prev) => prev.filter((c) => c._id !== comment._id))
            toast.success(message)
        } else {
            toast.error(message)
        }
    }

    return (
        <div className='my-4 flex gap-2'>
            <UserLink cmpId={author?._id} className='mt-2'>
                <Avatar>
                    <AvatarFallback>{author?.name?.substring(0, 2)}</AvatarFallback>
                    <AvatarImage src={author?.avatar} alt={author?.username} className='object-cover' />
                </Avatar>
            </UserLink>
            <div className='flex flex-1 rounded-md border border-border p-4'>
                <div className='flex flex-1 flex-col gap-2'>
                    <p>
                        <UserLink cmpId={author?._id} className='font-semibold'>
                            {author?.name}
                        </UserLink>{" "}
                        <span>•</span> <span className='text-xs'>{DateUtils.getAgos(comment?.createdAt)}</span>
                    </p>
                    {!isEditing ? (
                        <MDEditor.Markdown source={comment.content} />
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
        </div>
    )
}

export default CommentItem
