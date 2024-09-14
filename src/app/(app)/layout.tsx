import { BottomBar } from "~/components/bottom-bar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="mb-20 overflow-y-auto">{children}</div>
      <BottomBar />
    </>
  );
}
