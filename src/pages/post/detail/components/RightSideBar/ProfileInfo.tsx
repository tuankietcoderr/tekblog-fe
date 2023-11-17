import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import React from "react"
import { Flag } from "lucide-react"
import DateUtils from "@/utils/date"
import { useUserContext } from "@/context/UserContext"
import ROUTE from "@/constants/route"
import { Link } from "react-router-dom"
import UserLink from "@/components/UserLink"

type Props = {
    author: IUser
}

const ProfileInfo = ({ author }: Props) => {
    const { avatar, name, username, bio, major, createdAt, _id } = author ?? ({} as IUser)
    const { user } = useUserContext()
    const isMine = user?._id === _id
    const handleReport = () => {}
    return (
        <div className='shadow-custom flex flex-col gap-3 rounded-md bg-white p-4'>
            <div className='flex items-center gap-4'>
                <UserLink cmpId={_id}>
                    <Avatar>
                        <AvatarFallback>{name?.substring(0, 2)}</AvatarFallback>
                        <AvatarImage src={avatar} alt={username} />
                    </Avatar>
                </UserLink>
                <UserLink cmpId={_id} className='text-lg font-bold'>
                    {name}
                </UserLink>
            </div>
            {bio && <p>{bio}</p>}
            {!isMine && (
                <div className='flex items-center gap-3'>
                    <Button className='w-full'>Follow</Button>
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
        </div>
    )
}

export default ProfileInfo
