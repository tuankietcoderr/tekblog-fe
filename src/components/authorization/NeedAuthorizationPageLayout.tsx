import { LOCAL_STORAGE_KEY } from "@/constants/local-storage-key"
import ROUTE from "@/constants/route"
import { useAuthContext } from "@/context/AuthContext"
import { useUserContext } from "@/context/UserContext"
import React, { PropsWithChildren, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../ui/use-toast"

const NeedAuthorizationPageLayout = ({ children }: PropsWithChildren) => {
    const { user } = useUserContext()
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
    const navigation = useNavigate()
    useEffect(() => {
        if ((!user && !token) || !token) {
            navigation(ROUTE.AUTH.SIGIN)
        }
    }, [user, token])
    return children
}

export default NeedAuthorizationPageLayout
