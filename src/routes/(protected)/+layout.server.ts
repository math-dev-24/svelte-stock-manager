import { CompanyService } from '$lib/services';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const company = await CompanyService.getCompaniesByUserId(locals.user.id);

    if (company.success) {
        locals.company = company.data;
        if (!locals.selectedCompany && company.data.length > 0) {
            locals.selectedCompany = company.data[0];
        }
    }

    return {
        user: locals.user,
        company: locals.company,
        selectedCompany: locals.selectedCompany
    };
};