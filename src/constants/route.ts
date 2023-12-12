const ROUTE = {
    BASE: "/",
    HOME: "/",
    AUTH: {
        SIGIN: "/signin",
        REGISTER: "/register",
        FORGOT_PASSWORD: "/forgot-password"
    },
    POST: {
        BY_TAGS: "/tag/:tagId", // /post/tags?tag=tag1
        DETAIL: "/post/:postId",
        NEW: "/post/new",
        EDIT: "/post/edit/:postId", // /post/new?post_id=123
        DRAFT: "/post/draft"
    },
    PROFILE: {
        BASE: "/profile",
        ARCHIVE: "/profile/archive",
        FOLLOW: "/profile/follow",
        OTHERS: "/profile/:userId"
    },
    SEARCH: "/search",
    SETTINGS: "/settings",
    ABOUT: "/about"
}

export default ROUTE
