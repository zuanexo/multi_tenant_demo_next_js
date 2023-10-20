import { validThemes } from "@/lib/Constants"
export default function getThemeClass(theme: string) {


    const themeName = Object.keys(validThemes).includes(
        theme.toLowerCase()
    )
        ? theme[0].toUpperCase() + theme.slice(1).toLowerCase()
        : "Dark";
    const themeClass =
        validThemes[themeName.toLowerCase() as keyof typeof validThemes];
    return themeClass
}