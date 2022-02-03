import { user, user_role_enum } from "@prisma/client";
import { ActionFunction, Form, Link, useLoaderData, useLocation } from "remix";
import { auth } from "~/auth.server";

type LoaderData = {
  user: user | null | undefined;
};

export const action: ActionFunction = async ({ request }) => {
  await auth.logout(request, { redirectTo: "/" });
};
const Navbar: React.FC = (props) => {
  const { user } = useLoaderData<LoaderData>();
  const location = useLocation();
  return (
    <div className="rounded-lg shadow bg-base-200 drawer h-screen">
      <input
        id="drawer"
        type="checkbox"
        className="drawer-toggle"
        aria-label="drawer"
      />
      <div className="flex flex-col drawer-content">
        <div className="w-full navbar">
          <div className="flex-none lg:hidden">
            <label htmlFor="drawer" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">
            <Link to="/"> HW Automation</Link>
            {user?.role === user_role_enum.admin && (
              <>
                <Link to="/admin" className="mx-4 link hidden md:block">
                  Admin
                </Link>
                <Link
                  to="/instructor/lab"
                  className="mx-4 link hidden md:block"
                >
                  Instructor
                </Link>
              </>
            )}
          </div>
          <div className="flex-none hidden lg:block">
            {user && (
              <div className="flex-none dropdown dropdown-end hidden md:block">
                <div className="flex items-center">
                  <p className="mr-4">{user.name}</p>
                  <div
                    tabIndex={0}
                    className="avatar flex w-10 h-10 cursor-pointer active:hover:scale-95"
                  >
                    <img
                      className="mask mask-squircle"
                      src={user.avatar_url}
                      alt="user avatar"
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="p-2 top-10 shadow menu dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link to="/profile">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <a>
                      <Form method="post" action="/auth/github/logout">
                        <button className="w-full flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Loggout
                        </button>
                      </Form>
                    </a>
                  </li>
                </ul>
              </div>
            )}
            {!user && (
              <Form method="post" action="/auth/github">
                <button className="btn btn-outline">
                  <svg
                    className="mr-2"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Sign In <span className="hidden md:block">with Github</span>
                </button>
              </Form>
            )}
          </div>
        </div>
        <div className="p-2 container mx-auto">{props.children}</div>
      </div>
      <div className="drawer-side">
        <label htmlFor="drawer" className="drawer-overlay"></label>
        <ul className="p-4 overflow-y-auto menu w-80 bg-base-100">
          {user ? (
            <li>
              <div className="flex items-center">
                <div className="avatar flex w-10 h-10 cursor-pointer active:hover:scale-95">
                  <img
                    className="mask mask-squircle"
                    src={user.avatar_url}
                    alt="user avatar"
                  />
                </div>
                <div>
                  <p className="ml-4">{user.name}</p>
                  {user.role === user_role_enum.admin && (
                    <>
                      {location.pathname.includes("/admin") ? (
                        <Link to="/" className="mx-4 link">
                          สลับไปหน้าปกติ
                        </Link>
                      ) : (
                        <Link to="/admin" className="mx-4 link">
                          สลับไปหน้า Admin
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
            </li>
          ) : (
            <li>
              <Form method="post" action="/auth/github">
                <button className="btn btn-outline w-full">
                  <svg
                    className="mr-2"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Sign In <span className="hidden md:block">with Github</span>
                </button>
              </Form>
            </li>
          )}
          {user && (
            <li className="mt-auto">
              <Form method="post" action="/auth/github/logout">
                <button className="flex w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </Form>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
