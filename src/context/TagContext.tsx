import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react"
import { defaultPage } from "."
import TagApiControler from "@/api/tag"

interface ITagContext {
    tags: ITag[] | undefined
    setTags: React.Dispatch<React.SetStateAction<ITag[]>>
    page: Page
    setPage: React.Dispatch<React.SetStateAction<Page>>
    tagsWithPosts?: TagWithPosts[]
}

export const TagContext = createContext<ITagContext>({
    tags: undefined,
    setTags: () => {},
    page: defaultPage,
    setPage: () => {},
    tagsWithPosts: []
})

export const useTagContext = () => useContext(TagContext)

export const TagProvider = ({ children }: PropsWithChildren) => {
    const [tags, setTags] = useState([])
    const [page, setPage] = useState<Page>(defaultPage)
    const [tagsWithPosts, setTagsWithPosts] = useState<TagWithPosts[]>([])

    useEffect(() => {
        fetchTags()
        fetchTagsWithPosts()
    }, [])

    async function fetchTags() {
        const tagsRes = await TagApiControler.getAll()
        const { data } = tagsRes
        const { data: tags, ...rest } = data
        setTags(tags)
        setPage(rest)
    }

    async function fetchTagsWithPosts() {
        const tagsRes = await TagApiControler.getTagsWithPosts()
        const {
            data: { data: tags }
        } = tagsRes
        setTagsWithPosts(tags)
    }

    const value = {
        tags,
        setTags,
        page,
        setPage,
        tagsWithPosts
    }
    return <TagContext.Provider value={value}>{children}</TagContext.Provider>
}
