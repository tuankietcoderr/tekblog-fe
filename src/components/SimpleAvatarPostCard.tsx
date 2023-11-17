import React, { memo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import DateUtils from "@/utils/date"
import { Link } from "react-router-dom"
import UserLink from "./UserLink"
import ROUTE from "@/constants/route"

const SimpleAvatarPostCard = (post: IPost) => {
    const authorObject = post?.author as IUser
    return (
        <div className='flex items-center gap-2'>
            <UserLink cmpId={authorObject?._id}>
                <Avatar>
                    <AvatarFallback>{authorObject?.name?.substring(0, 2) || "GE"}</AvatarFallback>
                    <AvatarImage src={authorObject?.avatar} alt={authorObject?.username} />
                </Avatar>
            </UserLink>
            <div>
                <Link
                    to={ROUTE.POST.DETAIL.replace(":postId", post?._id)}
                    className='text-lg font-semibold transition-colors hover:text-blue-500'
                >
                    {post?.title}
                </Link>
                <p className='text-xs text-gray-400'>
                    <UserLink className='font-semibold' cmpId={authorObject?._id}>
                        {authorObject?.name}
                    </UserLink>{" "}
                    - {DateUtils.getAgos(post?.createdAt)}
                </p>
            </div>
        </div>
    )
}

export default memo(SimpleAvatarPostCard)
