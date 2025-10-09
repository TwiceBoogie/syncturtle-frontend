"use server";

import { INTERNAL_API_BASE_URL } from "@/helpers/common.helper";
import { IInstanceInfo } from "@syncturtle/types";
import { randomBytes } from "crypto";

function newSid() {
  return randomBytes(24).toString("base64url");
}

type TError = {
  status: string;
  message: string;
};

export const fetchInstanceInfo = async (): Promise<IInstanceInfo | TError> => {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_URL}/api/v1/instances`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error("Not 200");
    }

    return data;
  } catch (error) {
    return {
      status: "error",
      message: "Failed to fetch isntance info",
    };
  }
};
