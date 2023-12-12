import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import Logo from "@/components/logo"
import AuthApiController from "@/api/auth"
import { useUserContext } from "@/context/UserContext"
import ROUTE from "@/constants/route"
import { useAuthContext } from "@/context/AuthContext"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import apiToast from "@/utils/toast"
import toast from "react-hot-toast"

const ForgotPasswordPage = () => {
    const navigation = useNavigate()
    const [usernameOrEmail, setUsernameOrEmail] = React.useState("")
    const [success, setSuccess] = React.useState(false)

    const handleOnClickSend = async () => {
        if (!usernameOrEmail) {
            toast.error("Please enter your username or email")
            return
        }

        apiToast({
            promise: AuthApiController.forgotPassword(usernameOrEmail),
            onSuccess: () => {
                setSuccess(true)
            },
            loadingText: "Sending..."
        })
    }

    return (
        <div className='relative flex min-h-screen items-center justify-start bg-[url("/signin.svg")] bg-cover bg-fixed bg-no-repeat'>
            {/* <div className='absolute inset-0 bg-gradient-to-r from-white/40 to-white/20' /> */}
            <div className='mx-[10%] flex max-w-[390px] flex-col items-stretch gap-6 rounded-md border border-white bg-white/25 p-8 backdrop-blur-sm'>
                <div className='flex flex-col items-center gap-4'>
                    <Logo />
                    {!success ? (
                        <>
                            <h2 className='text-3xl font-bold'>Find your account</h2>
                            <p className='text-sm font-semibold'>
                                Please enter your username or email address to search for your account
                            </p>
                            <div className='flex w-full flex-col gap-2'>
                                <Label className='text-sm font-semibold' htmlFor='usernameOrEmail'>
                                    Username or email
                                </Label>
                                <Input
                                    placeholder='Enter your username or email'
                                    className='bg-white'
                                    id='usernameOrEmail'
                                    autoFocus
                                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                                    value={usernameOrEmail}
                                />
                            </div>
                            <div className='flex gap-3 self-end'>
                                <Button onClick={() => navigation(-1)} variant='secondary' className='bg-white'>
                                    Cancel
                                </Button>
                                <Button onClick={handleOnClickSend}>Send</Button>
                            </div>
                        </>
                    ) : (
                        <p className='text-sm font-semibold'>
                            A link to reset your password has been sent to your email address. After clicking the link,
                            you will be prompted to enter a new password.
                        </p>
                    )}
                    <Link to={ROUTE.BASE} className='text-center text-sm text-gray-500 underline'>
                        Back to home page
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordPage
