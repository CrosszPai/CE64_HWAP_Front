import { user_role_enum } from "@prisma/client";
import { ActionFunction, json, redirect } from "remix";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request, context, params }) => {
  const form = await request.formData();
  const role = form.get("role");
  if (!params.id && role) {
    throw new Error("User id is required and role is required");
  }
  const user = await db.user.update({
    where: { id: parseInt(params.id as string) },
    data: {
      role: role as any,
    },
  });
  return redirect(`/admin`);
};
