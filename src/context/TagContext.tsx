import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react"
import { defaultPage } from "."
import TagApiControler from "@/api/tag"
import usePagination from "@/hooks/usePagination"
import useFetchData from "@/hooks/useFetchData"

interface ITagContext {
    tags: ITag[] | undefined
    setTags: React.Dispatch<React.SetStateAction<ITag[]>>
    tagsWithPosts?: TagWithPosts[]
    tagsLoading: boolean
    tagsWithPostsLoading: boolean
}

export const TagContext = createContext<ITagContext>({
    tags: undefined,
    setTags: () => {},
    tagsWithPosts: [],
    tagsLoading: false,
    tagsWithPostsLoading: false
})

export const useTagContext = () => useContext(TagContext)

export const TagProvider = ({ children }: PropsWithChildren) => {
    const {
        data: tags,
        loading: tagsLoading,
        setData: setTags,
        page
    } = usePagination<ITag>({ fetcher: () => TagApiControler.getAll({ limit: 10, page }) })

    const { data: tagsWithPosts, loading: tagsWithPostsLoading } = useFetchData<TagWithPosts>({
        fetcher: () => TagApiControler.getTagsWithPosts()
    })

    const value = {
        tags,
        setTags,
        tagsWithPosts,
        tagsLoading,
        tagsWithPostsLoading
    }
    return <TagContext.Provider value={value}>{children}</TagContext.Provider>
}
