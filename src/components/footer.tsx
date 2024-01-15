import React from "react"
import Logo from "./logo"
import { Facebook, Instagram, Linkedin, LucideIcon, MapPin, Phone, Printer, Twitter, Youtube } from "lucide-react"
import { Separator } from "./ui/separator"
import { Link, useLocation } from "react-router-dom"
import ROUTE from "@/constants/route"
import { t } from "i18next"

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
            <div className='p-4 md:px-40 md:py-24'>
                <Separator />
                <div className='my-4 flex flex-wrap justify-around gap-2 md:mb-20 md:mt-16'>
                    <Logo className='h-[4rem] w-[4rem] md:h-[150px] md:w-[150px]' />
                    <div className='md:min-w-[368px]'>
                        <LogoText text='123 East, 17th Street, St. louis 10001' logo={MapPin} />
                        <div className='mt-4 flex flex-wrap justify-between gap-4'>
                            <LogoText text='(123) 456-7890' logo={Phone} />
                            <LogoText text='(123) 456-7890' logo={Printer} />
                        </div>
                        <div className='mt-10 flex flex-wrap items-center gap-6'>
                            <p className='text-gray-500'>{t("common:social_media")}</p>
                            <div className='flex items-center gap-6'>
                                <Facebook />
                                <Twitter />
                                <Linkedin />
                                <Youtube />
                                <Instagram />
                            </div>
                        </div>
                    </div>
                </div>
                <Separator />
                <div className='mt-6 flex flex-wrap items-center justify-center gap-2 md:justify-between'>
                    <div className='flex gap-10'>
                        <Link to={ROUTE.ABOUT} className='uppercase'>
                            {t("common:about_us")}
                        </Link>
                        <Link to={"#"} className='uppercase'>
                            {t("common:contact")}
                        </Link>
                        <Link to={"#"} className='uppercase'>
                            {t("common:help")}
                        </Link>
                    </div>
                    <p className='text-gray-500'>{t("common:copyright")} © 2023 • TekBlog</p>
                </div>
            </div>
        )
    )
}

export default Footer
