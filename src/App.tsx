import { RouterProvider } from "react-router-dom"
import { Toaster } from "./components/ui/toaster"
import { PostProvider } from "./context/PostContext"
import { TagProvider } from "./context/TagContext"
import { UserProvider } from "./context/UserContext"
import router from "./route"

function App() {
    return (
        <UserProvider>
            <PostProvider>
                <TagProvider>
                    <RouterProvider router={router} />
                    <Toaster />
                </TagProvider>
            </PostProvider>
        </UserProvider>
    )
}

export default App
