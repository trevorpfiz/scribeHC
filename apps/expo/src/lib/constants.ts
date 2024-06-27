import colors from "tailwindcss/colors";

export const NAV_THEME = {
  light: {
    background: "hsl(0 0% 100%)", // background
    border: "hsl(240 5.9% 90%)", // border
    card: "hsl(0 0% 100%)", // card
    notification: "hsl(0 84.2% 60.2%)", // destructive
    primary: "hsl(240 5.9% 10%)", // primary
    text: "hsl(240 10% 3.9%)", // foreground
  },
  dark: {
    background: "hsl(240 10% 3.9%)", // background
    border: "hsl(240 3.7% 15.9%)", // border
    card: "hsl(240 10% 3.9%)", // card
    notification: "hsl(0 72% 51%)", // destructive
    primary: "hsl(0 0% 98%)", // primary
    text: "hsl(0 0% 98%)", // foreground
  },
};

export const INTRO_CONTENT = [
  {
    title: "scribeHC",
    bg: colors.lime[100],
    fontColor: colors.pink[500],
  },
  {
    title: "scribeHC",
    bg: colors.stone[900],
    fontColor: colors.sky[200],
  },
  {
    title: "scribeHC",
    bg: colors.orange[500],
    fontColor: colors.blue[700],
  },
  {
    title: "scribeHC",
    bg: colors.teal[700],
    fontColor: colors.yellow[400],
  },
  {
    title: "scribeHC",
    bg: colors.green[800],
    fontColor: colors.pink[500],
  },
];
