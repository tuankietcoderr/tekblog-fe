import PostApiController from "@/api/post"
import SimpleAvatarPostCard from "@/components/SimpleAvatarPostCard"
import { t } from "i18next"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"

const RelatedPosts = () => {
    const { postId } = useParams<{
        postId: string
    }>()
    const [posts, setPosts] = useState<IPost[]>([])
    useEffect(() => {
        ;(async function () {
            const {
                data: { success, data: posts, message }
            } = await PostApiController.getRelatedPosts(postId)
            if (success) {
                setPosts(posts.filter((p) => p._id !== postId).slice(0, 5))
            } else {
                toast.error(message || "Something went wrong")
            }
        })()
    }, [postId])

    return (
        <div className='mb-5 flex flex-col gap-4 rounded-md border bg-background p-4 shadow-custom'>
            <h2 className='text-xl font-bold'>{t("common:related_posts")}</h2>
            {posts?.map((post) => <SimpleAvatarPostCard {...post} key={post?._id} />)}
        </div>
    )
}

export default RelatedPosts
