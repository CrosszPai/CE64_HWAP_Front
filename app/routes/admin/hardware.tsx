import { hardware, user } from "@prisma/client";
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "remix";
import { auth, sessionStorage } from "~/auth.server";
import AdminNavbar from "~/components/Admin/AdminNavbar";
import CreateHardwareModal from "~/components/Admin/CreateHardwareModal";
import { HardwareStatus } from "~/type";
import { db } from "~/utils/db.server";
import { redis } from "~/utils/redis.server";

type LoaderData = {
  user: user;
  error: { message: string } | null;
  hardwares: (hardware & { status: string | null })[];
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content: string | undefined;
  };
  fields?: {
    name: string;
    content: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const authData = await auth.isAuthenticated(request, {});
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const error = session.get(auth.sessionErrorKey) as LoaderData["error"];
  if (!authData) {
    return redirect("/");
  }

  const hardwares = await db.hardware.findMany();
  if (hardwares.length > 0) {
    const status = await redis.MGET(hardwares.map((hardware) => hardware.id));
    const hardwaresWithStatus = hardwares.map((hardware, index) => ({
      ...hardware,
      status: status[index],
    }));
    return json<LoaderData>({
      user: authData.user,
      error,
      hardwares: hardwaresWithStatus,
    });
  }
  return json<LoaderData>({
    user: authData.user,
    error,
    hardwares: [],
  });
};

export const action: ActionFunction = async ({ request, context, params }) => {
  const authData = await auth.isAuthenticated(request, {});
  if (authData?.user.role !== "admin") {
    return redirect("/");
  }
  const form = await request.formData();
  const id = form.get("id");
  if (typeof id !== "string" || id.length === 0) {
    return badRequest({
      fieldErrors: {
        name: "id",
        content: "กรุณากรอกรหัส Hardware",
      },
    });
  }
  const hardware = await db.hardware.create({
    data: {
      id,
    },
  });
  await redis.set(hardware.id, HardwareStatus.CREATED);
  return json<ActionData>({});
};

const Hardware: React.FC = () => {
  const data = useLoaderData<LoaderData>();
  return (
    <AdminNavbar>
      <div className="flex flex-col">
        <div className="flex mb-2">
          <CreateHardwareModal />
          <Form
            method="get"
            className="ml-auto form-control w-full md:w-[300px] relative"
          >
            <input
              name="search"
              type="text"
              placeholder="search"
              className="input w-full"
            />
            <button
              type="submit"
              aria-label="search"
              className="absolute top-0 right-0 rounded-l-none btn btn-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </Form>
        </div>

        <Form className="max-w-[calc(100vw-1rem)] overflow-x-auto flex flex-col h-full ">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Queue Id</th>
              </tr>
            </thead>
            <tbody>
              {data.hardwares.map((hardware) => {
                return (
                  <tr key={hardware.id}>
                    <th>{hardware.id}</th>
                    <td>{hardware.status}</td>
                    <td>{hardware.queueId}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Form>
      </div>
    </AdminNavbar>
  );
};
export default Hardware;
