import VerifyApiController from "@/api/verify"
import { Button } from "@/components/ui/button"
import { useUserContext } from "@/context/UserContext"
import { cn } from "@/lib/utils"
import apiToast from "@/utils/toast"
import { t } from "i18next"
import React, { useState } from "react"
import toast from "react-hot-toast"

const AccountEmail = () => {
    const { user } = useUserContext()
    const onSendVerificationEmail = async () => {
        apiToast({
            promise: VerifyApiController.sendVerifyEmail(),
            loadingText: "Sending verification email..."
        })
    }
    return (
        <div className='flex flex-col gap-4 rounded-md bg-white p-4 shadow-custom'>
            <h2 className='text-xl font-bold'>{t("account_email")}</h2>
            <div className='flex w-full items-center gap-4'>
                <h4 className='font-semibold'>{t("primary_email")}</h4>
                <p className='flex-1'>{user?.email}</p>
                {user?.isEmailVerified ? (
                    <p className='text-sm font-semibold text-green-500'>{t("verified")}</p>
                ) : (
                    <Button onClick={onSendVerificationEmail} variant='outline'>
                        {t("send_verification_email")}
                    </Button>
                )}
            </div>
        </div>
    )
}

export default AccountEmail
