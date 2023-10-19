import React from "react";

export default function Page({ params }: { params: { theme: string } }) {
  const validThemes = {
    dark: "darkTheme",
    light: "lightTheme",
    green: "greenTheme",
    blue: "blueTheme",
  };

  const themeName = Object.keys(validThemes).includes(
    params.theme.toLowerCase()
  )
    ? params.theme[0].toUpperCase() + params.theme.slice(1).toLowerCase()
    : "Dark";
  const themeClass =
    validThemes[themeName.toLowerCase() as keyof typeof validThemes];

  return <div className={"container " + themeClass}>page</div>;
}
