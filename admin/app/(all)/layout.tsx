import { cn } from "@syncturtle/utils";
import { AppProvider } from "app/provider";

export default function InstanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div
        className={cn(
          "h-screen w-full overflow-hidden bg-custom-background-100 relative flex flex-col",
          "app-container"
        )}
      >
        <main className="w-full h-full overflow-hidden relative">{children}</main>
      </div>
    </AppProvider>
  );
}
