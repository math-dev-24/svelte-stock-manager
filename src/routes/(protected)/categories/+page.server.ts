import type {PageServerLoad} from './$types';
import {CategoryService} from "$lib/services";
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	const categories = await CategoryService.getCategoriesByUserId(event.locals.user.id);

	if (!categories.success) {
		throw redirect(302, '/dashboard');
	}

	return {
		categories: categories.data || []
	};
};