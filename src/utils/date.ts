import moment from "moment"
import "moment/dist/locale/vi"

moment.locale(localStorage.getItem("lang") ?? "en")

class DateUtils {
    public static updateLocale(locale: string) {
        moment.updateLocale(locale, null)
    }

    public static getNow(): string {
        return moment().format("YYYY-MM-DD HH:mm:ss")
    }

    public static getToday(): string {
        return moment().format("YYYY-MM-DD")
    }

    public static getYesterday(): string {
        return moment().subtract(1, "days").format("YYYY-MM-DD")
    }

    public static getTomorrow(): string {
        return moment().add(1, "days").format("YYYY-MM-DD")
    }

    public static getAgos(date: Date): string {
        return moment(date).fromNow()
    }

    public static commonFormat(date: Date) {
        return moment(date).format("YYYY-MM-DD")
    }

    public static customFormat(date: Date, format: string) {
        return moment(date).format(format)
    }
}

export default DateUtils
