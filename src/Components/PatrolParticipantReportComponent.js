
import { useParams } from "react-router-dom";
import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { auth } from "../firebase-config.js";

const mdTheme = createTheme({
    palette: {
      primary: {
        main: "#A9AC5D",
      },
      secondary: {
        main: "#E8E1DB",
      },
      tertiary: {
        default: "#3A3C26",
      },
      background: {
        default: "#E8E1DB",
      },
    },
  });

export const PatrolParticipantReportComponent = ({ documentData }) => {

    const { taskId } = useParams();
    const [isLoaded, setIsLoaded] = React.useState(false);

    return (
        <div>
            PatrolParticipantRaportComponent
        </div>
    )
}