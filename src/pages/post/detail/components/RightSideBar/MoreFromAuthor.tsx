import PostApiController from "@/api/post"
import SimplePostCard from "@/components/SimplePostCard"
import UserLink from "@/components/UserLink"
import { Separator } from "@/components/ui/separator"
import { ArrowRight } from "lucide-react"
import React, { useEffect } from "react"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"

type Props = {
    author: IUser
}

const MoreFromAuthor = ({ author }: Props) => {
    const { name, _id } = author || ({} as IUser)

    const [posts, setPosts] = React.useState<IPost[]>([])
    const { postId } = useParams<{ postId: string }>()
    useEffect(() => {
        if (author?._id && postId) {
            ;(async function () {
                const {
                    data: { success, data: posts, message }
                } = await PostApiController.getUserPosts({ userId: _id })
                if (success) {
                    setPosts(posts.filter((p) => p._id !== postId).slice(0, 5))
                } else {
                    toast.error(message || "Something went wrong")
                }
            })()
        }
    }, [author, postId])

    return (
        <div className='rounded-md bg-white shadow-custom'>
            <div className='flex items-center justify-between p-4'>
                <p>
                    More from{" "}
                    <UserLink cmpId={_id} className='font-bold text-blue-400'>
                        {name}
                    </UserLink>
                </p>
                <UserLink cmpId={_id}>
                    <ArrowRight size={24} cursor={"pointer"} />
                </UserLink>
            </div>
            <Separator />
            {posts?.length > 0 && (
                <div className=''>{posts?.map((post) => <SimplePostCard {...post} key={post?._id} />)}</div>
            )}
        </div>
    )
}

export default MoreFromAuthor
