import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import ROUTE from "@/constants/route"
import Logo from "@/components/logo"

const formSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username must be at most 20 characters long" })
        .refine((data) => new RegExp("^\\w[\\w.]{2,18}\\w$").test(data), "Invalid username"),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(20, { message: "Password must be at most 20 characters long" })
})

const SignInPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {}

    return (
        <div className='relative flex min-h-screen items-center justify-end bg-[url("/signin.svg")] bg-cover bg-no-repeat'>
            {/* <div className='absolute inset-0 bg-gradient-to-r from-white/40 to-white/20' /> */}
            <div className='mx-[10%] flex max-w-[390px] flex-col items-stretch gap-14 rounded-md border border-white bg-white/25 p-8 backdrop-blur-sm'>
                <div className='flex flex-col items-center gap-4'>
                    <Logo />
                    <h2 className='text-3xl font-bold'>Welcome back</h2>
                    <p className='text-sm font-semibold'>Sign in to write your next post</p>
                </div>
                <Form {...form}>
                    <form className='flex flex-col gap-5' onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-sm font-semibold'>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='Enter your username'
                                            className='bg-white'
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
                                            className='bg-white'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex justify-end'>
                            <Button variant='link' className='w-fit p-0 text-sky-400' asChild>
                                <Link to={ROUTE.AUTH.FORGOT_PASSWORD}>Forgot password?</Link>
                            </Button>
                        </div>
                        <Button type='submit'>Sign in</Button>
                        <p className='text-center text-sm text-gray-500'>
                            or becoming a member of TekBlog community by{" "}
                            <Link
                                className='font-semibold text-sky-400 underline underline-offset-2 transition-opacity sm:hover:opacity-80'
                                to={ROUTE.AUTH.REGISTER}
                            >
                                Register
                            </Link>
                        </p>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default SignInPage
