import type {PageServerLoad} from './$types';
import {redirect} from "@sveltejs/kit";
import {CompanyService, ProductService, CommandService, CategoryService} from "$lib/services";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	const companiesCount = (await CompanyService.countCompaniesByUserId(event.locals.user.id));
	const commandsCount = (await CommandService.countCommands());
	const productsCount = (await ProductService.countProducts());
	const categoriesCount = (await CategoryService.countCategoriesByUserId(event.locals.user.id));

	return {
		productsCount: productsCount.success ? productsCount.data : "N/A",
		companiesCount: companiesCount.success ? companiesCount.data : "N/A",
		commandsCount: commandsCount.success ? commandsCount.data : "N/A",
		categoriesCount: categoriesCount.success ? categoriesCount.data : "N/A"
	}
};