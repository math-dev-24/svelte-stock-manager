import type { Actions, PageServerLoad } from './$types';
import {fail, redirect} from "@sveltejs/kit";
import { ProductService } from "$lib/services";
import { FlashService } from "$lib/services";
import { CategoryService } from "$lib/services";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	const paramsType = event.url.searchParams.get('type');
	const paramsId = event.url.searchParams.get('id');

	if (!paramsType) {
		const categories = await CategoryService.getCategoriesByUserId(event.locals.user.id);
		return {
			product: null,
			categories: categories.success ? categories.data : []
		};
	}

	const validModes: string[] = ['update', 'delete'];

	if (!validModes.includes(paramsType)) {
		throw redirect(302, '/products');
	}

	if (!paramsId) {
		throw redirect(302, '/products');
	}

	const [product, categories] = await Promise.all([
		ProductService.getProductById(paramsId),
		CategoryService.getCategoriesByUserId(event.locals.user.id)
	]);

	if (!product.success) {
		throw redirect(302, '/products');
	}

	const productCategories = await ProductService.getProductCategories(paramsId);

	return {
		product: product.data,
		categories: categories.success ? categories.data : [],
		productCategories: productCategories.success ? productCategories.data : [],
		mode: paramsType
	};
};

export const actions: Actions = {
	create: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, '/login');
		}

		const formData = await event.request.formData();
		const name = formData.get('name');
		const sku = formData.get('sku');
		const description = formData.get('description');
		const minStock = formData.get('minStock');
		const categoryIds = formData.getAll('categories');

		if (!name || !sku || !description || !minStock ||
			typeof name !== 'string' || typeof sku !== 'string' ||
			typeof description !== 'string' || typeof minStock !== 'string') {
			return fail(400, {
				message: 'Tous les champs sont requis',
				type: 'error'
			});
		}

		const response = await ProductService.createProduct(
			name,
			sku,
			description,
			minStock,
			event.locals.user.id
		);

		if (!response.success) {
			return fail(400, {
				message: response.errorCode === 'VALIDATION_ERROR' ?
					'Erreur de validation' : response.message,
				type: 'error'
			});
		}

		if (categoryIds.length > 0) {
			await ProductService.updateProductCategories(
				response.data.id,
				categoryIds.map(id => id.toString())
			);
		}
		
		FlashService.crud.created(event, 'Produit');

		throw redirect(302, '/products');
	},

	update: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, '/login');
		}

		const formData = await event.request.formData();
		const id = formData.get('id');
		const name = formData.get('name');
		const sku = formData.get('sku');
		const description = formData.get('description');
		const minStock = formData.get('minStock');
		const categoryIds = formData.getAll('categories');

		if (!id || !name || !sku || !description || !minStock ||
			typeof id !== 'string' || typeof name !== 'string' ||
			typeof sku !== 'string' || typeof description !== 'string' ||
			typeof minStock !== 'string') {
			return fail(400, {
				message: 'Tous les champs sont requis',
				type: 'error'
			});
		}

		const response = await ProductService.updateProduct(
			id,
			name,
			sku,
			description,
			minStock
		);

		if (!response.success) {
			return fail(400, {
				message: response.errorCode === 'VALIDATION_ERROR' ?
					'Erreur de validation' : response.message,
				type: 'error'
			});
		}

		await ProductService.updateProductCategories(
			id,
			categoryIds.map(id => id.toString())
		);

		// Message de succès
		FlashService.crud.updated(event, 'Produit');

		throw redirect(302, '/products');
	},

	delete: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, '/login');
		}

		const formData = await event.request.formData();
		const id = formData.get('id');

		if (!id || typeof id !== 'string') {
			return fail(400, {
				message: 'ID du produit requis',
				type: 'error'
			});
		}

		const productResponse = await ProductService.getProductById(id);
		const productName = productResponse.success ? productResponse.data.name : 'le produit';

		try {
			await ProductService.deleteProduct(id);
			FlashService.crud.deleted(event, productName);
		} catch {
			FlashService.crud.deleteError(event, productName);
			return fail(400, {
				message: `Erreur lors de la suppression de ${productName}`,
				type: 'error'
			});
		}

		throw redirect(302, '/products');
	}
};