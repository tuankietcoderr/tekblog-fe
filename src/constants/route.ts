const ROUTE = {
    BASE: "/",
    HOME: "/",
    AUTH: {
        SIGIN: "/signin",
        REGISTER: "/register",
        FORGOT_PASSWORD: "/forgot-password"
    },
    POST: {
        BY_TAGS: "/post/tag/:tagId", // /post/tags?tag=tag1
        DETAIL: "/post/:postId",
        NEW: "/post/new",
        EDIT: "post/edit/:postId" // /post/new?post_id=123
    },
    PROFILE: {
        BASE: "/profile",
        ARCHIVE: "/profile/archive",
        FOLLOW: "/profile/follow",
        OTHERS: "/profile/:userId"
    },
    SEARCH: "/search",
    SETTINGS: {
        ACCOUNT: "/settings/account",
        PROFILE: "/settings/profile"
    },
    ABOUT: "/about"
}

export default ROUTE
