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
import { useLocation, useNavigate, useParams } from "react-router-dom"
import ROUTE from "@/constants/route"
import { useUserContext } from "@/context/UserContext"
import NeedAuthorizationPageLayout from "@/components/authorization/NeedAuthorizationPageLayout"
import useFetchDetailData from "@/hooks/useFetchDetailData"
import { cn } from "@/lib/utils"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"

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
    thumbnail: z.string().url({
        message: "Thumbnail must be a valid URL"
    }),
    isDraft: z.boolean()
})

const CreateNewPostPage = () => {
    const { postId } = useParams<{
        postId: string
    }>()

    const { data: post } = useFetchDetailData<IPost>({
        fetcher: () => PostApiController.getById(postId),
        canFetch: !!postId,
        deps: [postId]
    })
    const [tags, setTags] = useState([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: post?.title || "",
            content: post?.content || "",
            thumbnail: post?.thumbnail || "",
            isDraft: post?.isDraft || false
        }
    })

    useEffect(() => {
        if (post) {
            form.reset({
                content: post?.content,
                isDraft: post?.isDraft,
                thumbnail: post?.thumbnail,
                title: post?.title
            })
            setTags(post?.tags?.map((t) => t?._id))
        }
    }, [postId, post])

    const {
        handleSubmit,
        control,
        formState: { errors, isValid },
        getValues,
        getFieldState,
        setValue,
        watch
    } = form
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const { setPosts } = usePostContext()
    const { user } = useUserContext()
    const navigate = useNavigate()

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const { title, content, isDraft, thumbnail } = data
        console.log({ tags })
        if (tags.length === 0) {
            return toast({
                description: "No tags"
            })
        }
        const creatingToast = toast({
            description: "Creating..."
        })

        const {
            data: { data: newPost, success, message }
        } = !post
            ? await PostApiController.create({ title, content, tags, ...data })
            : await PostApiController.update(post?._id, {
                  title,
                  content,
                  isDraft,
                  tags,
                  thumbnail
              })
        if (success) {
            creatingToast.update({
                description: "Created",
                id: creatingToast.id
            })
            setPosts((prev) =>
                prev.map((p) => {
                    if (p._id === newPost._id) {
                        return newPost
                    }
                    return p
                })
            )
            navigate(ROUTE.POST.DETAIL.replace(":postId", newPost._id), {
                replace: true
            })
        }
    }

    const onClickDeletePost = async () => {
        const {
            data: { data, message, success }
        } = await PostApiController.delete(post?._id)
        if (success) {
            navigate(ROUTE.BASE)
            setPosts((prev) => prev.filter((p) => p?._id !== post?._id))
        }
        toast({
            description: message
        })
    }

    return (
        <NeedAuthorizationPageLayout>
            <Form {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='mx-auto flex w-full max-w-[736px] flex-col gap-4 rounded-md bg-white p-4 py-4 shadow-custom'
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

                    {watch("title").length >= 10 && <AddTags tags={tags} setTags={setTags} />}
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

                    <div className={cn("flex gap-2", post ? "justify-between" : "justify-end")}>
                        <div>
                            <Button type='submit' onClick={() => setValue("isDraft", false)}>
                                Submit
                            </Button>
                            <Button type='submit' onClick={() => setValue("isDraft", true)} variant='ghost'>
                                Save draft
                            </Button>
                        </div>
                        {post && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant='destructive'>Delete post</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your account and
                                            remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <Button variant='destructive' onClick={onClickDeletePost}>
                                            Yes
                                        </Button>
                                        <AlertDialogCancel>No</AlertDialogCancel>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </form>
            </Form>
        </NeedAuthorizationPageLayout>
    )
}

export default CreateNewPostPage
