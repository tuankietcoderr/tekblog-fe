import React, { useEffect } from "react"
import LeftSideBar from "./components/LeftSideBar"
import { useLocation, useNavigate } from "react-router-dom"
import SettingProfile from "./components/SettingProfile"
import SettingAccount from "./components/SettingAccount"
import NeedAuthorizationPageLayout from "@/components/authorization/NeedAuthorizationPageLayout"

const SettingPage = () => {
    const { search } = useLocation()
    const searchParams = new URLSearchParams(search)
    const tab = searchParams.get("tab")

    const navigate = useNavigate()
    useEffect(() => {
        if (!tab) {
            navigate("?tab=profile")
        }
    }, [])

    return (
        <NeedAuthorizationPageLayout>
            <div className='grid grid-cols-[14rem_auto] gap-5 self-start'>
                <LeftSideBar />
                {tab === "profile" ? <SettingProfile /> : <SettingAccount />}
            </div>
        </NeedAuthorizationPageLayout>
    )
}

export default SettingPage
