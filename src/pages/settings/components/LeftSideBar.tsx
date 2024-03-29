import ROUTE from "@/constants/route"
import { cn } from "@/lib/utils"
import { t } from "i18next"
import { Shield, Smile } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const LeftSideBar = () => {
    const tabs = [
        {
            name: t("profile"),
            path: ROUTE.SETTINGS.concat(`?tab=profile`),
            icon: <Smile />
        },
        {
            name: t("account"),
            path: ROUTE.SETTINGS.concat(`?tab=account`),
            icon: <Shield />
        }
    ]
    const { search } = useLocation()
    const searchParams = new URLSearchParams(search)
    const tab = searchParams.get("tab")
    return (
        <div className='flex flex-col gap-1 self-start rounded-md border bg-background p-4 shadow-custom'>
            {tabs.map(({ path, icon, name }) => (
                <Link
                    to={path}
                    className={cn(
                        "flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700",
                        path.includes(tab) && "bg-slate-100 dark:bg-slate-700"
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
