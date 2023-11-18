import ScrollToTop from "@/components/ScrollToTop"
import NavigationBar from "@/components/navigation"
import ROUTE from "@/constants/route"
import { AuthProvider } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import React, { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"

const BasePage = () => {
    const { pathname } = useLocation()
    const ignoreShowList = [ROUTE.AUTH.REGISTER, ROUTE.AUTH.SIGIN]
    const isRendered = !ignoreShowList.includes(pathname)

    return (
        <AuthProvider>
            <div className='min-h-screen bg-gray-50'>
                <NavigationBar />
                <ScrollToTop />
                <div className={cn(isRendered ? "mx-[8%] py-[2rem]" : "")}>
                    <Outlet />
                </div>
            </div>
        </AuthProvider>
    )
}

export default BasePage
