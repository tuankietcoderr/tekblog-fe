import { RouterProvider } from "react-router-dom"
import { PostProvider } from "./context/PostContext"
import { TagProvider } from "./context/TagContext"
import { UserProvider } from "./context/UserContext"
import router from "./route"
import { Toaster } from "react-hot-toast"

function App() {
    return (
        <UserProvider>
            <PostProvider>
                <TagProvider>
                    <RouterProvider router={router} />
                    <Toaster
                        position='bottom-center'
                        toastOptions={{
                            duration: 2000
                        }}
                    />
                </TagProvider>
            </PostProvider>
        </UserProvider>
    )
}

export default App
