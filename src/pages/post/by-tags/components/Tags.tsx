import TagApiController from "@/api/tag"
import ListWithLoading from "@/components/ListWithLoading"
import { Button } from "@/components/ui/button"
import ROUTE from "@/constants/route"
import { useTagContext } from "@/context/TagContext"
import usePagination from "@/hooks/usePagination"
import { cn } from "@/lib/utils"
import { t } from "i18next"
import React from "react"
import { Link, useParams } from "react-router-dom"

const Tags = () => {
    const { tagId } = useParams<{
        tagId: string
    }>()
    const { tags, tagsLoading } = useTagContext()
    return (
        <div className='self-start rounded-md border border-border bg-background p-4 shadow-custom'>
            <h2 className='mb-3 text-lg font-semibold'>{t("common:all_tags")}</h2>
            <ListWithLoading<ITag>
                data={tags}
                isLoading={tagsLoading}
                renderItem={(tag) => (
                    <Link
                        to={ROUTE.POST.BY_TAGS.replace(":tagId", tag?._id)}
                        key={tag?._id}
                        className={cn(
                            "text-base text-gray-500 transition-colors hover:text-foreground",
                            tag?._id === tagId && "font-semibold text-foreground"
                        )}
                    >
                        #{tag.title} <span className='text-xs'>({tag.score} pts)</span>
                    </Link>
                )}
                emptyText='No tags found'
                contentContainerClassName='flex flex-col gap-2'
            />
        </div>
    )
}

export default Tags
