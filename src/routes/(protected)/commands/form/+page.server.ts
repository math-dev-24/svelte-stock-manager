import { CategoryService, ProductService } from "$lib/services";
import { redirect } from "@sveltejs/kit";
import { CommandService } from "$lib/services/command.service";

export const load = async ({ locals, url }) => {
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

    const statuses = await CommandService.getStatusesByCompanyId(selectedCompany.id);

    if (!statuses.success) {
        return redirect(303, '/status');
    }

    const query = url.searchParams.get('action');
	const id = url.searchParams.get('id');

    if (query === 'update' && id) {
        const command = await CommandService.getCommandById(id);

        if (command.success) {
            return {
                mode: 'update',
                command: command.data,
                statuses: statuses.data
            };
        }
    }

    if (query === 'delete' && id) {
		const command = await CommandService.getCommandById(id);

		if (command.success) {
			return {
				mode: 'delete',
				command: command.data
			};
		}
	}


    return {
        user,
        mode: 'create',
        products: products.data,
        categories: categories.data,
        statuses: statuses.data
    }
}