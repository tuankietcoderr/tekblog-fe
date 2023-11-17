import PostCard from "@/components/PostCard"
import { usePostContext } from "@/context/PostContext"
import React from "react"
import { useEffect } from "react"
import LeftSideBar from "./components/LeftSideBar"
import RightSideBar from "./components/RightSideBar"
import { Loader2 } from "lucide-react"

const HomePage = () => {
    const { posts, LastElement } = usePostContext()
    return (
        <div className='grid grid-cols-[14rem_auto_14rem] gap-5'>
            <LeftSideBar />
            <div className='flex flex-col gap-5'>
                {posts &&
                    posts.map((post, index) =>
                        posts?.length === index + 1 ? (
                            <LastElement key={"last-item-of-posts-ref"} />
                        ) : (
                            <PostCard post={post} key={post?._id} />
                        )
                    )}
            </div>
            <RightSideBar />
        </div>
    )
}

export default HomePage
