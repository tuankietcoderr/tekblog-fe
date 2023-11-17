import ROUTE from "@/constants/route"
import { useUserContext } from "@/context/UserContext"
import { cn } from "@/lib/utils"
import React, { PropsWithChildren, memo } from "react"
import { Link } from "react-router-dom"

type Props = {
    cmpId: string
    className?: string
} & PropsWithChildren

const UserLink = ({ cmpId, children, className }: Props) => {
    const { user } = useUserContext()
    return (
        <Link
            to={`${user?._id === cmpId ? ROUTE.PROFILE.BASE : ROUTE.PROFILE.OTHERS.replace(":userId", cmpId)}`}
            className={cn("font-bold transition-colors hover:text-blue-500", className)}
        >
            {children}
        </Link>
    )
}

export default memo(UserLink)
