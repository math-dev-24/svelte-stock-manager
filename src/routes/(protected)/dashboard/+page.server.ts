import type {PageServerLoad} from './$types';
import {redirect} from "@sveltejs/kit";
import {CompanyService, ProductService, CommandService} from "$lib/services";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	return {
		productsCount : await ProductService.countProducts(),
		companiesCount: await CompanyService.countCompaniesByUserId(event.locals.user.id),
		commandsCount: await CommandService.countCommands()
	}
};