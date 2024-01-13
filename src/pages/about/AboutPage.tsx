import { t } from "i18next"
import React from "react"

const AboutPage = () => {
    return (
        <div className='flex justify-center'>
            <div className='prose text-justify dark:prose-invert'>
                <h1>{t("about")}</h1>
                <p className='indent-8'>{t("about_message")}</p>
                <h3>{t("about_objectives")}</h3>
                <ul>
                    <li>{t("about_objectives_1")}</li>
                    <li>{t("about_objectives_2")}</li>
                    <li>{t("about_objectives_3")}</li>
                    <li>{t("about_objectives_4")}</li>
                    <li>{t("about_objectives_5")}</li>
                </ul>
                <h3>{t("about_benefits")}</h3>
                <ul>
                    <li>{t("about_benefits_1")}</li>
                    <li>{t("about_benefits_2")}</li>
                    <li>{t("about_benefits_3")}</li>
                    <li>{t("about_benefits_4")}</li>
                    <li>{t("about_benefits_5")}</li>
                </ul>
            </div>
        </div>
    )
}

export default AboutPage
