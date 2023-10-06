/* eslint-disable react/prop-types */
import ROUTE from "@/constants/route"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

const Logo = ({ className }: { className?: string }) => {
    return (
        <Link to={ROUTE.HOME}>
            <img src='/tekblog.svg' alt='logo' className={cn(`h-[36px] w-[36px] object-contain`, className)} />
        </Link>
    )
}

export default Logo
