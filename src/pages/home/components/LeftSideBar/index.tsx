import React from "react"
import Navigation from "./Navigation"
import HotTags from "./HotTags"

const LeftSideBar = () => {
    return (
        <div className='sticky top-[84px] flex flex-col gap-4 self-start'>
            <Navigation />
            <HotTags />
        </div>
    )
}

export default LeftSideBar
