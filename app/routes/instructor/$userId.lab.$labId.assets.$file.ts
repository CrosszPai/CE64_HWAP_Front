import { LoaderFunction, redirect } from "remix";

export const loader: LoaderFunction = async ({ params }) => {
    return redirect(`${process.env.FILE_SERVER_URL}/instructor/${params.userId}/lab/${params.labId}/assets/${params.file}`);
}