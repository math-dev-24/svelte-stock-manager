import type {PageServerLoad} from './$types';
import {LogService} from "$lib/services";
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	const logs = await LogService.getLogsByUserId(event.locals.user.id);

	if (!logs.success) {
		throw redirect(302, '/dashboard');
	}

	return {
		logs: logs.data || []
	};
};