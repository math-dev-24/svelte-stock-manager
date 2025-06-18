import { CategoryService, ProductService } from "$lib/services";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
    const { user, selectedCompany } = locals;
    if (!user) {
        return redirect(303, '/login');
    }
    if (!selectedCompany) {
        return redirect(303, '/settings');
    }

    const products = await ProductService.getProducts(selectedCompany.id);

    if (!products.success) {
        return redirect(303, '/products');
    }

    const categories = await CategoryService.getCategoriesByCompanyId(selectedCompany.id);

    if (!categories.success) {
        return redirect(303, '/categories');
    }


    return {
        user,
        products: products.data,
        categories: categories.data
    }
}