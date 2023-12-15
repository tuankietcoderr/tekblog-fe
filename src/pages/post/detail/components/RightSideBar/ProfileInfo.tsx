import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import { Flag } from "lucide-react"
import DateUtils from "@/utils/date"
import { useUserContext } from "@/context/UserContext"
import ROUTE from "@/constants/route"
import { Link, useLocation } from "react-router-dom"
import UserLink from "@/components/UserLink"
import UserApiController from "@/api/user"
import { useAuthContext } from "@/context/AuthContext"
import ReportDialog from "@/components/report-dialog"
import { useFollowContext } from "@/context/FollowContext"

type Props = {
    author: IUser
}

const ProfileInfo = ({ author }: Props) => {
    const { pathname } = useLocation()
    const { avatar, name, username, bio, major, createdAt, _id } = author ?? ({} as IUser)
    const { user, setUser } = useUserContext()
    const isMine = user?._id === _id

    const { isFollow, setIsFollow } = useFollowContext()
    const { onOpenDialog } = useAuthContext()

    const onClickFollow = async () => {
        if (!onOpenDialog(pathname)) {
            return
        }
        const sFollow = isFollow
        // setIsFollow(!isFollow)
        try {
            const {
                data: { success }
            } = await UserApiController.follow(_id)
            if (!success) {
                // setIsFollow(sFollow)
            } else {
                setUser((prev) => {
                    return {
                        ...prev,
                        following: (sFollow
                            ? prev?.following?.filter((id) => id !== _id)
                            : [...prev?.following, _id]) as string[]
                    }
                })
            }
        } catch (error) {
            // setIsFollow(sFollow)
        }
    }

    const [isOpen, setIsOpen] = useState(false)

    const handleReport = () => {
        setIsOpen(true)
    }

    return (
        <div className='flex flex-col gap-3 rounded-md bg-white p-4 shadow-custom'>
            <div className='flex items-center gap-4'>
                <UserLink cmpId={_id}>
                    <Avatar>
                        <AvatarFallback>{name?.substring(0, 2)}</AvatarFallback>
                        <AvatarImage src={avatar} alt={username} className='object-cover' />
                    </Avatar>
                </UserLink>
                <UserLink cmpId={_id} className='text-lg font-bold'>
                    {name}
                </UserLink>
            </div>
            {bio && <p>{bio}</p>}
            {!isMine && (
                <div className='flex items-center gap-3'>
                    <Button className='w-full' onClick={onClickFollow} variant='outline'>
                        {isFollow ? "Unfollow" : "Follow"}
                    </Button>
                    <Flag size={24} cursor={"pointer"} onClick={handleReport} />
                </div>
            )}
            <div>
                <p>
                    <b>MAJOR</b>
                </p>
                <p>{major}</p>
            </div>
            <div>
                <p>
                    <b>JOINED</b>
                </p>
                <p>{DateUtils.customFormat(createdAt, "LLL")}</p>
            </div>
            <ReportDialog isOpen={isOpen} setIsOpen={setIsOpen} objectId={author?._id} />
        </div>
    )
}

export default ProfileInfo
