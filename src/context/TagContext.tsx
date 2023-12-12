import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react"
import { defaultPage } from "."
import TagApiController from "@/api/tag"
import usePagination from "@/hooks/usePagination"
import useFetchData from "@/hooks/useFetchData"

interface ITagContext {
    tags: ITag[] | undefined
    setTags: React.Dispatch<React.SetStateAction<ITag[]>>
    tagsLoading: boolean
}

export const TagContext = createContext<ITagContext>({
    tags: undefined,
    setTags: () => {},
    tagsLoading: false
})

export const useTagContext = () => useContext(TagContext)

export const TagProvider = ({ children }: PropsWithChildren) => {
    const {
        data: tags,
        loading: tagsLoading,
        setData: setTags
    } = useFetchData<ITag>({ fetcher: () => TagApiController.getAll() })

    const value = {
        tags,
        setTags,
        tagsLoading
    }
    return <TagContext.Provider value={value}>{children}</TagContext.Provider>
}
