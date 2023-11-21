import { AxiosResponse } from "axios"
import { useEffect, useState } from "react"

type Props<T> = {
    fetcher: () => Promise<AxiosResponse<SuccessfulResponse<T>>>
    deps?: any[]
    canFetch?: boolean
}

const useFetchDetailData = <T extends any>({ fetcher, deps = [], canFetch = true }: Props<T>) => {
    const [data, setData] = useState<T | undefined>(undefined)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if (canFetch) {
            ;(async function () {
                setLoading(true)
                try {
                    const {
                        data: { success, data: _data }
                    } = await fetcher()
                    if (success) {
                        setData(_data)
                    } else {
                        setData(null)
                    }
                } catch (error) {
                } finally {
                    setLoading(false)
                }
            })()
        }
    }, deps)

    return { data, setData, loading }
}

export default useFetchDetailData
