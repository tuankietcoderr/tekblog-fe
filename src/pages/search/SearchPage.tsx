import React from "react"
import { useLocation } from "react-router-dom"

const SearchPage = () => {
    const location = useLocation()
    console.log(location)
    const searchParams = new URLSearchParams(location.search)
    console.log({ searchParams: searchParams.get("q") })
    return <div>{location.search}</div>
}

export default SearchPage
