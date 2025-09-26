"use server";

import { protocol, rootDomain } from "@/helpers/common.helper";
import { redirect } from "next/navigation";

export async function changeUrl() {
  console.log("hello from server");
  redirect(`${protocol}s://syncturtle.${rootDomain}`);
}
