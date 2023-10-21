import Clock from "@/components/Clock/Clock";
import { defaultTheme } from "@/lib/Constants";
import prisma from "@/lib/prisma";
import React, { cache } from "react";

type Props = {
  params: { theme: string };
};

export const revalidate = 3600;

export const generateMetadata = cache(
  async ({ params }: { params: { theme: string } }) => {
    let theme = await prisma.theme.findUnique({
      where: { name: params.theme.toLowerCase() },
      select: { name: true },
    });
    return {
      title: `Clock${
        theme ? ` | ${theme.name[0].toUpperCase() + theme.name.slice(1)} ` : ""
      }`,
      description: "Multi-tenant demo",
    };
  }
);

const getThemeData = cache(async (slug: string) => {
  try {
    let theme;

    if (slug !== "default") {
      theme = await prisma.theme.findUnique({
        where: {
          name: slug.toLowerCase(),
          deleted: false,
        },
      });
    }

    if (!theme) {
      theme = await prisma.theme.findFirst({ where: { defaultTheme: true } });
      theme = theme && { ...theme, name: "", editable: true };
    }

    if (!theme) {
      theme = defaultTheme;
    }

    return theme;
  } catch (error) {
    console.log({ themeFetchingError: error });
    return defaultTheme;
  }
});

async function Page({ params }: Props) {
  const themeData = await getThemeData(params.theme);

  return <Clock themeData={themeData} params={params} />;
}

export default Page;
