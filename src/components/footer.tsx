import React from "react"
import Logo from "./logo"
import { Facebook, Instagram, Linkedin, LucideIcon, MapPin, Phone, Printer, Twitter, Youtube } from "lucide-react"
import { Separator } from "./ui/separator"
import { Link, useLocation } from "react-router-dom"
import ROUTE from "@/constants/route"

const LogoText = ({ text, logo: Logo }: { text: string; logo: LucideIcon }) => {
    return (
        <div className='flex items-center gap-4'>
            <Logo />
            <div>{text}</div>
        </div>
    )
}

const Footer = () => {
    const { pathname } = useLocation()
    const ignoreShowList = [ROUTE.AUTH.REGISTER, ROUTE.AUTH.SIGIN, ROUTE.AUTH.FORGOT_PASSWORD]
    const isRendered = !ignoreShowList.includes(pathname)

    return (
        isRendered && (
            <div className='px-40 py-24'>
                <Separator />
                <div className='mb-20 mt-16 flex justify-around'>
                    <Logo className='h-[150px] w-[150px]' />
                    <div className='min-w-[368px]'>
                        <LogoText text='123 East, 17th Street, St. louis 10001' logo={MapPin} />
                        <div className='mt-4 flex justify-between'>
                            <LogoText text='(123) 456-7890' logo={Phone} />
                            <LogoText text='(123) 456-7890' logo={Printer} />
                        </div>
                        <div className='mt-10 flex items-center gap-6'>
                            <p className='text-gray-500'>Social Media</p>
                            <Facebook />
                            <Twitter />
                            <Linkedin />
                            <Youtube />
                            <Instagram />
                        </div>
                    </div>
                </div>
                <Separator />
                <div className='mt-6 flex justify-between'>
                    <div className='flex gap-10'>
                        <Link to={ROUTE.ABOUT}>ABOUT US</Link>
                        <Link to={"#"}>CONTACT</Link>
                        <Link to={"#"}>HELP</Link>
                    </div>
                    <p className='text-gray-500'>Copyright © 2023 • TekBlog</p>
                </div>
            </div>
        )
    )
}

export default Footer
