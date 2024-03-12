import NavBar from "@/components/common/NavBar";
import { Guard } from "@/components/common/Guard.js"

export default function TaskLayout({ children }) {
  return <Guard>
    {children}
  </Guard>;
}
