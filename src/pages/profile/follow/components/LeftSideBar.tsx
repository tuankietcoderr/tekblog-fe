import ROUTE from "@/constants/route"
import { cn } from "@/lib/utils"
import { Shield, Smile } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const LeftSideBar = () => {
    const { search } = useLocation()
    const searchParams = new URLSearchParams(search)
    const type = searchParams.get("type")
    const search_userId = searchParams.get("userId")

    const tabs = [
        {
            name: "Followers",
            path: ROUTE.PROFILE.FOLLOW.concat(`?type=followers&userId=${search_userId}`)
        },
        {
            name: "Following",
            path: ROUTE.PROFILE.FOLLOW.concat(`?type=following&userId=${search_userId}`)
        }
    ]

    return (
        <div className='flex flex-col gap-1 self-start rounded-md bg-white p-4 shadow-custom'>
            {tabs.map(({ path, name }) => (
                <Link
                    to={path}
                    className={cn(
                        "rounded-md p-2 transition-colors hover:bg-gray-100",
                        path.includes(type) && "bg-gray-100"
                    )}
                    key={name}
                    replace
                >
                    <p className='font-semibold'>{name}</p>
                </Link>
            ))}
        </div>
    )
}

export default LeftSideBar
