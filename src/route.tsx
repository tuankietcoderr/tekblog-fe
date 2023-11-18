import { createBrowserRouter } from "react-router-dom"
import BasePage from "./pages/base/BasePage"
import ROUTE from "./constants/route"
import HomePage from "./pages/home/HomePage"
import PostByTagsPage from "./pages/post/by-tags/PostByTagsPage"
import PostDetailPage from "./pages/post/detail/PostDetailPage"
import CreateNewPostPage from "./pages/post/new/CreateNewPostPage"
import ProfilePage from "./pages/profile/ProfilePage"
import ArchivePage from "./pages/profile/archive/ArchivePage"
import FollowPage from "./pages/profile/follow/FollowPage"
import SearchPage from "./pages/search/SearchPage"
import SettingAccount from "./pages/settings/account/SettingAccount"
import SettingProfile from "./pages/settings/profile/SettingProfile"
import SignInPage from "./pages/auth/signin/SignInPage"
import ForgotPasswordPage from "./pages/auth/forgot-password/ForgotPasswordPage"
import RegisterPage from "./pages/auth/resigter/RegisterPage"
import AboutPage from "./pages/about/AboutPage"
import ErrorPage from "./pages/error/ErrorPage"
import { LOCAL_STORAGE_KEY } from "./constants/local-storage-key"

const router = createBrowserRouter([
    {
        path: "/",
        element: <BasePage />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: ROUTE.AUTH.SIGIN,
                element: <SignInPage />
            },
            {
                path: ROUTE.AUTH.REGISTER,
                element: <RegisterPage />
            },
            {
                path: ROUTE.AUTH.FORGOT_PASSWORD,
                element: <ForgotPasswordPage />
            },
            {
                path: ROUTE.HOME,
                element: <HomePage />
            },
            {
                path: ROUTE.POST.BY_TAGS,
                element: <PostByTagsPage />
            },
            {
                path: ROUTE.POST.DETAIL,
                element: <PostDetailPage />
            },
            {
                path: ROUTE.POST.NEW,
                element: <CreateNewPostPage />,
                handle: () => {
                    if (!localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)) {
                        return ROUTE.AUTH.SIGIN
                    }
                }
            },
            {
                path: ROUTE.POST.EDIT,
                element: <CreateNewPostPage />
            },
            {
                path: ROUTE.PROFILE.BASE,
                element: <ProfilePage />
            },
            {
                path: ROUTE.PROFILE.OTHERS,
                element: <ProfilePage />
            },
            {
                path: ROUTE.PROFILE.ARCHIVE,
                element: <ArchivePage />
            },
            {
                path: ROUTE.PROFILE.FOLLOW,
                element: <FollowPage />
            },
            {
                path: ROUTE.SEARCH,
                element: <SearchPage />
            },
            {
                path: ROUTE.SETTINGS.ACCOUNT,
                element: <SettingAccount />
            },
            {
                path: ROUTE.SETTINGS.PROFILE,
                element: <SettingProfile />
            },
            {
                path: ROUTE.ABOUT,
                element: <AboutPage />
            }
        ]
    }
])

export default router
