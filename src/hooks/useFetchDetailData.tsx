import { AxiosResponse } from "axios"
import { useEffect, useState } from "react"

type Props<T> = {
    fetcher: () => Promise<AxiosResponse<SuccessfulResponse<T>>>
    deps?: any[]
}

const useFetchDetailData = <T extends any>({ fetcher, deps = [] }: Props<T>) => {
    const [data, setData] = useState<T | undefined>(undefined)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
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
    }, deps)

    return { data, setData, loading }
}

export default useFetchDetailData
