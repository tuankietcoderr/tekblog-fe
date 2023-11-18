import ROUTE from "@/constants/route"
import React, { memo } from "react"
import { Link } from "react-router-dom"

const TagCard = ({ title, score, _id }: ITag) => {
    return (
        <Link
            to={ROUTE.POST.BY_TAGS.replace(":tagId", _id)}
            className='flex items-center justify-between gap-3 rounded-md bg-white p-3 shadow-custom'
        >
            <div className='flex items-center gap-3'>
                <div className='grid h-10 w-10 cursor-default place-items-center rounded-md bg-slate-100 text-2xl font-bold'>
                    #
                </div>
                <p className='text-xl font-bold'>{title}</p>
            </div>
            <p className='text-xs font-semibold'>{score} pts</p>
        </Link>
    )
}

export default memo(TagCard)
