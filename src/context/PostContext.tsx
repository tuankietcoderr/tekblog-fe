import PostApiController from "@/api/post"
import { useEffect } from "react"
import { createContext, PropsWithChildren, useContext, useState } from "react"
import { defaultPage } from "."
import usePagination from "@/hooks/usePagination"
import useInfiniteScroll from "@/hooks/useInfiniteScroll"

interface IPostContext {
    posts: IPost[] | undefined
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>
    LastElement: () => JSX.Element
    loading: boolean
    page: number
}

export const PostContext = createContext<IPostContext>({
    posts: undefined,
    setPosts: () => {},
    LastElement: () => <></>,
    loading: false,
    page: 1
})

export const usePostContext = () => useContext(PostContext)

export const PostProvider = ({ children }: PropsWithChildren) => {
    const {
        data: posts,
        setData: setPosts,
        LastElement,
        page,
        loading
    } = useInfiniteScroll<IPost>({
        fetcher: () => PostApiController.getAll({ limit: 10, page })
    })

    const value = {
        posts,
        setPosts,
        LastElement,
        loading,
        page
    }
    return <PostContext.Provider value={value}>{children}</PostContext.Provider>
}
