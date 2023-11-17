import ROUTE from "@/constants/route"
import { useUserContext } from "@/context/UserContext"
import React, { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import PostApiController from "@/api/post"
import SimplePostCard from "@/components/SimplePostCard"
import { useToast } from "@/components/ui/use-toast"
import UserLink from "@/components/UserLink"

type Props = {
    author: IUser
}

const MoreFromAuthor = ({ author }: Props) => {
    const { name, _id } = author || ({} as IUser)
    const { user } = useUserContext()
    const isMine = user?._id === _id

    const [posts, setPosts] = React.useState<IPost[]>([])
    const { postId } = useParams<{ postId: string }>()
    const { toast } = useToast()
    useEffect(() => {
        if (author?._id && postId) {
            ;(async function () {
                const {
                    data: { success, data: posts, message }
                } = await PostApiController.getUserPosts(_id)
                if (success) {
                    setPosts(posts.filter((p) => p._id !== postId).slice(0, 5))
                } else {
                    toast({
                        description: message || "Something went wrong"
                    })
                }
            })()
        }
    }, [author, postId])

    return (
        <div className='shadow-custom rounded-md bg-white'>
            <div className='flex items-center justify-between p-4'>
                <p>
                    More from{" "}
                    <UserLink cmpId={_id} className='font-bold text-blue-400'>
                        {name}
                    </UserLink>
                </p>
                <ArrowRight size={24} cursor={"pointer"} />
            </div>
            <Separator />
            <div className=''>{posts?.map((post) => <SimplePostCard {...post} key={post?._id} />)}</div>
        </div>
    )
}

export default MoreFromAuthor
