import { defaultPage } from "@/context"
import { AxiosResponse } from "axios"
import React, { useEffect, useMemo, useState } from "react"

type Props<T> = {
    fetcher: () => Promise<AxiosResponse<SuccessfulResponseWithPagination<T[]>>>
    deps?: any[]
    canFetch?: boolean
}

const usePagination = <T extends any>({ fetcher, deps = [], canFetch = true }: Props<T>) => {
    const [page, setPage] = useState(1)
    const [data, setData] = useState<T[] | undefined>(undefined)
    const [pagination, setPagination] = useState<Pagination>(defaultPage)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if (canFetch) {
            if (page > pagination.totalPages) return
            ;(async function () {
                setLoading(true)
                try {
                    const {
                        data: { success, data: _data, message, ...rest }
                    } = await fetcher()
                    if (success) {
                        if (page === 1) {
                            setData(_data)
                        } else {
                            setData((prev) => [...prev, ..._data])
                        }
                        setPagination(rest)
                    } else {
                        setData([])
                    }
                } catch (error) {
                } finally {
                    setLoading(false)
                }
            })()
        }
    }, [page, ...deps])

    useEffect(() => {
        if (page > 1) {
            setPage(1)
        }
    }, deps)

    const memoizedData = useMemo(() => data, [data])

    return { data: memoizedData, setData, page, setPage, pagination, loading, hasMore: pagination.hasNextPage }
}

export default usePagination
