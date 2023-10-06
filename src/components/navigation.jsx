import React from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Link, useLocation } from "react-router-dom"
import ROUTE from "@/constants/route"
import Logo from "./logo"

const NavigationBar = () => {
    const { pathname } = useLocation()
    const ignoreShowList = [ROUTE.AUTH.REGISTER, ROUTE.AUTH.SIGIN]
    const isRendered = !ignoreShowList.includes(pathname)
    return isRendered ? (
        <div className='flex items-center justify-between gap-4 px-[5%] py-4 shadow-md'>
            <div className='flex w-full items-center gap-3'>
                <Logo className='h-[46px] w-[46px]' />
                <div className='flex w-[50%] items-center gap-2'>
                    <Input placeholder='coding, programming,...' />
                    <Button>Search</Button>
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <Button className='min-w-max' asChild>
                    <Link to={ROUTE.POST.NEW}>Create post</Link>
                </Button>
                {/* <Avatar>
                    <AvatarFallback>U</AvatarFallback>
                </Avatar> */}
                <Button variant='secondary' className='min-w-max' asChild>
                    <Link to={ROUTE.AUTH.SIGIN}>Sign in</Link>
                </Button>
            </div>
        </div>
    ) : null
}

export default NavigationBar
