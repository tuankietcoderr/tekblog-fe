import ROUTE from "@/constants/route"
import { HomeIcon, Tag, Info } from "lucide-react"
import { Link } from "react-router-dom"

const Navigation = () => {
    const navigations = [
        {
            name: "Home",
            icon: <HomeIcon />,
            path: ROUTE.BASE
        },
        {
            name: "Tags",
            icon: <Tag />,
            path: ROUTE.POST.BY_TAGS.replace(":tagId", "all")
        },
        {
            name: "About",
            icon: <Info />,
            path: ROUTE.ABOUT
        }
    ] as {
        name: string
        icon: React.ReactNode
        path: string
    }[]
    return (
        <div className='flex flex-col gap-1 rounded-md bg-white p-4 shadow-custom'>
            {navigations.map(({ icon, name, path }) => (
                <Link
                    to={path}
                    className='flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-100'
                    key={name}
                >
                    {icon}
                    <p className='font-semibold'>{name}</p>
                </Link>
            ))}
        </div>
    )
}

export default Navigation
