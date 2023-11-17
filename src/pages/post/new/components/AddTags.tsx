import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTagContext } from "@/context/TagContext"
import React, { useEffect } from "react"
import { X } from "lucide-react"
import { useFormContext } from "react-hook-form"

const AddTags = () => {
    const [_tags, setTags] = React.useState<string[]>([])
    const { tags } = useTagContext()
    const unselectedTags = tags?.filter((tag) => !_tags?.includes(tag?._id))
    const { setValue } = useFormContext<IPost>()

    useEffect(() => {
        setValue("tags", _tags)
    }, [_tags])

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
                                setTags(_tags.filter((tag) => tag !== tagId))
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
            </div>
            {_tags?.length === 0 && <p className='mt-2 font-semibold text-destructive'>No tags selected</p>}
        </div>
    )
}

export default AddTags
