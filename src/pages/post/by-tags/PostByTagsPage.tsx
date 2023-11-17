import React from "react"
import { useLocation, useParams } from "react-router-dom"

const PostByTagsPage = () => {
    const params = useParams()
    console.log(params)
    return <div>PostByTagsPage</div>
}

export default PostByTagsPage
