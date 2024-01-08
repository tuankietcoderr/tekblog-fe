import React from "react"
import ProfileInfo from "./ProfileInfo"
import MoreFromAuthor from "./MoreFromAuthor"
import { FollowProvider } from "@/context/FollowContext"

type Props = {
    author: IUser
}

const RightSideBar = ({ author }: Props) => {
    return (
        <FollowProvider author={author}>
            <div className='top-[84px] order-3 flex flex-col gap-3 self-start md:sticky md:order-first'>
                <ProfileInfo author={author} />
                <MoreFromAuthor author={author} />
            </div>
        </FollowProvider>
    )
}

export default RightSideBar
