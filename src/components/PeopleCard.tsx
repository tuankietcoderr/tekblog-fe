import React, { useEffect, useState } from "react"
import UserLink from "./UserLink"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { useUserContext } from "@/context/UserContext"
import { Link, useLocation } from "react-router-dom"
import ROUTE from "@/constants/route"
import UserApiController from "@/api/user"
import { useAuthContext } from "@/context/AuthContext"

const PeopleCard = ({ _id, avatar, username, name, bio, followers, major }: IUser) => {
    const { user, setUser } = useUserContext()
    const [follow, setFollow] = useState(false)
    const [followCount, setFollowCount] = useState(followers?.length || 0)
    const { onOpenDialog } = useAuthContext()
    const { pathname, search } = useLocation()
    console.log({ user })
    useEffect(() => {
        const isFollowed = !!(user?.following as string[])?.find((u) => u === _id)
        setFollow(isFollowed)
    }, [user?.following])

    const onClickFollow = async () => {
        if (!onOpenDialog(pathname.concat(search))) {
            return
        }
        setUser((prev) => {
            if (follow) {
                return {
                    ...prev,
                    following: prev.following.filter((id: string) => id !== _id) as string[]
                }
            } else {
                return {
                    ...prev,
                    following: [...prev.following, _id] as string[]
                }
            }
        })

        try {
            const {
                data: { success }
            } = await UserApiController.follow(_id)
            if (!success) {
                setUser((prev) => {
                    if (!follow) {
                        return {
                            ...prev,
                            following: prev.following.filter((id) => id !== _id) as string[]
                        }
                    } else {
                        return {
                            ...prev,
                            following: [...prev.following, _id] as string[]
                        }
                    }
                })
            }
        } catch {
            setUser((prev) => {
                if (!follow) {
                    return {
                        ...prev,
                        following: prev.following.filter((id: string) => id !== _id) as string[]
                    }
                } else {
                    return {
                        ...prev,
                        following: [...prev.following, _id] as string[]
                    }
                }
            })
        } finally {
            setFollowCount((prev) => prev + (follow ? -1 : 1))
        }
    }

    return (
        <div className='flex justify-between gap-4 rounded-md bg-white p-4 shadow-custom'>
            <div className='flex gap-4'>
                <UserLink cmpId={_id} className='self-center'>
                    <Avatar className='h-16 w-16'>
                        <AvatarFallback>{name?.substring(0, 2)}</AvatarFallback>
                        <AvatarImage src={avatar} alt={username} className='object-cover' />
                    </Avatar>
                </UserLink>
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2'>
                        <UserLink cmpId={_id} className='text font-bold hover:text-blue-600'>
                            {name}
                        </UserLink>
                        <Separator orientation='vertical' className='h-4' />
                        <UserLink cmpId={_id} className='text-xs font-semibold hover:text-blue-600'>
                            @{username}
                        </UserLink>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='text-xs'>
                            <span className='font-semibold'>{followCount}</span> followers
                        </p>
                        <p className='text-xs'>
                            {bio} • {major}
                        </p>
                    </div>
                </div>
            </div>
            <Button
                className='self-center'
                variant='outline'
                asChild={user?._id === _id}
                onClick={() => {
                    if (user?._id !== _id) {
                        onClickFollow()
                    }
                }}
            >
                {user?._id === _id ? <Link to={ROUTE.PROFILE.BASE}>View profile</Link> : follow ? "Unfollow" : "Follow"}
            </Button>
        </div>
    )
}

export default PeopleCard
