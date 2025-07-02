import type {PageServerLoad} from './$types';
import {LogService} from "$lib/services";
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	if (!event.locals.selectedCompany) {
		throw redirect(302, '/settings');
	}

	const logs = await LogService.getLogsByCompanyId(event.locals.selectedCompany.id);

	if (!logs.success) {
		throw redirect(302, '/dashboard');
	}

	return {
		logs: logs.data || []
	};
};