import { useRouter as useBProgressRouter } from "@bprogress/next";

export function useAppRouter() {
  const router = useBProgressRouter();
  return router;
}
