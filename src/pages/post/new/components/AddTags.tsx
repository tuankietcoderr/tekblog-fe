import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTagContext } from "@/context/TagContext"
import React, { memo, useEffect } from "react"
import { X } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TagApiController from "@/api/tag"
import { useToast } from "@/components/ui/use-toast"

type Props = {
    tags: string[]
    setTags: React.Dispatch<React.SetStateAction<string[]>>
}

const AddTags = ({ tags: _tags, setTags }: Props) => {
    const { tags, setTags: setGlobalTags } = useTagContext()
    const unselectedTags = tags?.filter((tag) => !_tags?.includes(tag?._id))
    const [addTag, setAddTag] = React.useState(false)
    const { toast } = useToast()
    console.log(_tags)
    const handleAddTag = async (tag: string) => {
        if (tag === "") return
        const {
            data: { data: newTag, success, message }
        } = await TagApiController.create({
            title: tag
        })
        if (success) {
            setTags((prev) => [...prev, newTag?._id])
            setGlobalTags((prev) => [...prev, newTag])
            setAddTag(false)
        } else {
            toast({
                description: message
            })
        }
    }

    return (
        <div>
            <div className='flex flex-wrap items-center gap-2'>
                {_tags?.map((tagId, index) => (
                    <div
                        key={tagId + index.toString()}
                        className='flex h-6 items-center justify-between gap-2 rounded-md bg-primary px-2'
                    >
                        <p className='text-primary-foreground'>{tags?.find((tag) => tag?._id === tagId)?.title}</p>
                        <X
                            onClick={() => {
                                setTags((prev) => prev.filter((tag) => tag !== tagId))
                            }}
                            size={16}
                            cursor={"pointer"}
                            className='rounded-md text-primary-foreground hover:bg-white hover:text-foreground'
                        />
                    </div>
                ))}
                {unselectedTags?.length > 0 && (
                    <Select onValueChange={(v) => setTags((prev) => [...prev, v])}>
                        <SelectTrigger className='h-6 w-fit'>
                            <SelectValue placeholder='Add tag' />
                        </SelectTrigger>
                        <SelectContent>
                            {unselectedTags?.map((tag) => (
                                <SelectItem key={tag?._id} value={tag?._id}>
                                    {tag?.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {addTag && (
                    <div className='flex items-center gap-2'>
                        <Input
                            type='text'
                            autoFocus
                            placeholder='Enter tag name'
                            className='h-6 w-40 rounded-md px-2'
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleAddTag(e.currentTarget.value)
                                    e.currentTarget.value = ""
                                }
                            }}
                        />
                        <Button
                            variant='outline'
                            className='h-6 w-fit'
                            onClick={() => {
                                setAddTag(false)
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
                {!addTag && (
                    <Button variant='outline' className='h-6 w-fit' type='button' onClick={() => setAddTag(true)}>
                        Create tag
                    </Button>
                )}
            </div>
        </div>
    )
}

export default memo(AddTags)
