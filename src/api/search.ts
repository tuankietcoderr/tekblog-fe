import { SearchType } from "@/enum"
import { AxiosResponse } from "axios"
import apiInstance from "."

class SearchController implements IApi {
    readonly path: string = "/search"

    private readonly PATHS = {
        ROOT: `${this.path}`
    }

    async search({
        q,
        type,
        page = 1,
        limit = 10
    }: {
        q: string
        type: SearchType
    } & Page): Promise<AxiosResponse<SuccessfulResponseWithPagination<(ITag | IPost | IUser)[]>>> {
        try {
            const response = await apiInstance.get(this.PATHS.ROOT, {
                params: {
                    q,
                    type,
                    page,
                    limit
                }
            })
            return response
        } catch (error) {
            throw error.response
        }
    }
}

const SearchApiConroller = new SearchController()
export default SearchApiConroller
