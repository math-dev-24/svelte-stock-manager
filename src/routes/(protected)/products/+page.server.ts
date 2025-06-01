import type {PageServerLoad} from './$types';
import {redirect} from "@sveltejs/kit";
import {ProductService} from "$lib/services";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

	const products = await ProductService.getProducts();

	if (!products.success) {
		throw redirect(302, '/dashboard');
	}

	return {
		products: products.data || []
	};
};