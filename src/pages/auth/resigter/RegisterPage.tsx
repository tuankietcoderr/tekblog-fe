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
import AuthApiController from "@/api/auth"
import { useAuthContext } from "@/context/AuthContext"
import toast from "react-hot-toast"
import { useUserContext } from "@/context/UserContext"
import apiToast from "@/utils/toast"
import { t } from "i18next"

const formSchema = z
    .object({
        username: z
            .string()
            .min(6, { message: "Username must be at least 6 characters long" })
            .max(20, { message: "Username must be at most 20 characters long" }),
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
            confirmPassword: "",
            bio: "",
            major: "",
            name: "",
            email: ""
        }
    })
    const { setUser } = useUserContext()

    const [step, setStep] = React.useState(1) // 2 step
    const navigation = useNavigate()
    const { fallbackUrl } = useAuthContext()

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
        try {
            if (form.formState.isValid) {
                apiToast<IUser>({
                    promise: AuthApiController.register(data as any),
                    onSuccess: (data) => {
                        navigation(fallbackUrl)
                        setUser(data)
                    },
                    loadingText: "Signing in..."
                })
            }
        } catch (err) {
            toast.error("Something went wrong")
        }
    }

    return (
        <div className='relative flex min-h-screen items-center justify-start bg-[url("/register.jpg")] bg-cover bg-fixed bg-no-repeat'>
            <div className='absolute inset-0 hidden bg-background opacity-90 dark:block' />
            <div className='mx-[1rem] my-8 flex w-full flex-col items-stretch gap-6 rounded-md border border-background bg-background/25 p-4 backdrop-blur-sm dark:bg-background md:mx-[10%] md:max-w-[390px] md:p-8'>
                <div className='flex flex-col items-center gap-4'>
                    <Logo />
                    <h2 className='text-center text-3xl font-bold'>{t("welcome")}</h2>
                    <p className='text-center text-sm font-semibold'>{t("welcome_message")}</p>
                </div>
                <Form {...form}>
                    <form className='flex flex-col gap-3' onSubmit={form.handleSubmit(onSubmit)}>
                        <div className={step === 1 ? "flex flex-col gap-3" : "hidden"}>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm font-semibold'>{t("full_name")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='Tek de Blog'
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
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm font-semibold'>{t("email")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='example@gmail.com'
                                                className='bg-background'
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
                                        <FormLabel className='text-sm font-semibold'>{t("username")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='tekblog' className='bg-background' />
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
                                        <FormLabel className='text-sm font-semibold'>{t("password")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='12345678aA@'
                                                type='password'
                                                className='bg-background'
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
                                        <FormLabel className='text-sm font-semibold'>{t("confirm_password")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='12345678aA@'
                                                type='password'
                                                className='bg-background'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className={step === 2 ? "flex flex-col gap-3" : "hidden"}>
                            <FormField
                                control={form.control}
                                name='major'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm font-semibold'>{t("Major")}</FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger className='bg-background'>
                                                    <SelectValue placeholder={t("choose_major")} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent position='item-aligned'>
                                                {MAJORS.map((major) => (
                                                    <SelectItem key={major} value={major}>
                                                        {major}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='bio'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm font-semibold'>
                                            {t("bio")} ({t("optional")})
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                autoComplete='off'
                                                placeholder='I love...'
                                                className='bg-background'
                                                type='text'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {step === 1 && <Button onClick={handleOnClickNext}>{t("next")}</Button>}
                        {step === 2 && <Button type='submit'>{t("finish")}</Button>}
                        {step === 2 && (
                            <Button onClick={handleOnClickBack} variant='secondary'>
                                {t("back")}
                            </Button>
                        )}
                        <p className='text-center text-sm text-gray-500'>
                            {t("already_have_account")}{" "}
                            <Link
                                className='font-semibold text-sky-600 underline underline-offset-2 transition-opacity sm:hover:opacity-80'
                                to={ROUTE.AUTH.SIGIN}
                            >
                                {t("sign_in_now")}
                            </Link>
                        </p>
                    </form>
                </Form>
                <Link to={ROUTE.BASE} className='text-center text-sm text-gray-500 underline'>
                    {t("back_to_home_page")}
                </Link>
            </div>
        </div>
    )
}

export default RegisterPage
