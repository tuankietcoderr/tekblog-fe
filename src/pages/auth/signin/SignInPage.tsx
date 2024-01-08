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
import apiToast from "@/utils/toast"

const formSchema = z.object({
    usernameOrEmail: z.string().min(3, { message: "Username or email must be at least 3 characters long" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(20, { message: "Password must be at most 20 characters long" })
})

const SignInPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            usernameOrEmail: "",
            password: ""
        }
    })

    const navigation = useNavigate()
    const { setUser } = useUserContext()
    const { fallbackUrl } = useAuthContext()

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const { usernameOrEmail, password } = data
        // const {
        //     data: { success, message, data: user }
        // } = await AuthApiController.signin({
        //     usernameOrEmail: usernameOrEmail || "",
        //     password: password || ""
        // })
        // if (success) {
        //     navigation(fallbackUrl)
        //     setUser(user)
        // }
        // toast({
        //     description: message
        // })

        apiToast<IUser>({
            promise: AuthApiController.signin({
                usernameOrEmail: usernameOrEmail || "",
                password: password || ""
            }),
            onSuccess: (data) => {
                navigation(fallbackUrl)
                setUser(data)
            },
            loadingText: "Signing in..."
        })
    }

    return (
        <div className='relative flex min-h-screen items-center justify-start bg-[url("/signin.svg")] bg-cover bg-fixed bg-no-repeat'>
            <div className='hide absolute inset-0 bg-background opacity-90 dark:block' />
            <div className='mx-[1rem] flex max-w-[390px] flex-col items-stretch gap-6 rounded-md border border-foreground bg-background/25 p-4 backdrop-blur-sm dark:bg-background md:mx-[10%] md:p-8'>
                <div className='flex flex-col items-center gap-4'>
                    <Logo />
                    <h2 className='text-center text-3xl font-bold'>Welcome back</h2>
                    <p className='text-center text-sm font-semibold'>Sign in to write your next post</p>
                </div>
                <Form {...form}>
                    <form className='flex flex-col gap-5' onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='usernameOrEmail'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-sm font-semibold'>Username or email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='Enter your username or email'
                                            className='bg-background'
                                            autoFocus
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-sm font-semibold'>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='Enter your password'
                                            type='password'
                                            className='bg-background'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex justify-end'>
                            <Button variant='link' className='w-fit p-0 text-sky-400 dark:text-sky-700' asChild>
                                <Link to={ROUTE.AUTH.FORGOT_PASSWORD}>Forgot password?</Link>
                            </Button>
                        </div>
                        <Button type='submit'>Sign in</Button>
                        <p className='text-center text-sm text-gray-500'>
                            or becoming a member of TekBlog community by{" "}
                            <Link
                                className='font-semibold text-sky-400 underline underline-offset-2 transition-opacity dark:text-sky-700 sm:hover:opacity-80'
                                to={ROUTE.AUTH.REGISTER}
                            >
                                Register
                            </Link>
                        </p>
                    </form>
                </Form>
                <Link to={ROUTE.BASE} className='text-center text-sm text-gray-500 underline'>
                    Back to home page
                </Link>
            </div>
        </div>
    )
}

export default SignInPage
