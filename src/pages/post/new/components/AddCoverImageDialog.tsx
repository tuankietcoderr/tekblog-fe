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
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DialogClose } from "@radix-ui/react-dialog"
import React from "react"
import { useFormContext } from "react-hook-form"

const AddCoverImageDialog = () => {
    const { control } = useFormContext<IPost>()
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='outline' className='self-start'>
                    Add a cover image
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Add a cover image</DialogTitle>
                    <DialogDescription>Paste image's url to add</DialogDescription>
                </DialogHeader>
                <FormField
                    control={control}
                    name='thumbnail'
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex items-center space-x-2'>
                                <div className='grid flex-1 gap-2'>
                                    <FormLabel>Link</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Paste image's url here" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />
                <DialogFooter className='justify-start'>
                    <DialogClose asChild>
                        <Button type='button' variant='secondary'>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddCoverImageDialog
