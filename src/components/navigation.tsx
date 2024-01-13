import { LOCAL_STORAGE_KEY } from "@/constants/local-storage-key"
import ROUTE from "@/constants/route"
import { useAuthContext } from "@/context/AuthContext"
import { useUserContext } from "@/context/UserContext"
import { SearchType } from "@/enum"
import { cn } from "@/lib/utils"
import { HomeIcon, Info, LucideProps, PlusCircle, Search, Tag } from "lucide-react"
import { useRef } from "react"
import toast from "react-hot-toast"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Logo from "./logo"
import ThemeToggle from "./theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { useTranslation } from "react-i18next"
import LanguageToggle from "./language-toggle"

const NavigationBar = () => {
    const { pathname, ...location } = useLocation()
    const { user, setUser } = useUserContext()
    const ignoreShowList = [ROUTE.AUTH.REGISTER, ROUTE.AUTH.SIGIN, ROUTE.AUTH.FORGOT_PASSWORD]
    const isRendered = !ignoreShowList.includes(pathname)
    const searchRef = useRef(null)
    const navigation = useNavigate()
    const { onOpenDialog } = useAuthContext()
    const searchParams = new URLSearchParams(location.search)
    const search_type = (searchParams.get("type") as SearchType) || SearchType.POST

    const onClickCreatePost = () => {
        if (!onOpenDialog()) {
            return
        }
        navigation(ROUTE.POST.NEW)
    }

    const onSearch = () => {
        if (searchRef.current.value === "") {
            return toast.error("Please enter a search term")
        }
        navigation(`${ROUTE.SEARCH}?q=${searchRef.current?.value}&type=${search_type}`)
        searchRef.current.value = ""
    }

    const onLogout = () => {
        setUser(null)
        localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
    }

    const navigations = [
        {
            icon: (props) => <HomeIcon {...props} />,
            path: ROUTE.BASE
        },
        {
            icon: (props) => <Tag {...props} />,
            path: ROUTE.POST.BY_TAGS.replace(":tagId", "all")
        },
        {
            icon: (props) => <Info {...props} />,
            path: ROUTE.ABOUT
        }
    ] as {
        icon: (props: LucideProps) => React.ReactNode
        path: string
    }[]

    const isNavActive = (href: string) => {
        if (pathname === "/" && href === "/") return true
        if (href === "/tag/all" && pathname.includes("/tag")) return true
        if (pathname.includes(href) && href !== "/") return true
        return false
    }

    const { t } = useTranslation(["common"])

    return isRendered ? (
        <div className='sticky top-0 z-[99] flex items-center justify-between gap-4 border bg-white px-[1rem] py-1 shadow-md dark:border-border dark:bg-[hsl(240,10%,3.9%)] md:px-[10%]'>
            <div className='flex items-center gap-3'>
                <Logo className='h-[36px] w-[36px]' />
                <div className='flex items-center gap-2'>
                    <div className='relative w-full'>
                        <Input
                            placeholder='coding,...'
                            className='bg-transparent md:w-60'
                            ref={searchRef}
                            onKeyUp={(e) => e.key === "Enter" && onSearch()}
                        />
                        <button
                            className='absolute bottom-1 right-0 top-1 grid cursor-pointer place-items-center px-3 text-muted-foreground transition-colors hover:text-foreground'
                            onClick={onSearch}
                            title='Search'
                        >
                            <Search size={16} />
                        </button>
                    </div>
                </div>
            </div>
            <div className='hidden gap-2 md:flex'>
                {navigations.map(({ icon: Icon, path }) => (
                    <div key={path} className='relative flex flex-col gap-1'>
                        <Link
                            to={path}
                            className={cn(
                                "rounded-md px-6 py-2 transition-colors",
                                !isNavActive(path) && "hover:bg-gray-100"
                            )}
                            key={path}
                        >
                            <Icon className={cn(isNavActive(path) ? "text-foreground" : "text-gray-500")} size={24} />
                        </Link>
                        {isNavActive(path) && (
                            <div className={cn("absolute -bottom-1 left-0 right-0 h-[3px] rounded bg-foreground")} />
                        )}
                    </div>
                ))}
            </div>
            <div className='fixed bottom-0 left-0 right-0 flex justify-center gap-2 border bg-background py-1 md:hidden'>
                {navigations.map(({ icon: Icon, path }) => (
                    <div key={path} className='relative flex flex-col gap-1'>
                        <Link
                            to={path}
                            className={cn(
                                "rounded-md px-6 py-2 transition-colors",
                                !isNavActive(path) && "hover:bg-gray-100"
                            )}
                            key={path}
                        >
                            <Icon className={cn(isNavActive(path) ? "text-foreground" : "text-gray-500")} size={16} />
                        </Link>
                        {isNavActive(path) && (
                            <div className={cn("absolute -bottom-1 left-0 right-0 h-[2px] rounded bg-foreground")} />
                        )}
                    </div>
                ))}
                <div className='relative flex flex-col gap-1'>
                    <Link
                        to={ROUTE.POST.NEW}
                        className={cn(
                            "rounded-md px-6 py-2 transition-colors",
                            !isNavActive(ROUTE.POST.NEW) && "hover:bg-gray-100"
                        )}
                    >
                        <PlusCircle
                            className={cn(isNavActive(ROUTE.POST.NEW) ? "text-foreground" : "text-gray-500")}
                            size={16}
                        />
                    </Link>
                    {isNavActive(ROUTE.POST.NEW) && (
                        <div className={cn("absolute -bottom-1 left-0 right-0 h-[2px] rounded bg-foreground")} />
                    )}
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <Button className='hidden min-w-max md:inline-flex' onClick={onClickCreatePost}>
                    {t("common:create_post")}
                </Button>
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar className='h-8 w-8 md:h-10 md:w-10'>
                                <AvatarImage src={user?.avatar} alt={user?.name} className='object-cover' />
                                <AvatarFallback className='bg-primary text-primary-foreground'>
                                    {user?.name?.substring(0, 2) || "GE"}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='z-[101] -translate-x-8'>
                            <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to={ROUTE.PROFILE.BASE}>{t("common:profile")}</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to={ROUTE.SETTINGS.concat("?tab=profile")}>{t("common:settings")}</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={onLogout}
                                className='text-destructive dark:text-destructive-foreground'
                            >
                                {t("common:logout")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button variant='secondary' className='min-w-max' asChild>
                        <Link to={ROUTE.AUTH.SIGIN}>{t("common:login")}</Link>
                    </Button>
                )}
                <LanguageToggle />
                <ThemeToggle />
            </div>
        </div>
    ) : null
}

export default NavigationBar
