import NavigationBar from "@/components/navigation"
import React from "react"
import { Outlet } from "react-router-dom"

const BasePage = () => {
    return (
        <div>
            <NavigationBar />
            <Outlet />
        </div>
    )
}

export default BasePage
