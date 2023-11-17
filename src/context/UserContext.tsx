import AuthApiController from "@/api/auth"
import UserApiController from "@/api/user"
import { useToast } from "@/components/ui/use-toast"
import { LOCAL_STORAGE_KEY } from "@/constants/local-storage-key"
import { useEffect } from "react"
import { useState } from "react"
import { PropsWithChildren, createContext, useContext } from "react"

interface IUserContext {
    user: IUser | undefined | null
    setUser: React.Dispatch<React.SetStateAction<IUser>>
}

export const UserContext = createContext<IUserContext>({
    user: undefined,
    setUser: () => {}
})

export const useUserContext = () => useContext(UserContext)

export const UserProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<IUser | undefined | null>()

    useEffect(() => {
        if (!user && localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)) {
            loadUser()
        }
    }, [user])

    async function loadUser() {
        const {
            data: { success, data: user }
        } = await UserApiController.getCurrentUser()
        if (success) {
            setUser(user)
        }
    }

    const value = {
        user,
        setUser
    }
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
