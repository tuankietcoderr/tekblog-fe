import ScrollToTop from "@/components/ScrollToTop"
import NavigationBar from "@/components/navigation"
import React from "react"
import { Outlet } from "react-router-dom"

const BasePage = () => {
    return (
        <div className='min-h-screen bg-gray-50'>
            <NavigationBar />
            <ScrollToTop />
            <div className='mx-[8%] py-[2rem]'>
                <Outlet />
            </div>
        </div>
    )
}

export default BasePage
