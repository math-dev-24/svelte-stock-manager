import type {PageServerLoad} from './$types';
import {CompanyService} from "$lib/services";
import {redirect, type Actions} from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {

	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const companies = await CompanyService.getCompaniesByUserId(locals.user.id);

	if (!companies.success) {
		throw redirect(302, '/dashboard');
	}

	return {
		companies: companies.data || []
	};
};

export const actions: Actions = {
	updateSelectedCompany: async (event) => {
		if (!event.locals.user) {
			return redirect(302, '/login');
		}

		const formData = await event.request.formData();
		const companyId = formData.get('companyId') as string;

		if (!companyId) {
			return {
				success: false,
				message: "ID de l'entreprise requis"
			};
		}

		const response = await CompanyService.updateSelectedCompany(companyId, event.locals.user.id, event);

		if (!response.success) {
			return {
				success: false,
				message: response.message
			};
		}

		event.locals.selectedCompany = response.data;
		
		event.cookies.set('selectedCompany', JSON.stringify(response.data), {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 // 7 jours
		});
		
		return {
			success: true,
			message: "Entreprise sélectionnée mise à jour avec succès"
		};
	}
};