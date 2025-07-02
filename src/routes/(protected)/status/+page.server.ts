import type {PageServerLoad} from './$types';
import {CommandService} from "$lib/services";
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	if (!event.locals.selectedCompany) {
		throw redirect(302, '/settings');
	}

	const statuses = await CommandService.getStatusesByCompanyId(event.locals.selectedCompany.id);

	if (!statuses.success) {
		throw redirect(302, '/dashboard');
	}

	return {
		statuses: statuses.data || []
	};
};