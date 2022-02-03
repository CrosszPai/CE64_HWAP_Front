import { user } from "@prisma/client";
import { json, LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { GitHubProfile } from "remix-auth-github";
import { auth, sessionStorage } from "~/auth.server";
import Navbar from "~/components/shared/Navbar";
import Toast from "~/components/shared/Toast";

type LoaderData = {
  error: { message: string } | null;
  user: user | null | undefined;
};

export const loader: LoaderFunction = async ({ request }) => {
  const authData = await auth.isAuthenticated(request, {});
  
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const error = session.get(auth.sessionErrorKey) as LoaderData["error"];
  console.log(error)
  return json<LoaderData>({ error, user: authData?.user });
};

export const meta: MetaFunction = () => {
  const description = `Beryl Hardware Labolatory platform`;
  return {
    description,
    keywords: "Hardware,Automation Testing",
  };
};
export const handle = { hydrate: false };

export default function Index() {
  const data = useLoaderData<LoaderData>();
  return (
    <Navbar>
      {data.error && <Toast message={data.error.message} />}
      <div className="hero h-[min-content] bg-base-200">
        <div className="flex-col hero-content lg:flex-row-reverse">
          <img
            alt="cover"
            src="/cover.webp"
            className="rounded-lg shadow-2xl"
            width="384"
            height="256"
          />
          <div>
            <h1 className="mb-5 text-2xl md:text-5xl font-bold text-indigo-600">
              ห้องแล็ปสำหรับวิชา microcontroller
            </h1>
            <h2 className="mb-5 text-lg md:text-3xl">
              แพลตฟอร์มที่จะช่วยในการตรวจสอบแล็ปและรายงานผลโดยอัตโนมัติ
            </h2>
            <div className="card lg:card-side bordered">
              <dl className="card-body">
                <dt>
                  <div className="absolute btn btn-primary flex items-center justify-center h-12 w-12 p-0  text-white">
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium">
                    No Hardware Require
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  นักเรียนไม่ต้องมี microcontroller / development board
                  ในการทำแล็ป ช่วยลดภาระในการทำแล็ป focus เฉพาะการเขียน
                  application ให้ทำงานได้ถูกต้อง
                </dd>
              </dl>
            </div>
            <div className="card lg:card-side bordered">
              <dl className="card-body">
                <dt>
                  <div className="absolute btn btn-primary flex items-center justify-center h-12 w-12 p-0  text-white">
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium">
                    Less human interactive
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  แพลตฟอร์มรองรับการทดสอบและออกรายงานโดยอัตโนมัติ
                  ลดการใช้แรงงานในการตรวจสอบโดยใช้มนุษย์
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
}
