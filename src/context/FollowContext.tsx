import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from "react"
import { useUserContext } from "./UserContext"

interface IFollowContext {
    isFollow: boolean
    setIsFollow: React.Dispatch<React.SetStateAction<boolean>>
}

export const FollowContext = createContext<IFollowContext>({
    isFollow: false,
    setIsFollow: () => {}
})

type Props = {
    author: IUser
} & PropsWithChildren

export const FollowProvider = ({ children, author }: Props) => {
    const { user } = useUserContext()
    const [isFollow, setIsFollow] = useState(false)

    useEffect(() => {
        if (author && user) {
            const isFollowed = user.following?.find((following) => following === author?._id)
            if (isFollowed) {
                setIsFollow(true)
            } else {
                setIsFollow(false)
            }
        }
    }, [author, user?.following])

    useEffect(() => {
        if (!user) {
            setIsFollow(false)
        }
    }, [user])

    return (
        <FollowContext.Provider
            value={{
                isFollow,
                setIsFollow
            }}
        >
            {children}
        </FollowContext.Provider>
    )
}

export const useFollowContext = () => useContext(FollowContext)
