import UserApiController from "@/api/user"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useUserContext } from "@/context/UserContext"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import AccountEmail from "./AccountEmail"
import apiToast from "@/utils/toast"

const formSchema = z
    .object({
        oldPassword: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .max(20, { message: "Password must be at most 20 characters long" }),
        newPassword: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .max(20, { message: "Password must be at most 20 characters long" }),
        confirmNewPassword: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .max(20, { message: "Password must be at most 20 characters long" })
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Password does not match",
        path: ["confirmNewPassword"]
    })

const SettingAccount = () => {
    const { user } = useUserContext()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        apiToast({
            promise: UserApiController.changePassword(data as any),
            onSuccess: () => {
                form.reset()
            },
            loadingText: "Changing password..."
        })
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4 rounded-md bg-white p-4 shadow-custom'>
                <h2 className='text-xl font-bold'>Set new password</h2>
                <p>
                    If your account was created using social account authentication, you may prefer to add an email log
                    in. If you signed up with a social media account, please reset the password for your primary email
                    address ({user?.email}) in order to enable this. Please note that email login is in addition to
                    social login rather than a replacement for it, so your authenticated social account will continue to
                    be linked to your account.
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
                        <FormField
                            control={form.control}
                            name='oldPassword'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-sm font-semibold'>Current password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='Enter your current password'
                                            className='bg-white'
                                            type='password'
                                            autoFocus
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='newPassword'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-sm font-semibold'>New password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='Enter your new password'
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
                            name='confirmNewPassword'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-sm font-semibold'>Confirm new password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='Re-enter your new password'
                                            type='password'
                                            className='bg-white'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit' className={cn("self-start")}>
                            Set new password
                        </Button>
                    </form>
                </Form>
            </div>
            <AccountEmail />
        </div>
    )
}

export default SettingAccount
