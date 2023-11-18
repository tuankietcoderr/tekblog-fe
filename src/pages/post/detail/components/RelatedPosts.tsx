import PostApiController from "@/api/post"
import SimpleAvatarPostCard from "@/components/SimpleAvatarPostCard"
import { useToast } from "@/components/ui/use-toast"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const RelatedPosts = () => {
    const { postId } = useParams<{
        postId: string
    }>()
    const [posts, setPosts] = useState<IPost[]>([])
    const { toast } = useToast()
    useEffect(() => {
        ;(async function () {
            const {
                data: { success, data: posts, message }
            } = await PostApiController.getRelatedPosts(postId)
            if (success) {
                setPosts(posts.filter((p) => p._id !== postId).slice(0, 5))
            } else {
                toast({
                    description: message || "Something went wrong"
                })
            }
        })()
    }, [postId])

    return (
        <div className='mx-5 mb-5 flex flex-col gap-4 rounded-md bg-white p-4 shadow-custom'>
            <h2 className='text-xl font-bold'>Related Posts</h2>
            {posts?.map((post) => <SimpleAvatarPostCard {...post} key={post?._id} />)}
        </div>
    )
}

export default RelatedPosts
