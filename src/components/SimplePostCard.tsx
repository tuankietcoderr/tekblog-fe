import ROUTE from "@/constants/route"
import { t } from "i18next"
import React, { memo } from "react"
import { Link } from "react-router-dom"

const SimplePostCard = (post: Pick<IPost, "_id" | "commentsCount" | "title">) => {
    return (
        <div key={post._id}>
            <Link
                to={ROUTE.POST.DETAIL.replace(":postId", post._id)}
                className='flex flex-col px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700'
            >
                <h3 className='font-semibold hover:text-blue-600'>{post.title}</h3>
                <p className='text-xs text-gray-400'>
                    {post.commentsCount} {t("common:comments")}
                </p>
            </Link>
        </div>
    )
}

export default memo(SimplePostCard)
