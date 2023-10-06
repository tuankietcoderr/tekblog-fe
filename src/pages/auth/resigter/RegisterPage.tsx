import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import ROUTE from "@/constants/route"
import Logo from "@/components/logo"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MAJORS from "@/constants/major"

const formSchema = z
    .object({
        username: z
            .string()
            .min(3, { message: "Username must be at least 3 characters long" })
            .max(20, { message: "Username must be at most 20 characters long" })
            .refine((data) => new RegExp("^\\w[\\w.]{2,18}\\w$").test(data), "Invalid username"),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .max(20, { message: "Password must be at most 20 characters long" }),
        confirmPassword: z.string(),
        email: z.string().email({ message: "Invalid email" }),
        name: z
            .string()
            .min(3, { message: "Name must be at least 3 characters long" })
            .max(20, { message: "Name must be at most 20 characters long" }),
        major: z.string().optional(),
        bio: z.string().optional()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password does not match",
        path: ["confirmPassword"]
    })

const RegisterPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: ""
        }
    })

    const [step, setStep] = React.useState(1) // 2 step
    const navigation = useNavigate()

    const handleOnClickNext = () => {
        form.trigger().then((isValid) => {
            if (isValid) {
                setStep(2)
            }
        })
    }

    const handleOnClickBack = () => {
        setStep(1)
    }

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (form.formState.isValid) {
            console.log(data)
            navigation(ROUTE.AUTH.SIGIN)
        }
    }

    return (
        <div className='relative flex min-h-screen items-center justify-start bg-[url("/register.png")] bg-cover bg-fixed bg-no-repeat'>
            {/* <div className='absolute inset-0 bg-gradient-to-r from-white/40 to-white/20' /> */}
            <div className='mx-[10%] flex max-w-[390px] flex-col items-stretch gap-6 rounded-md border border-white bg-white/25 p-8 backdrop-blur-sm'>
                <div className='flex flex-col items-center gap-4'>
                    <Logo />
                    <h2 className='text-3xl font-bold'>Welcome to TekBlog!</h2>
                    <p className='text-sm font-semibold'>Let create your account to have your first touch!</p>
                </div>
                <Form {...form}>
                    <form className='flex flex-col gap-3' onSubmit={form.handleSubmit(onSubmit)}>
                        {step === 1 ? (
                            <>
                                <FormField
                                    control={form.control}
                                    name='name'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-sm font-semibold'>Full name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder='Tek de Blog'
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
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-sm font-semibold'>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder='example@gmail.com'
                                                    className='bg-white'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='username'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-sm font-semibold'>Username</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder='tekblog' className='bg-white' />
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
                                                    placeholder='12345678aA@'
                                                    type='password'
                                                    className='bg-white'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='confirmPassword'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-sm font-semibold'>Confirm password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder='12345678aA@'
                                                    type='password'
                                                    className='bg-white'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        ) : (
                            <>
                                <FormField
                                    control={form.control}
                                    name='major'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-sm font-semibold'>Major</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange}>
                                                    <SelectTrigger className='bg-white'>
                                                        <SelectValue placeholder='Choose your major' />
                                                    </SelectTrigger>
                                                    <SelectContent position='item-aligned'>
                                                        {MAJORS.map((major) => (
                                                            <SelectItem key={major} value={major}>
                                                                {major}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='bio'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-sm font-semibold'>Bio (optional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder='I love...'
                                                    className='bg-white'
                                                    type='text'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        {step === 1 && <Button onClick={handleOnClickNext}>Next</Button>}
                        {step === 2 && <Button type='submit'>Finish</Button>}
                        {step === 2 && (
                            <Button onClick={handleOnClickBack} variant='secondary'>
                                Go back
                            </Button>
                        )}
                        <p className='text-center text-sm text-gray-500'>
                            Already have an account?{" "}
                            <Link
                                className='font-semibold text-sky-600 underline underline-offset-2 transition-opacity sm:hover:opacity-80'
                                to={ROUTE.AUTH.SIGIN}
                            >
                                Sign in now
                            </Link>
                        </p>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default RegisterPage
