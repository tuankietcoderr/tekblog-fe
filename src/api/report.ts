import { AxiosResponse } from "axios"
import apiInstance from "."

class ReportController implements IApi {
    readonly path: string = "/report"

    private PATHS = {
        ROOT: this.path
    }

    async sendReport(data: IReport): Promise<AxiosResponse<SuccessfulResponseWithPagination<IReport>>> {
        try {
            const res = await apiInstance.post(this.PATHS.ROOT, data)
            return res
        } catch (error) {
            throw error.response
        }
    }
}

const ReportApiController = new ReportController()
export default ReportApiController
