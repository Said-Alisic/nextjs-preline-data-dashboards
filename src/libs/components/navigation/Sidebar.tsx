import Link from "next/link";
import { JSX } from "react";

export default function Sidebar(): JSX.Element {
  return (
    <div
      className="bg-white min-h-screen left-0 p-4"
      style={{ width: "16rem", borderRight: "1px solid #e2e8f0" }}
    >
      <section className="gap-4 flex flex-col ml-4 text-lg">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/settings">Settings</Link>
      </section>
    </div>
  );
}
