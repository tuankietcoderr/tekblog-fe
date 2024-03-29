import SearchApiConroller from "@/api/search"
import ListWithLoading from "@/components/ListWithLoading"
import PeopleCard from "@/components/PeopleCard"
import PostCard from "@/components/PostCard"
import TagCard from "@/components/TagCard"
import ROUTE from "@/constants/route"
import { SearchType } from "@/enum"
import useInfiniteScroll from "@/hooks/useInfiniteScroll"
import { cn } from "@/lib/utils"
import { t } from "i18next"
import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

const SearchPage = () => {
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const search_q = searchParams.get("q")
    const search_type = (searchParams.get("type") as SearchType) || SearchType.POST

    const { data, loading, page, LastElement, setData } = useInfiniteScroll<ITag | IUser | IPost>({
        fetcher: () => SearchApiConroller.search({ q: search_q, type: search_type, page: page }),
        deps: [search_q, search_type]
    })

    return (
        <div className='grid grid-cols-1 gap-5 md:grid-cols-[14rem_auto]'>
            <div className='flex flex-col gap-2 self-start rounded-md border bg-background p-4 shadow-custom'>
                {Object.values(SearchType).map((type) => (
                    <Link
                        key={type}
                        to={`${ROUTE.SEARCH}?q=${search_q}&type=${type}`}
                        className={cn(
                            "rounded-md p-2 font-semibold hover:bg-gray-100 dark:hover:bg-slate-700",
                            type === search_type && "bg-gray-100 dark:bg-slate-700"
                        )}
                    >
                        {t([type])}
                    </Link>
                ))}
            </div>
            <div>
                <ListWithLoading
                    data={data}
                    isLoading={loading && page === 1}
                    renderItem={(item) => {
                        if (search_type === SearchType.POST) {
                            return <PostCard post={item as IPost} key={item._id} />
                        }
                        if (search_type === SearchType.TAG) {
                            return <TagCard {...(item as ITag)} key={item._id} />
                        }
                        if (search_type === SearchType.USER) {
                            return <PeopleCard {...(item as IUser)} key={item._id} />
                        }
                    }}
                    emptyText='No results found'
                    contentContainerClassName='flex flex-col gap-3'
                    listFooter={<LastElement />}
                />
            </div>
        </div>
    )
}

export default SearchPage
