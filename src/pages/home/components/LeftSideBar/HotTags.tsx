import ListWithLoading from "@/components/ListWithLoading"
import Spinner from "@/components/Spinner"
import ROUTE from "@/constants/route"
import { useTagContext } from "@/context/TagContext"
import { useState } from "react"
import { Link } from "react-router-dom"

const HotTags = () => {
    const { tags, tagsLoading } = useTagContext()
    const top10Tags = tags?.slice(0, 10)
    return (
        <div className='shadow-custom flex flex-col gap-3 rounded-md bg-white p-4'>
            <h3 className='text-lg font-semibold'>Hot tags</h3>
            <div className='flex flex-col gap-2'>
                <ListWithLoading<ITag>
                    data={top10Tags}
                    isLoading={tagsLoading}
                    renderItem={(tag) => (
                        <Link
                            to={ROUTE.POST.BY_TAGS.replace(":tagId", tag?._id)}
                            key={tag?._id}
                            className='text-base text-gray-500 transition-colors hover:text-black'
                        >
                            #{tag.title} <span className='text-xs'>({tag.score} pts)</span>
                        </Link>
                    )}
                    emptyText='No tags found'
                />
            </div>
        </div>
    )
}

export default HotTags
