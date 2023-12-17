import ROUTE from "@/constants/route"
import { cn } from "@/lib/utils"
import { Shield, Smile } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const LeftSideBar = () => {
    const tabs = [
        {
            name: "Likes",
            path: ROUTE.PROFILE.ARCHIVE.concat("?type=likes")
        },
        {
            name: "Saved",
            path: ROUTE.PROFILE.ARCHIVE.concat("?type=saved")
        }
    ]
    const { search } = useLocation()
    const searchParams = new URLSearchParams(search)
    const type = searchParams.get("type")
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
