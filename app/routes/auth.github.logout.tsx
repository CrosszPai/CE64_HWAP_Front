import type { ActionFunction } from "remix";
import { auth } from "~/auth.server";

export const action: ActionFunction = async ({ request }) => {
  return await auth.logout(request, {
    redirectTo: "/",
  });
};
