import PostCard from "@/components/PostCard"
import { usePostContext } from "@/context/PostContext"
import React from "react"
import { useEffect } from "react"
import LeftSideBar from "./components/LeftSideBar"
import RightSideBar from "./components/RightSideBar"
import { Loader2 } from "lucide-react"
import ListWithLoading from "@/components/ListWithLoading"

const HomePage = () => {
    const { posts, LastElement, loading, page } = usePostContext()
    return (
        <div className='grid grid-cols-[14rem_auto_14rem]'>
            <LeftSideBar />
            <ListWithLoading<IPost>
                isLoading={loading && page === 1}
                renderItem={(post, index) => <PostCard post={post} key={post?._id} />}
                data={posts}
                emptyText='No posts found'
                contentContainerClassName='mt-4 flex flex-col gap-5'
                listFooter={<LastElement />}
            />
            <RightSideBar />
        </div>
    )
}

export default HomePage
