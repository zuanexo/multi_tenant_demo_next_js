import prisma from "@/lib/prisma";
import { NextApiRequest } from "next";
import tinycolor from "tinycolor2";

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const dataKeys = [
            "name",
            "bgColor",
            "bgColor2",
            "clockShadow",
            "clockBezelColor",
            "clockBezelBorder",
            "clockFaceColor",
            "clockFaceShadow",
            "clockFaceBorder",
            "secColor",
            "secShadow",
            "minColor",
            "minBorder",
            "minShadow",
            "hrColor",
            "hrBorder",
            "hrShadow",
            "textColor",
            "textShadow",
        ]


        let validation = { isValid: true, message: "" }
        const payload = {} as any
        for (let key of dataKeys) {
            if (key == "name") {
                const isAlbhabetsAndNumbers = (str = "") => /^[a-zA-Z0-9]+$/.test(str);

                if (!data?.[key]) {
                    validation = { isValid: false, message: "Name is required" }
                    break
                }

                if (!isAlbhabetsAndNumbers(data?.[key])) {
                    validation = { isValid: false, message: "Use smallcase alphabets only" }
                    break
                }

                if (data.name.length > 10) {
                    validation = { isValid: false, message: "10 characters max in name" }
                    break
                }

                const existingTheme = await prisma.theme.findUnique({ where: { name: data.name.toLowerCase() } })

                if (existingTheme) {
                    validation = { isValid: false, message: `Theme named "${data.name}" already exists` }
                    break
                }
            } else {
                if (!tinycolor(data?.[key]).isValid()) {

                    validation = {
                        isValid: false, message: `Invalid color ${key} ${data[key]}`
                    }
                    break
                }
            }
            payload[key] = data[key]
        }

        const countInDay = await prisma.theme.count({ where: { updatedAt: { gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) } } })

        if (countInDay > 50) {
            validation = { isValid: false, message: "Limit reached for 24 hours, please try later" }
        }

        if (validation.isValid) {
            await prisma.theme.create({ data: { ...payload, editable: true } })
            return Response.json(validation)
        } else {
            return Response.json(
                validation,
                { status: 400 }
            );

        }
    } catch (error) {
        console.log(`error in creating ${error}`)
        return Response.json(error, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const data = await request.json()
        const dataKeys = [
            "name",
            "bgColor",
            "bgColor2",
            "clockShadow",
            "clockBezelColor",
            "clockBezelBorder",
            "clockFaceColor",
            "clockFaceShadow",
            "clockFaceBorder",
            "secColor",
            "secShadow",
            "minColor",
            "minBorder",
            "minShadow",
            "hrColor",
            "hrBorder",
            "hrShadow",
            "textColor",
            "textShadow",
        ]


        let validation = { isValid: true, message: "" }
        const payload = {} as any
        const name = (data?.name || "") as string
        for (let key of dataKeys) {
            if (key == "name") {

                if (!name) {
                    validation = { isValid: false, message: "Name is required" }
                    break
                }

                const isAlbhabetsAndNumbers = (str = "") => /^[a-zA-Z0-9]+$/.test(str);
                if (!isAlbhabetsAndNumbers(name)) {
                    validation = { isValid: false, message: "Use smallcase alphabets only" }
                    break
                }

                const existingTheme = await prisma.theme.findUnique({ where: { name: name.toLowerCase() } })

                if (!existingTheme) {
                    validation = { isValid: false, message: `Theme named "${data.name}" doesn't exist` }
                    break
                }
                if (!existingTheme.editable) {
                    validation = { isValid: false, message: `Theme named "${data.name}" is read-only` }
                    break
                }
            } else {
                if (!tinycolor(data?.[key]).isValid()) {

                    validation = {
                        isValid: false, message: `Invalid color ${key} ${data[key]}`
                    }
                    break
                }
            }
            payload[key] = data[key]
        }

        const countInDay = await prisma.theme.count({ where: { updatedAt: { gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) } } })

        if (countInDay > 50) {
            validation = { isValid: false, message: "Limit reached for 24 hours, please try later" }
        }

        if (validation.isValid) {
            await prisma.theme.update({ where: { name: name.toLowerCase() }, data: { ...payload, editable: true } })
            return Response.json(validation)
        } else {
            return Response.json(
                validation,
                { status: 400 }
            );

        }
    } catch (error) {
        console.log(`error in updating ${error}`)
        return Response.json(error, { status: 500 })
    }
}