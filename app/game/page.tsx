import { ZipGame } from "@/modules/game/ZipGame";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play Zip | Zip Courtroom",
  description: "Solve the Zip puzzle. Connect the dots, fill the grid.",
};

export default function GamePage() {
  return <ZipGame />;
}
