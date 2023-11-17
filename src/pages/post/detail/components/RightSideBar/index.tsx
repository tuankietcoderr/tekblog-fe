import React from "react"
import ProfileInfo from "./ProfileInfo"
import MoreFromAuthor from "./MoreFromAuthor"

type Props = {
    author: IUser
}

const RightSideBar = ({ author }: Props) => {
    return (
        <div className='sticky top-[84px] flex flex-col gap-3 self-start'>
            <ProfileInfo author={author} />
            <MoreFromAuthor author={author} />
        </div>
    )
}

export default RightSideBar
