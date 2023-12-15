import UserLink from "@/components/UserLink"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React from "react"

const FollowItem = ({ follow: item }: { follow: IUser }) => {
    return (
        <div className='flex items-center gap-2'>
            <UserLink cmpId={item?._id}>
                <Avatar>
                    <AvatarFallback>{item?.name?.substring(0, 2)}</AvatarFallback>
                    <AvatarImage src={item?.avatar} alt={item?.username} className='object-cover' />
                </Avatar>
            </UserLink>
            <UserLink cmpId={item?._id}>
                <div className='text-sm font-semibold'>{item?.name}</div>
            </UserLink>
        </div>
    )
}

export default FollowItem
