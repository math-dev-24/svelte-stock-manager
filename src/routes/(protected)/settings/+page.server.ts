import type {PageServerLoad} from './$types';
import {CompanyService} from "$lib/services";
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {

	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const companies = await CompanyService.getCompaniesByUserId(locals.user.id);

	if (!companies.success) {
		throw redirect(302, '/dashboard');
	}

	return {
		companies: companies.data || []
	};
};