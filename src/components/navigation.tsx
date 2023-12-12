import { LOCAL_STORAGE_KEY } from "@/constants/local-storage-key"
import ROUTE from "@/constants/route"
import { useUserContext } from "@/context/UserContext"
import { useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Logo from "./logo"
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
import { useAuthContext } from "@/context/AuthContext"
import { SearchType } from "@/enum"
import { HomeIcon, Info, LucideProps, Tag } from "lucide-react"
import { Separator } from "./ui/separator"
import { cn } from "@/lib/utils"

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
    useEffect(() => {
        window.addEventListener("keyup", (e) => {
            if (e.key === "/") {
                searchRef.current?.focus()
            }
        })
    }, [])

    const onClickCreatePost = () => {
        if (!onOpenDialog()) {
            return
        }
        navigation(ROUTE.POST.NEW)
    }

    const onSearch = () => {
        if (searchRef.current.value === "") {
            return
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

    return isRendered ? (
        <div className='sticky top-0 z-[99] flex items-center justify-between gap-4 bg-white px-[5%] py-1 shadow-md'>
            <div className='flex items-center gap-3'>
                <Logo className='h-[36px] w-[36px]' />
                <div className='flex w-60 items-center gap-2'>
                    <div className='relative w-full'>
                        <Input
                            placeholder='coding, programming,...'
                            className='bg-transparent'
                            ref={searchRef}
                            onKeyUp={(e) => e.key === "Enter" && onSearch()}
                        />
                        <kbd className='pointer-events-none absolute bottom-2 right-2 top-2 inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
                            <span className='text-xs'>/</span>
                        </kbd>
                    </div>
                    {/* <Button onClick={onSearch}>Search</Button> */}
                </div>
            </div>
            <div className='flex gap-2'>
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
                            <Icon className={cn(isNavActive(path) ? "text-black" : "text-gray-500")} size={24} />
                        </Link>
                        {isNavActive(path) && (
                            <div className={cn("absolute -bottom-1 left-0 right-0 h-[3px] rounded bg-black")} />
                        )}
                    </div>
                ))}
            </div>
            <div className='flex items-center gap-2'>
                <Button className='min-w-max' onClick={onClickCreatePost}>
                    Create post
                </Button>
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar className='h-8 w-8 md:h-10 md:w-10'>
                                <AvatarImage src={user?.avatar} alt={user?.name} />
                                <AvatarFallback className='bg-primary text-primary-foreground'>
                                    {user?.name?.substring(0, 2) || "GE"}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='z-[101] -translate-x-8'>
                            <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to={ROUTE.PROFILE.BASE}>Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to={ROUTE.SETTINGS.concat("?tab=profile")}>Settings</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={onLogout}
                                className='text-destructive dark:text-destructive-foreground'
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button variant='secondary' className='min-w-max' asChild>
                        <Link to={ROUTE.AUTH.SIGIN}>Sign in</Link>
                    </Button>
                )}
            </div>
        </div>
    ) : null
}

export default NavigationBar
