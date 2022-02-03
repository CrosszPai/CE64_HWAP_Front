import { user, user_role_enum } from "@prisma/client";
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  MetaFunction,
  redirect,
  useLoaderData,
  useSubmit,
} from "remix";
import { auth, sessionStorage } from "~/auth.server";
import AdminNavbar from "~/components/Admin/AdminNavbar";
import { db } from "~/utils/db.server";

type LoaderData = {
  user: user;
  error: { message: string } | null;
  users: user[];
  page: number;
  limit: number;
  count: number;
  search: string;
};

export const loader: LoaderFunction = async ({ request, context, params }) => {
  let url = new URL(request.url);
  let limit = url.searchParams.get("limit")
    ? parseInt(url.searchParams.get("limit") as string)
    : 10;
  let page = url.searchParams.get("page")
    ? parseInt(url.searchParams.get("page") as string)
    : 1;
  let search = url.searchParams.get("search") ?? undefined;
  if (search?.length === 0) search = undefined;
  const authData = await auth.isAuthenticated(request, {});
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  if (!authData) {
    return redirect("/");
  }
  const users = await db.user.findMany({
    take: limit,
    skip: (page - 1) * limit,

    where: {
      name: {
        search,
      },
    },
  });
  const count = Math.ceil((await db.user.count()) / limit);
  const error = session.get(auth.sessionErrorKey) as LoaderData["error"];
  return json<LoaderData>({
    error,
    user: authData.user,
    users,
    page,
    limit,
    count,
    search: search ?? "",
  });
};

export const meta: MetaFunction = () => {
  const description = `Beryl Hardware Labolatory platform`;
  return {
    description,
    keywords: "Hardware,Automation Testing",
  };
};

export default function Index() {
  let submit = useSubmit();
  const data = useLoaderData<LoaderData>();
  return (
    <AdminNavbar>
      <Form method="get">
        <div className="flex mb-2">
          <div className="ml-auto form-control w-full md:w-[300px] relative">
            <input
              name="search"
              type="text"
              placeholder="search"
              className="input w-full"
              defaultValue={data.search}
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
          </div>
        </div>

        <div className="max-w-[calc(100vw-1rem)] overflow-x-auto flex flex-col h-full ">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => {
                return (
                  <tr key={user.id}>
                    <th>{user.id}</th>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Form
                        method="post"
                        onChange={(e) => {
                          submit(e.currentTarget);
                        }}
                        action={`/admin/user/${user.id}`}
                      >
                        <select
                          defaultValue={user.role}
                          name="role"
                          className="form-select select select-bordered"
                        >
                          <option value={user_role_enum.admin}>
                            {user_role_enum.admin}
                          </option>
                          <option value={user_role_enum.student}>
                            {user_role_enum.student}
                          </option>
                          <option value={user_role_enum.instructor}>
                            {user_role_enum.instructor}
                          </option>
                        </select>
                      </Form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-auto md:mt-2 btn-group md:ml-auto md:mr-0 mx-auto">
            {new Array(data.count).fill(0).map((_, i) => {
              return (
                <label
                  className={`btn btn-primary ${
                    i + 1 === data.page ? "active" : ""
                  }`}
                  key={i}
                >
                  <input
                    className="hidden"
                    type="checkbox"
                    name="page"
                    value={(i + 1).toString()}
                    onChange={(e) => submit(e.currentTarget.form)}
                  ></input>
                  {i + 1}
                </label>
              );
            })}
          </div>
        </div>
      </Form>
    </AdminNavbar>
  );
}
