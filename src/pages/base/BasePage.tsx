import ScrollToTop from "@/components/ScrollToTop"
import Footer from "@/components/footer"
import NavigationBar from "@/components/navigation"
import ROUTE from "@/constants/route"
import { AuthProvider } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import React, { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"

const BasePage = () => {
    const { pathname } = useLocation()
    const ignoreShowList = [ROUTE.AUTH.REGISTER, ROUTE.AUTH.SIGIN, ROUTE.AUTH.FORGOT_PASSWORD]
    const isRendered = !ignoreShowList.includes(pathname)

    return (
        <AuthProvider>
            <div className='min-h-screen bg-gray-50'>
                <NavigationBar />
                <ScrollToTop />
                <div className={cn(isRendered ? "mx-[10%] py-[2rem]" : "")}>
                    <Outlet />
                </div>
            </div>
            <Footer />
        </AuthProvider>
    )
}

export default BasePage
