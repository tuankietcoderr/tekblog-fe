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
import { t } from "i18next"

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
                <h2 className='text-xl font-bold'>{t("set_new_password")}</h2>
                <p>
                    {t("under_set_new_password", {
                        email: user?.email
                    })}
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
                        <FormField
                            control={form.control}
                            name='oldPassword'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-sm font-semibold'>{t("current_password")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={t("current_password_placeholder")}
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
                                    <FormLabel className='text-sm font-semibold'>{t("new_password")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={t("new_password_placeholder")}
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
                                    <FormLabel className='text-sm font-semibold'>{t("confirm_new_password")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={t("confirm_new_password_placeholder")}
                                            type='password'
                                            className='bg-white'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit' className={cn("self-start")}>
                            {t("update")}
                        </Button>
                    </form>
                </Form>
            </div>
            <AccountEmail />
        </div>
    )
}

export default SettingAccount
