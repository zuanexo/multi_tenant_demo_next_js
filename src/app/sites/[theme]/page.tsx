"use client";
import React, { useEffect, useMemo, useState } from "react";
import "./page.css";
import getThemeClass from "@/lib/getThemeClass";
import calculateRotation from "@/lib/calculateRotation";
import formatTimeAMPM from "@/lib/formatTime";
import { validThemes } from "@/lib/Constants";

type Props = {
  params: { theme: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
export default function Page({ params }: Props) {
  const [rotation, setRotation] = useState(
    calculateRotation(new Date("Fri Oct 20 2023 10:10:00"))
  );
  const [time, setTime] = useState(
    formatTimeAMPM(new Date("Fri Oct 20 2023 10:10:00"))
  );
  const themeClass = getThemeClass(params.theme);

  useEffect(() => {
    setInterval(() => {
      setTime(formatTimeAMPM());
      setRotation(calculateRotation());
    }, 1000);
  }, []);

  return (
    <div className={"container " + themeClass}>
      <div className="clock">
        <div className="face">
          <span
            style={{ transform: `rotate(${rotation.hours}deg)` }}
            className="hour"
          ></span>
          <span
            style={{ transform: `rotate(${rotation.minutes}deg)` }}
            className="minute"
          ></span>
          <span
            style={{ transform: `rotate(${rotation.seconds}deg)` }}
            className="second"
          ></span>
          <span className="center"></span>
        </div>
      </div>
      <div className="digital">{time}</div>
      <div className="otherThemes">
        {Object.keys(validThemes).map((val) => {
          if (validThemes[val as keyof typeof validThemes] == themeClass)
            return null;
          return (
            <a
              href={`http://${val}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
              key={val}
              className={val}
            ></a>
          );
        })}
      </div>
    </div>
  );
}
