import { BottomBar } from "~/components/bottom-bar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="h-screen overflow-y-auto bg-slate-100 pb-24 *:bg-transparent">
        {children}
      </div>
      <BottomBar />
    </>
  );
}
