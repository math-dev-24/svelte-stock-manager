import type {Actions, PageServerLoad} from './$types';
import {redirect} from "@sveltejs/kit";
import { CategoryService } from '$lib/services/category.service';
import { LogService } from '$lib/services/log.service';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	const query = event.url.searchParams.get('action');
	const id = event.url.searchParams.get('id');

	
	if (query === 'update' && id) {
		const category = await CategoryService.getCategoryById(id);

		if (category.success) {
			return {
				mode: 'update',
				category: category.data
			};
		}
	}

	if (query === 'delete' && id) {
		const category = await CategoryService.getCategoryById(id);

		if (category.success) {
			return {
				mode: 'delete',
				category: category.data
			};
		}
	}

	return {
		mode: 'create',
		category: null
	};
};

export const actions: Actions = {
	create: async (event) => {

		if (!event.locals.user) {
			return redirect(302, '/login');
		}

		if (!event.locals.selectedCompany) {
			return redirect(302, '/settings');
		}

		const formData = await event.request.formData();
		const name = formData.get('name') as string;

		if (!name) {
			return {
				success: false,
				error: 'Name is required'
			};
		}
		
		const createdResult = await CategoryService.createCategory(name, event.locals.selectedCompany.id);

		if (createdResult.success) {
			LogService.createLog(event.locals.selectedCompany.id, `Nouvelle catégorie créée : ${name}`);
			return redirect(302, '/categories');
		}

		return {
			success: false,
			error: createdResult.message
		};
	},
	update: async (event) => {
		if (!event.locals.user) {
			return redirect(302, '/login');
		}

		if (!event.locals.selectedCompany) {
			return redirect(302, '/settings');
		}

		const formData = await event.request.formData();
		const id = formData.get('id') as string;
		const name = formData.get('name') as string;

		if (!name) {
			return {
				success: false,
				error: 'Name is required'
			};
		}
		if (!id) {
			return {
				success: false,
				error: 'Id is required'
			};
		}
		
		const updatedResult = await CategoryService.updateCategory(id, name, event.locals.selectedCompany.id);


		if (updatedResult.success) {
			return redirect(302, '/categories');
		}
		
		return {
			success: false,
			error: updatedResult.message
		};
	},
	delete: async (event) => {
		if (!event.locals.user) {
			return redirect(302, '/login');
		}

		if (!event.locals.selectedCompany) {
			return redirect(302, '/settings');
		}

		const formData = await event.request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return {
				success: false,
				error: 'Id is required'
			};
		}
		
		const deletedResult = await CategoryService.deleteCategory(id, event.locals.selectedCompany.id);

		if (deletedResult.success) {
			LogService.createLog(event.locals.user.id, `Catégorie supprimée : ${deletedResult.data.label}`);
			return redirect(302, '/categories');
		}
		
		return {
			success: false,
			error: deletedResult.message
		};
	}
}
