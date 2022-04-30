import { ActionFunction, json, redirect } from 'remix';
import { auth } from '~/auth.server';
import { db } from '~/utils/db.server';

export const action: ActionFunction = async ({ request, context, params }) => {
	const authData = await auth.isAuthenticated(request, {});
	if (authData?.user.role !== 'admin') {
		return redirect('/admin/hardware');
	}
	if (!params['id']) {
		return redirect('/admin/hardware');
	}
	await db.hardware.delete({
        where:{
            id: params['id']
        }
	});
	return redirect('/admin/hardware');
};
