import ROUTE from "@/constants/route"
import { cn } from "@/lib/utils"
import { Shield, Smile } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const LeftSideBar = () => {
    const tabs = [
        {
            name: "Profile",
            path: ROUTE.SETTINGS.concat(`?tab=profile`),
            icon: <Smile />
        },
        {
            name: "Account",
            path: ROUTE.SETTINGS.concat(`?tab=account`),
            icon: <Shield />
        }
    ]
    const { search } = useLocation()
    const searchParams = new URLSearchParams(search)
    const tab = searchParams.get("tab")
    return (
        <div className='flex flex-col gap-1 self-start rounded-md bg-white p-4 shadow-custom'>
            {tabs.map(({ path, icon, name }) => (
                <Link
                    to={path}
                    className={cn(
                        "flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-100",
                        path.includes(tab) && "bg-gray-100"
                    )}
                    key={name}
                >
                    {icon}
                    <p className='font-semibold'>{name}</p>
                </Link>
            ))}
        </div>
    )
}

export default LeftSideBar
