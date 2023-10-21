"use client";
import React, { useEffect, useMemo, useState } from "react";
import calculateRotation from "@/lib/calculateRotation";
import formatTimeAMPM from "@/lib/formatTime";
import { defaultTheme, validThemes } from "@/lib/Constants";
import { ToastContainer, toast } from "react-toastify";

type Props = {
  params: { theme: string };
  themeData: ThemeData;
};

type ThemeData = typeof defaultTheme;

export default function Clock({ params, themeData }: Props) {
  const [rotation, setRotation] = useState(
    calculateRotation(new Date("Fri Oct 20 2023 10:10:00"))
  );
  const [time, setTime] = useState(
    formatTimeAMPM(new Date("Fri Oct 20 2023 10:10:00"))
  );
  const [theme, setTheme] = useState({
    ...themeData,
    name:
      params.theme !== "default"
        ? params.theme
            .replace(/[^a-zA-Z0-9]/g, "")
            .toLowerCase()
            .slice(0, 10)
        : "",
  });

  const [createNew, setCreateNew] = useState(
    !themeData.editable || !themeData.name
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInterval(() => {
      setTime(formatTimeAMPM());
      setRotation(calculateRotation());
    }, 1000);
  }, []);

  const handleThemeChange = (key: string, value: string) => {
    const updatedTheme = { ...theme, [key]: value };
    setTheme(updatedTheme);
  };

  const themeStyle = {
    "--bg-color": theme.bgColor,
    "--bg-color2": theme.bgColor2,
    "--clock-shadow": theme.clockShadow,
    "--clock-bezel-color": theme.clockBezelColor,
    "--clock-bezel-border": theme.clockBezelBorder,
    "--clock-face-color": theme.clockFaceColor,
    "--clock-face-shadow": theme.clockFaceShadow,
    "--clock-face-border": theme.clockFaceBorder,
    "--sec-color": theme.secColor,
    "--sec-shadow": theme.secShadow,
    "--min-color": theme.minColor,
    "--min-border": theme.minBorder,
    "--min-shadow": theme.minShadow,
    "--hr-color": theme.hrColor,
    "--hr-border": theme.hrBorder,
    "--hr-shadow": theme.hrShadow,
    "--text-color": theme.textColor,
    "--text-shadow": theme.textShadow,
  } as React.CSSProperties;

  const onSubmitNew = async () => {
    try {
      if (createNew && !theme.name) {
        toast.error("Please give a name", {
          autoClose: 4997,
        });
        return;
      }
      let res = await fetch("/api/createTheme/", {
        method: "POST",
        body: JSON.stringify(theme),
        headers: { "Content-Type": "application/json" },
      });

      let body = await res.json();
      if (body?.isValid) {
        toast.success("Theme created", {
          autoClose: 4997,
        });
        setTimeout(() => {
          window.location.assign(
            "http://" + theme.name + "." + process.env.NEXT_PUBLIC_ROOT_DOMAIN
          );
        }, 500);
      } else {
        toast.error(
          body?.message || body?.error?.message || "Some error occured",
          {
            autoClose: 4997,
          }
        );
      }
    } catch (error) {
      toast.error(String(error) || "Some error occured", {
        autoClose: 4997,
      });
    }
  };

  const onModifyTheme = async () => {
    try {
      if (!theme.name) {
        toast.error("Please give a name", {
          autoClose: 4997,
        });
        return;
      }
      let res = await fetch("/api/createTheme/", {
        method: "PATCH",
        body: JSON.stringify(theme),
        headers: { "Content-Type": "application/json" },
      });

      let body = await res.json();
      if (body?.isValid) {
        toast.success("Theme Updated", {
          autoClose: 4997,
        });
      } else {
        toast.error(
          body?.message || body?.error?.message || "Some error occured",
          {
            autoClose: 4997,
          }
        );
      }
    } catch (error) {
      toast.error(String(error) || "Some error occured", {
        autoClose: 4997,
      });
    }
  };

  const onSubmit = async () => {
    if (loading) return;
    setLoading(true);
    if (createNew) {
      await onSubmitNew();
    } else {
      await onModifyTheme();
    }
    setLoading(false);
  };

  return (
    <div style={themeStyle} className={"container "}>
      <ToastContainer />
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
        {["dark", "blue", "light", "green"].map((val) => {
          if (val == themeData.name) return null;
          return (
            <a
              href={`http://${val}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
              key={val}
              className={val}
            ></a>
          );
        })}
      </div>
      <div className={`editor`}>
        <div className="editorContent">
          <h2>Customize Themes</h2>
          {themeData.editable && themeData.name && (
            <label className="label">
              Create New:
              <input
                checked={createNew}
                onChange={() => setCreateNew((b) => !b)}
                type="checkbox"
              />
            </label>
          )}
          {!!createNew && (
            <label className="label">
              Name:
              <input
                type="text"
                value={theme.name.toLowerCase()}
                onChange={(e) =>
                  handleThemeChange(
                    "name",
                    e.target.value
                      .replace(/[^a-zA-Z0-9]/g, "")
                      .toLowerCase()
                      .slice(0, 10)
                  )
                }
              />
            </label>
          )}
          <label className="label">
            Background Color:
            <input
              type="color"
              value={theme.bgColor}
              onChange={(e) => handleThemeChange("bgColor", e.target.value)}
            />
          </label>

          <label className="label">
            Grid Color:
            <input
              type="color"
              value={theme.bgColor2}
              onChange={(e) => handleThemeChange("bgColor2", e.target.value)}
            />
          </label>

          <label className="label">
            Clock Shadow:
            <input
              type="color"
              value={theme.clockShadow}
              onChange={(e) => handleThemeChange("clockShadow", e.target.value)}
            />
          </label>

          <label className="label">
            Clock Bezel Color:
            <input
              type="color"
              value={theme.clockBezelColor}
              onChange={(e) =>
                handleThemeChange("clockBezelColor", e.target.value)
              }
            />
          </label>

          <label className="label">
            Clock Bezel Border:
            <input
              type="color"
              value={theme.clockBezelBorder}
              onChange={(e) =>
                handleThemeChange("clockBezelBorder", e.target.value)
              }
            />
          </label>

          <label className="label">
            Clock Face Color:
            <input
              type="color"
              value={theme.clockFaceColor}
              onChange={(e) =>
                handleThemeChange("clockFaceColor", e.target.value)
              }
            />
          </label>

          <label className="label">
            Clock Face Shadow:
            <input
              type="color"
              value={theme.clockFaceShadow}
              onChange={(e) =>
                handleThemeChange("clockFaceShadow", e.target.value)
              }
            />
          </label>

          <label className="label">
            Clock Face Border:
            <input
              type="color"
              value={theme.clockFaceBorder}
              onChange={(e) =>
                handleThemeChange("clockFaceBorder", e.target.value)
              }
            />
          </label>

          <label className="label">
            Second Hand Color:
            <input
              type="color"
              value={theme.secColor}
              onChange={(e) => handleThemeChange("secColor", e.target.value)}
            />
          </label>

          <label className="label">
            Second Hand Shadow:
            <input
              type="color"
              value={theme.secShadow}
              onChange={(e) => handleThemeChange("secShadow", e.target.value)}
            />
          </label>

          <label className="label">
            Minute Hand Color:
            <input
              type="color"
              value={theme.minColor}
              onChange={(e) => handleThemeChange("minColor", e.target.value)}
            />
          </label>

          <label className="label">
            Minute Hand Border:
            <input
              type="color"
              value={theme.minBorder}
              onChange={(e) => handleThemeChange("minBorder", e.target.value)}
            />
          </label>

          <label className="label">
            Minute Hand Shadow:
            <input
              type="color"
              value={theme.minShadow}
              onChange={(e) => handleThemeChange("minShadow", e.target.value)}
            />
          </label>

          <label className="label">
            Hour Hand Color:
            <input
              type="color"
              value={theme.hrColor}
              onChange={(e) => handleThemeChange("hrColor", e.target.value)}
            />
          </label>

          <label className="label">
            Hour Hand Border:
            <input
              type="color"
              value={theme.hrBorder}
              onChange={(e) => handleThemeChange("hrBorder", e.target.value)}
            />
          </label>

          <label className="label">
            Hour Hand Shadow:
            <input
              type="color"
              value={theme.hrShadow}
              onChange={(e) => handleThemeChange("hrShadow", e.target.value)}
            />
          </label>

          <label className="label">
            Text Color:
            <input
              type="color"
              value={theme.textColor}
              onChange={(e) => handleThemeChange("textColor", e.target.value)}
            />
          </label>

          <label className="label">
            Text Shadow:
            <input
              type="color"
              value={theme.textShadow}
              onChange={(e) => handleThemeChange("textShadow", e.target.value)}
            />
          </label>
          <button
            onClick={onSubmit}
            className="submit"
            disabled={loading || (createNew && !theme.name)}
          >
            {loading ? "Please wait" : createNew ? "Create" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
