import PostApiController from "@/api/post"
import { useEffect } from "react"
import { createContext, PropsWithChildren, useContext, useState } from "react"
import { defaultPage } from "."
import usePagination from "@/hooks/usePagination"
import useInfiniteScroll from "@/hooks/useInfiniteScroll"

interface IPostContext {
    posts: IPost[]
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>
    LastElement: () => JSX.Element
}

export const PostContext = createContext<IPostContext>({
    posts: [],
    setPosts: () => {},
    LastElement: () => <></>
})

export const usePostContext = () => useContext(PostContext)

export const PostProvider = ({ children }: PropsWithChildren) => {
    const {
        data: posts,
        setData: setPosts,
        LastElement,
        page
    } = useInfiniteScroll<IPost>({
        fetcher: () => PostApiController.getAll({ limit: 5, page })
    })

    const value = {
        posts,
        setPosts,
        LastElement
    }
    return <PostContext.Provider value={value}>{children}</PostContext.Provider>
}
