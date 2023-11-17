import { defaultPage } from "@/context"
import { AxiosResponse } from "axios"
import React, { useEffect, useMemo, useState } from "react"

type Props<T> = {
    fetcher: () => Promise<AxiosResponse<SuccessfulResponseWithPagination<T[]>>>
}

const usePagination = <T extends any>({ fetcher }: Props<T>) => {
    const [page, setPage] = useState(1)
    const [data, setData] = useState<T[]>([])
    const [pagination, setPagination] = useState<Pagination>(defaultPage)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
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
                }
            } catch (error) {
            } finally {
                setLoading(false)
            }
        })()
    }, [page])

    return { data, setData, page, setPage, pagination, loading, hasMore: pagination.hasNextPage }
}

export default usePagination
