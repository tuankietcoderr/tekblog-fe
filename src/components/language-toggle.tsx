import React from "react"
import { changeLanguage } from "i18next"
import { useTranslation } from "react-i18next"
import { languages } from "@/translations/languages"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Check } from "lucide-react"
import DateUtils from "@/utils/date"

const LanguageToggle = () => {
    const { i18n } = useTranslation()
    const currentLanguage = i18n.language
    function changeLanguageHandler(lang: string) {
        changeLanguage(lang)
        localStorage.setItem("lang", lang)
        DateUtils.updateLocale(lang)
        location.reload()
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon'>
                    <span>{currentLanguage.toUpperCase()}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='z-[100]'>
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang}
                        className='flex items-center justify-between'
                        onClick={() => changeLanguageHandler(lang)}
                    >
                        {lang.toUpperCase()} {lang === currentLanguage && <Check size={16} />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default LanguageToggle
