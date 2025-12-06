import { ZipGame } from "@/modules/game/ZipGame";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play Zip | Zip Courtroom",
  description: "Solve the Zip puzzle. Connect the dots, fill the grid.",
  openGraph: {
    images: [],
  },
  twitter: {
    images: [],
  },
};

export default function GamePage() {
  return <ZipGame />;
}
