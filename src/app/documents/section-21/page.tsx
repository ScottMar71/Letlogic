import { redirect } from "next/navigation";

// Section 21 has been deprecated. LetLogic is now a tenant screening tool.
export default function Section21Page() {
  redirect("/screen");
}
