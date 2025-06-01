import type {PageServerLoad} from './$types';
import {type Actions, fail, redirect} from "@sveltejs/kit";
import {CompanyService} from "$lib/services";


export const load: PageServerLoad = async (event) => {

    if (!event.locals.user) {
        throw redirect(302, '/login');
    }

	const companies = await CompanyService.getCompaniesByUserId(event.locals.user.id);

	if (!companies.success) {
		throw redirect(302, '/dashboard');
	}

    const paramsType = event.url.searchParams.get('type');
    const paramsId = event.url.searchParams.get('id');

    return {
		companies: companies.data || [],
        mode: paramsType,
        company: (paramsType === 'update' && typeof paramsId === 'string') ? await CompanyService.getCompanyByIdAndByUserId(paramsId, event.locals.user.id) : null
	};
};

export const actions: Actions = {
    create: async (event) => {
        const formData = await event.request.formData();
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');

        if (!event.locals.user) {
            return redirect(302, '/login');
        }

        if (!name || !email || !phone || typeof name !== 'string' || typeof email !== 'string' || typeof phone !== 'string') {
            return fail(400, { message: 'Missing name, email or phone', type: 'error' });
        }

        const response = await CompanyService.createCompany(event.locals.user.id, {name, email, phone});

        if (!response.success) {
            return fail(400, {
                message: response.errorCode === 'VALIDATION_ERROR' ? 'Validation error' : response.message,
                type: 'error'
            });
        }

        return redirect(302, '/settings');
    }
};