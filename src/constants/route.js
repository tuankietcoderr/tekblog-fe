const ROUTE = {
    BASE: "/",
    HOME: "/",
    AUTH: {
        SIGIN: "/signin",
        REGISTER: "/register",
        FORGOT_PASSWORD: "/forgot-password"
    },
    POST: {
        BY_TAGS: "/post/tags?tag=", // /post/tags?tag=tag1
        DETAIL: "/post/:post_id",
        NEW: "/post/new",
        EDIT: "post/new?post_id=" // /post/new?post_id=123
    },
    PROFILE: {
        BASE: "/profile",
        ARCHIVE: "/profile/archive",
        FOLLOW: "/profile/follow"
    },
    SEARCH: "/search",
    SETTINGS: {
        ACCOUNT: "/settings/account",
        PROFILE: "/settings/profile"
    }
}

export default ROUTE
