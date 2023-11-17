import { AxiosResponse } from "axios"
import { useEffect, useState } from "react"

type Props<T> = {
    fetcher: () => Promise<AxiosResponse<SuccessfulResponse<T[]>>>
}

const useFetchData = <T extends any>({ fetcher }: Props<T>) => {
    const [data, setData] = useState<T[] | undefined>(undefined)
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
                    setData([])
                }
            } catch (error) {
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    return { data, setData, loading }
}

export default useFetchData
