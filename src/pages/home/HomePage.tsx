import ListWithLoading from "@/components/ListWithLoading"
import PostCard from "@/components/PostCard"
import { usePostContext } from "@/context/PostContext"
import LeftSideBar from "./components/LeftSideBar"

const HomePage = () => {
    const { posts, LastElement, loading, page } = usePostContext()
    return (
        <div className='grid grid-cols-[14rem_auto] gap-5 self-start'>
            <LeftSideBar />
            <ListWithLoading<IPost>
                isLoading={loading && page === 1}
                renderItem={(post, index) => <PostCard post={post} key={post?._id} />}
                data={posts}
                emptyText='No posts found'
                contentContainerClassName='flex flex-col gap-5'
                listFooter={<LastElement />}
            />
        </div>
    )
}

export default HomePage
