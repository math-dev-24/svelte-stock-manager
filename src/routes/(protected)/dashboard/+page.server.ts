import type {PageServerLoad} from './$types';
import {redirect} from "@sveltejs/kit";
import {CompanyService, ProductService, CommandService, CategoryService} from "$lib/services";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	if (!event.locals.selectedCompany) {
		throw redirect(302, '/settings');
	}

	const companiesCount = (await CompanyService.countCompaniesByUserId(event.locals.user.id));
	const commandsCount = (await CommandService.countCommands());
	const productsCount = (await ProductService.countProducts(event.locals.selectedCompany.id));
	const categoriesCount = (await CategoryService.countCategoriesByCompanyId(event.locals.selectedCompany.id));
	const allCategoriesCount = (await CategoryService.getAllCategoriesCount(event.locals.selectedCompany.id));

	return {
		productsCount: productsCount.success ? productsCount.data : "N/A",
		companiesCount: companiesCount.success ? companiesCount.data : "N/A",
		commandsCount: commandsCount.success ? commandsCount.data : "N/A",
		categoriesCount: categoriesCount.success ? categoriesCount.data : "N/A",
		allCategoriesCount: allCategoriesCount.success ? allCategoriesCount.data : []
	}
};