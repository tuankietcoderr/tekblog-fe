import { AxiosResponse } from "axios"
import React, { useCallback, useEffect, useRef } from "react"
import usePagination from "./usePagination"
import { Loader2 } from "lucide-react"
import Spinner from "@/components/Spinner"

type Props<T> = {
    fetcher: () => Promise<AxiosResponse<SuccessfulResponseWithPagination<T[]>>>
    deps?: any[]
    canFetch?: boolean
}

const useInfiniteScroll = <T extends any>({ fetcher, deps = [], canFetch = true }: Props<T>) => {
    const { page, setPage, data, setData, loading, hasMore } = usePagination<T>({ fetcher, deps, canFetch })
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

    const LastElement = () => hasMore && <Spinner ref={lastElementRef} />

    return { page, data, setData, loading, LastElement }
}

export default useInfiniteScroll
