import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react"
import { useUserContext } from "./UserContext"
import { LOCAL_STORAGE_KEY } from "@/constants/local-storage-key"
import { useNavigate } from "react-router-dom"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import ROUTE from "@/constants/route"

interface IAuthContext {
    onOpenDialog: (fallbackUrl?: string) => boolean
    fallbackUrl: string
    setFallbackUrl: React.Dispatch<React.SetStateAction<string>>
}

export const AuthContext = createContext<IAuthContext>({
    onOpenDialog: () => false,
    fallbackUrl: ROUTE.BASE,
    setFallbackUrl: () => {}
})

export const useAuthContext = () => useContext(AuthContext)

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const { user } = useUserContext()
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
    const showAlert = (!user && !token) || !token
    const [open, setOpen] = useState(false)
    const [fallbackUrl, setFallbackUrl] = useState(ROUTE.BASE)
    const navigate = useNavigate()

    function onOpenDialog(fallbackUrl?: string): boolean {
        if (showAlert) {
            setOpen(true)
            if (fallbackUrl) {
                setFallbackUrl(fallbackUrl)
            }
            return false
        }
        return true
    }

    const value = {
        onOpenDialog,
        fallbackUrl,
        setFallbackUrl
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
            <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Warning</DialogTitle>
                        <DialogDescription>You need to sign in to continue</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            onClick={() => {
                                navigate(ROUTE.AUTH.SIGIN)
                                setOpen(false)
                            }}
                        >
                            Signin
                        </Button>
                        <Button
                            variant='ghost'
                            onClick={() => {
                                setOpen(false)
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthContext.Provider>
    )
}
