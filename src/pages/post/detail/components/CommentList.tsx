import ListWithLoading from "@/components/ListWithLoading"
import React from "react"
import CommentItem from "./CommentItem"
import Spinner from "@/components/Spinner"

type Props = {
    comments: IComment[]
    loading: boolean
}

const CommentList = ({ comments, loading }: Props) => {
    return (
        <div>
            <ListWithLoading<IComment>
                data={comments}
                isLoading={loading}
                renderItem={(comment) => (
                    <div key={comment._id} className='relative'>
                        {comment?.children && comment.children.length > 0 && (
                            <div className='absolute bottom-2 left-3 top-9 w-[1px] bg-gray-200 dark:bg-slate-800 lg:left-5 lg:top-14' />
                        )}
                        <CommentItem comment={comment} key={comment?._id} />
                    </div>
                )}
                emptyText={""}
                contentContainerClassName='mt-4'
                listFooter={loading && <Spinner />}
            />
        </div>
    )
}

export default CommentList
