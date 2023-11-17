import React, { PropsWithChildren, memo } from "react"
import Spinner from "./Spinner"

type Props<T extends any> = {
    isLoading: boolean
    data: T[]
    renderItem: (item: T, index: number) => JSX.Element
    emptyText?: string
}

const ListWithLoading = <T extends any>({ isLoading = false, data = [], renderItem, emptyText }: Props<T>) => {
    console.log({ renderItem })
    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : data?.length > 0 ? (
                data.map((item, index) => renderItem(item, index))
            ) : (
                <p className='text-center text-gray-400'>{emptyText || "No data"}</p>
            )}
        </>
    )
}

export default ListWithLoading
