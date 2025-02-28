import { Shell, User } from "lucide-react";
import { JSX } from "react";

export default function Navbar(): JSX.Element {
  return (
    <div className="top-0 w-full h-16 bg-white border-b border-slate-200 py-2 px-4 inline-flex items-center justify-between">
      <div className="flex items-center">
        <Shell size={40} className="text-[#1924fa]" />
        <h1 className="ml-2 text-2xl font-bold">Preline UI Dashboard</h1>
      </div>
      <span className="inline-flex items-center justify-center size-10 text-sm font-semibold rounded-full text-[#E8E9FE] bg-[#1924fa]">
        <User size={20} />
      </span>
    </div>
  );
}
