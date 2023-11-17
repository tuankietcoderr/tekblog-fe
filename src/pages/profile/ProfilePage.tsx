import ROUTE from "@/constants/route"
import { useUserContext } from "@/context/UserContext"
import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

const ProfilePage = () => {
    const { userId } = useParams<{
        userId: string
    }>()

    return <div>ProfilePage</div>
}

export default ProfilePage
