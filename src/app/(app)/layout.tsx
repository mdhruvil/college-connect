import { BottomBar } from "~/components/bottom-bar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="h-[92vh] overflow-y-auto">{children}</div>
      <BottomBar />
    </>
  );
}
