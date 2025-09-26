import { AppSidebar } from "@/components/sidebar";

export default function SubdomainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex relative size-full overflow-hidden bg-custom-background-90 rounded-lg transition-all ease-in-out duration-300">
      <div className="size-full p-2 flex-grow transition-all ease-in-out duration-300 overflow-hidden">
        <div className="relative flex flex-col h-full w-full overflow-hidden rounded-lg border border-custom-border-200">
          <div className="relative flex size-full overflow-hidden">
            <AppSidebar />
            <main className="relative flex h-full w-full flex-col overflow-hidden bg-custom-background-100">
              {/* <AppHeader /> */}
              <div>{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
