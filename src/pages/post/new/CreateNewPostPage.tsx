// import MDEditor from "@uiw/react-md-editor"
import PostApiController from "@/api/post"
import NeedAuthorizationPageLayout from "@/components/authorization/NeedAuthorizationPageLayout"
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
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import ROUTE from "@/constants/route"
import { usePostContext } from "@/context/PostContext"
import useFetchDetailData from "@/hooks/useFetchDetailData"
import { cn } from "@/lib/utils"
import apiToast from "@/utils/toast"
import { zodResolver } from "@hookform/resolvers/zod"
import MDEditor, { commands } from "@uiw/react-md-editor"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import { z } from "zod"
import AddCoverImageDialog from "./components/AddCoverImageDialog"
import AddTags from "./components/AddTags"

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
    const { setPosts } = usePostContext()
    const navigate = useNavigate()

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const { title, content, isDraft, thumbnail } = data
        if (tags.length === 0) {
            return toast.error("No tags")
        }
        apiToast({
            promise: !post
                ? PostApiController.create({ title, content, tags, ...data })
                : PostApiController.update(post?._id, {
                      title,
                      content,
                      isDraft,
                      tags,
                      thumbnail
                  }),
            onSuccess: (data) => {
                setPosts((prev) =>
                    prev.map((p) => {
                        if (p._id === data._id) {
                            return data
                        }
                        return p
                    })
                )
                navigate(ROUTE.POST.DETAIL.replace(":postId", data._id), {
                    replace: true
                })
            },
            loadingText: "Submitting..."
        })
    }

    const onClickDeletePost = async () => {
        apiToast({
            promise: PostApiController.delete(post?._id),
            onSuccess: () => {
                navigate(ROUTE.BASE)
                setPosts((prev) => prev.filter((p) => p?._id !== post?._id))
            },
            loadingText: "Deleting..."
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
