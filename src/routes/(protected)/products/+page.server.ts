import type {PageServerLoad} from './$types';
import {redirect} from "@sveltejs/kit";
import {ProductService} from "$lib/services";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        return redirect(302, '/login');
    }

    if (!locals.selectedCompany) {
        return redirect(302, '/settings');
    }

	const products = await ProductService.getProducts(locals.selectedCompany.id);

	if (!products.success) {
		return redirect(302, '/dashboard');
	}

	return {
		products: products.data || []
	};
};