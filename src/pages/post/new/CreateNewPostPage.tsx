// import MDEditor from "@uiw/react-md-editor"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import MDEditor, { commands } from "@uiw/react-md-editor"
import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import AddCoverImageDialog from "./components/AddCoverImageDialog"
import AddTags from "./components/AddTags"
import PostApiController from "@/api/post"
import { useToast } from "@/components/ui/use-toast"
import { usePostContext } from "@/context/PostContext"
import { useNavigate } from "react-router-dom"
import ROUTE from "@/constants/route"

const formSchema = z.object({
    title: z
        .string()
        .min(10, {
            message: "Title must be at least 10 characters long"
        })
        .max(200, {
            message: "Title must be at most 200 characters long"
        }),
    content: z.string().min(10, {
        message: "Content must be at least 10 characters long"
    }),
    thumbnail: z
        .string()
        .url({
            message: "Thumbnail must be a valid URL"
        })
        .refine(
            (url) => {
                const regex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|svg|jpeg)/g
                return regex.test(url)
            },
            {
                message: "Thumbnail must be a valid image URL"
            }
        ),
    isDraft: z.boolean(),
    tags: z.array(z.string())
})

const CreateNewPostPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
            thumbnail: "",
            isDraft: false,
            tags: []
        }
    })

    const {
        handleSubmit,
        control,
        formState: { errors, isValid },
        getValues,
        getFieldState,
        setValue
    } = form
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const { setPosts } = usePostContext()
    const navigate = useNavigate()

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const { title, content, tags } = data
        if (tags.length === 0) {
            return
        }
        const {
            data: { data: newPost, success, message }
        } = await PostApiController.create({
            title,
            content,
            ...data
        })
        if (success) {
            setPosts((prev) => [newPost, ...prev])
            navigate(ROUTE.POST.DETAIL.replace(":postId", newPost._id), {
                replace: true
            })
        }

        toast({
            description: message
        })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='shadow-custom mx-auto flex w-full max-w-[736px] flex-col gap-4 rounded-md bg-white p-4 py-4'
            >
                <div className='flex flex-col gap-2'>
                    {getFieldState("thumbnail").invalid ? (
                        <p className='font-semibold text-destructive'>{errors.thumbnail?.message}</p>
                    ) : (
                        <img
                            src={getValues("thumbnail")}
                            alt='thumbnail'
                            className='max-h-[300px] rounded-md object-cover'
                        />
                    )}
                    <AddCoverImageDialog />
                </div>
                <FormField
                    control={control}
                    name='title'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    onInput={(event: any) => {
                                        event.target.style.height = "auto"
                                        event.target.style.height = event.target.scrollHeight + "px"
                                    }}
                                    placeholder='Title'
                                    className='resize-none border-none px-0 text-5xl font-extrabold leading-tight shadow-none outline-none focus-visible:ring-0'
                                    autoFocus
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage>{errors.title?.message}</FormMessage>
                        </FormItem>
                    )}
                />

                <AddTags />
                <FormField
                    control={control}
                    name='content'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <MDEditor
                                    preview='edit'
                                    extraCommands={[commands.codeEdit, commands.codePreview]}
                                    className='min-h-[400px] border-none shadow-none outline-none'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage>{errors.content?.message}</FormMessage>
                        </FormItem>
                    )}
                />

                <div className='flex justify-end gap-2'>
                    <Button type='submit' onClick={() => setValue("isDraft", false)} disabled={!isValid}>
                        Submit
                    </Button>
                    <Button type='submit' onClick={() => setValue("isDraft", true)} variant='ghost' disabled={!isValid}>
                        Save draft
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CreateNewPostPage
