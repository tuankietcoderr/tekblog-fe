import { useTagContext } from "@/context/TagContext"
import React from "react"
import { ArrowRight } from "lucide-react"
import ROUTE from "@/constants/route"
import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import SimplePostCard from "@/components/SimplePostCard"

const RightSideBar = () => {
    const { tagsWithPosts } = useTagContext()
    return (
        <div className='sticky top-[84px] flex flex-col gap-4 self-start'>
            {tagsWithPosts.map((tagWithPosts) => (
                <div key={tagWithPosts._id} className='shadow-custom rounded-md bg-white py-4'>
                    <Link
                        to={`${ROUTE.POST.BY_TAGS.replace(":tagId", tagWithPosts._id)}`}
                        className='mb-3 flex items-center justify-between px-3'
                    >
                        <h2 className='text-lg font-bold'>#{tagWithPosts.title}</h2>
                        <ArrowRight size={24} className='transition-transform hover:scale-105' />
                    </Link>
                    <Separator />
                    <div>
                        {tagWithPosts.posts.map((post) => (
                            <SimplePostCard {...post} key={post?._id} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RightSideBar
