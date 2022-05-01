import { Link, useLocation } from "remix";
import Navbar from "../shared/Navbar";

const AdminNavbar: React.FC = (props) => {
  const location = useLocation();
  return (
    <Navbar>
      <div className="flex-auto p-2 mx-auto container">
        <div className="grid gap-4 h-full grid-rows-[auto,1fr] md:grid-cols-[min-content,1fr]">
          <ul className="menu place-self-center md:place-self-start mt-0 md:mt-16 w-[min-content] vertical h-[min-content] shadow-lg bg-base-100 rounded-box">
            <li className={location.pathname === "/admin" ? "bordered" : ""}>
              <Link to="/admin">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 inline-block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>{" "}
                <span className="border-none lg:block hidden">Users</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/admin/hardware" ? "bordered" : ""
              }
            >
              <Link prefetch="intent" to="/admin/hardware">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 inline-block mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>{" "}
                <span className="border-none lg:block hidden">Hardwares</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/admin/working" ? "bordered" : ""
              }
            >
              <Link to="/admin/working">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 inline-block mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>{" "}
                <span className="border-none lg:block hidden">Working</span>
              </Link>
            </li>
          </ul>
          {props.children}
        </div>
      </div>
    </Navbar>
  );
};

export default AdminNavbar;
