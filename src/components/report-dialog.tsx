import React from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUserContext } from "@/context/UserContext"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Textarea } from "./ui/textarea"
import apiToast from "@/utils/toast"
import ReportApiController from "@/api/report"
import { ObjectType } from "@/enum"
import { DialogClose } from "@radix-ui/react-dialog"

type Props = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    type?: ObjectType
    objectId: string
}

const formSchema = z.object({
    content: z.string().min(10, "Please enter at least 10 characters"),
    title: z.string().min(10, "Please enter at least 10 characters")
})

const ReportDialog = ({ isOpen = false, setIsOpen = () => {}, type = ObjectType.USER, objectId }: Props) => {
    const { user } = useUserContext()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
            title: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const { content, title } = data
        apiToast({
            promise: ReportApiController.sendReport({
                content,
                title,
                object: objectId,
                objectType: type
            }),
            onSuccess: () => {
                setIsOpen(false)
            },
            loadingText: "Sending report..."
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Report abuse</DialogTitle>
                    <DialogDescription>
                        If you feel this {type.toLowerCase()} is in violation of our Terms of Service, please select the
                        reason below and submit a report.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-2'>
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter report's title" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='content'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Enter report's content" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex space-x-2 self-end'>
                            <DialogClose asChild>
                                <Button variant='ghost'>Cancel</Button>
                            </DialogClose>
                            <Button type='submit'>Send</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default ReportDialog
