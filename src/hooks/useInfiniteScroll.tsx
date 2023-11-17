import { AxiosResponse } from "axios"
import React, { useCallback, useEffect, useRef } from "react"
import usePagination from "./usePagination"
import { Loader2 } from "lucide-react"

type Props<T> = {
    fetcher: () => Promise<AxiosResponse<SuccessfulResponseWithPagination<T[]>>>
}

const useInfiniteScroll = <T extends any>({ fetcher }: Props<T>) => {
    const { page, setPage, data, setData, loading, hasMore } = usePagination<T>({ fetcher })
    const observer = useRef<IntersectionObserver>(null)

    const lastElementRef = useCallback(
        (node) => {
            if (loading) return
            if (observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPageNumber) => prevPageNumber + 1)
                }
            })
            if (node) observer.current.observe(node)
        },
        [loading]
    )

    const LastElement = () =>
        hasMore && (
            <div className='grid place-items-center' ref={lastElementRef}>
                <Loader2 className='animate-spin' />
            </div>
        )

    return { page, data, setData, loading, LastElement }
}

export default useInfiniteScroll
