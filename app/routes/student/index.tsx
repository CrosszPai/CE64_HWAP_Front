import { lab, queue, user, working } from "@prisma/client";
import classNames from "classnames";
import { json, LoaderFunction, redirect, useLoaderData } from "remix";
import { auth, sessionStorage } from "~/auth.server";
import Navbar from "~/components/shared/Navbar";
import { db } from "~/utils/db.server";

type LoaderData = {
  error: { message: string } | null;
  user: user;
  workings: (working & { queue: queue[]; lab: lab })[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const authData = await auth.isAuthenticated(request, {});
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const error = session.get(auth.sessionErrorKey) as LoaderData["error"];
  if (!authData?.user || error) {
    return redirect("/");
  }
  const workings = await db.working.findMany({
    where: {
      ownerId: authData.user.id,
    },
    include: {
      queue: {
        take: 1,
        orderBy: {
          created_at: "desc",
        },
      },
      lab: true,
    },
  });

  return json<LoaderData>({ error, user: authData.user, workings });
};

const Student: React.FC = () => {
  const data = useLoaderData<LoaderData>();
  return (
    <Navbar>
      <div className="card lg:card-side bordered shadow-lg mt-5">
        <figure>
          <img
            src={data.user.avatar_url}
            className="w-[200px] h-[200px]"
            alt="profile"
            width="200"
            height="200"
          />
        </figure>
        <div className="card-body mt-3">
          <h2 className="card-title">Name : {data.user.name}</h2>
          <h2 className="card-title">ID : 61010260</h2>
          <h2 className="card-title">Email : {data.user.email}</h2>
        </div>
      </div>
      <div className="flex items-center mt-8">
        <h4 className="prose-xl">Active Lab</h4>
        <a className="btn btn-outline ml-auto" href="/student/labs">
          Explore Lab
        </a>
      </div>
      <div className="flex flex-col">
        {data.workings.map((working) => {
          return (
            <div
              key={working.id}
              className="card lg:card-side justify-center bordered shadow-lg mt-5 mb-5"
            >
              <div className="card-body">
                <div className="card-title flex">
                  <h2 className="card-title">{working.lab.lab_name}</h2>
                  <p
                    className={classNames("ml-auto", {
                      "text-success": working.queue[0]?.status === "DONE",
                      "text-warning": working.queue[0]?.status === "WORKING",
                      "text-error": working.queue[0]?.status === "ERROR",
                    })}
                  >
                    {working.queue[0].status.toLocaleLowerCase()}
                  </p>
                </div>
                <p>{working.lab.lab_detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Navbar>
  );
};

export default Student;
