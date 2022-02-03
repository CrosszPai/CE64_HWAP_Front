import { lab, user } from "@prisma/client";
import { json, Link, LoaderFunction, redirect, useLoaderData } from "remix";
import { auth } from "~/auth.server";
import Navbar from "~/components/shared/Navbar";
import { db } from "~/utils/db.server";

type LoaderData = {
  error: { message: string } | null;
  user: user;
  labs: lab[];
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
  const publishedLabs = await db.lab.findMany({
    where: {
      published: true,
    },
  });

  return json<LoaderData>({ error, user: authData.user, labs: publishedLabs });
};

const Labs: React.FC = () => {
  const data = useLoaderData<LoaderData>();

  return (
    <Navbar>
      <div className="prose prose-xl">
        <h4>แล็บที่เปิดให้ทำ</h4>
      </div>
      <div className="flex flex-col">
        {data.labs.map((lab) => (
          <div className="card lg:card-side bordered shadow-lg mt-5 mb-5">
            <div className="card-body">
              <Link prefetch="intent" to={`/student/labs/${lab.id}`} className="card-title">
                {lab.lab_name}
              </Link>
              <p className="whitespace-pre-line">
                {lab.lab_detail
                  ?.split("\n")
                  .filter((_, index) => {
                    return index < 3;
                  })
                  .join("\n")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Navbar>
  );
};
