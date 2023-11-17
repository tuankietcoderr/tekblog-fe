import React from "react"
import { useRouteError } from "react-router-dom"

const ErrorPage = () => {
    const error: any = useRouteError()
    console.log(error.message)
    return <div>{error.toString()}</div>
}

export default ErrorPage
