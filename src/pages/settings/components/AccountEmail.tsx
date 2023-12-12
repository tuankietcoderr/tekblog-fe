import VerifyApiController from "@/api/verify"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useUserContext } from "@/context/UserContext"
import { cn } from "@/lib/utils"
import React, { useState } from "react"

const AccountEmail = () => {
    const { user } = useUserContext()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const onSendVerificationEmail = async () => {
        setLoading(true)
        const {
            data: { message, success }
        } = await VerifyApiController.sendVerifyEmail()
        toast({
            description: message
        })
        setLoading(false)
    }
    return (
        <div className='flex flex-col gap-4 rounded-md bg-white p-4 shadow-custom'>
            <h2 className='text-xl font-bold'>Account emails</h2>
            <div className='flex w-full items-center gap-4'>
                <h4 className='font-semibold'>Primary email</h4>
                <p className='flex-1'>{user?.email}</p>
                {user?.isEmailVerified ? (
                    <p className='text-sm font-semibold text-green-500'>Verified</p>
                ) : (
                    <Button
                        onClick={onSendVerificationEmail}
                        variant='outline'
                        disabled={loading}
                        className={cn(loading && "opacity-50")}
                    >
                        {loading ? "Sending..." : "Send verification email"}
                    </Button>
                )}
            </div>
        </div>
    )
}

export default AccountEmail
