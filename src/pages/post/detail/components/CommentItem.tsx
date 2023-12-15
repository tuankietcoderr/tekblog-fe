import UserLink from "@/components/UserLink"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import DateUtils from "@/utils/date"
import MDEditor from "@uiw/react-md-editor"
import React from "react"
type Props = {
    comment: IComment
}

const CommentItem = ({ comment }: Props) => {
    const author = comment?.author as IUser
    return (
        <div className='my-4 flex gap-2'>
            <UserLink cmpId={author?._id} className='mt-2'>
                <Avatar>
                    <AvatarFallback>{author?.name?.substring(0, 2)}</AvatarFallback>
                    <AvatarImage src={author?.avatar} alt={author?.username} className='object-cover' />
                </Avatar>
            </UserLink>
            <div className='flex w-full flex-col gap-2 rounded-md border border-border p-4'>
                <p>
                    <UserLink cmpId={author?._id} className='font-semibold'>
                        {author?.name}
                    </UserLink>{" "}
                    <span>•</span> <span className='text-xs'>{DateUtils.getAgos(comment?.createdAt)}</span>
                </p>
                <MDEditor.Markdown source={comment.content} />
            </div>
        </div>
    )
}

export default CommentItem
