import UserApiController from "@/api/user"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MAJORS from "@/constants/major"
import { useUserContext } from "@/context/UserContext"
import { cn } from "@/lib/utils"
import apiToast from "@/utils/toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

const formSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username must be at most 20 characters long" })
        .optional()
        .refine((data) => new RegExp("^\\w[\\w.]{2,18}\\w$").test(data), "Invalid username"),
    email: z.string().email({ message: "Invalid email" }).optional(),
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(20, { message: "Name must be at most 20 characters long" })
        .optional(),
    major: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().url({ message: "Invalid url" }).optional()
})

const SettingProfile = () => {
    const { user, setUser } = useUserContext()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: user?.username ?? "",
            email: user?.email ?? "",
            name: user?.name ?? "",
            major: user?.major ?? "",
            bio: user?.bio ?? "",
            avatar: user?.avatar ?? ""
        }
    })

    useEffect(() => {
        if (user) {
            form.reset({
                username: user?.username,
                email: user?.email,
                name: user?.name,
                major: user?.major,
                bio: user?.bio,
                avatar: user?.avatar
            }) // reset form when user change
        }
    }, [user])

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        apiToast({
            promise: UserApiController.updateProfile(data as any),
            loadingText: "Updating...",
            onSuccess: (data) => {
                setUser((prev) => ({
                    ...prev,
                    ...data
                }))
            }
        })
    }

    return (
        <div className='rounded-md bg-white p-4 shadow-custom'>
            <h2 className='text-xl font-bold'>Update profile</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm font-semibold'>Full name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder='Tek de Blog' className='bg-white' autoFocus />
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
                                    <Input {...field} placeholder='example@gmail.com' className='bg-white' />
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
                    {
                        <FormField
                            control={form.control}
                            name='major'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-sm font-semibold'>Major</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className='bg-white'>
                                                <SelectValue placeholder='Choose your major' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent position='item-aligned' defaultValue={field.value}>
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
                    }
                    <FormField
                        control={form.control}
                        name='bio'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm font-semibold'>Bio (optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        autoComplete='off'
                                        placeholder='I love...'
                                        className='bg-white'
                                        type='text'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='avatar'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm font-semibold'>Avatar URL</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder='https://example.com/avatar.png'
                                        className='bg-white'
                                        type='url'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit' className={cn("self-start")}>
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default SettingProfile
