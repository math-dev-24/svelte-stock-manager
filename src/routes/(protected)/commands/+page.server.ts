import type {PageServerLoad} from './$types';
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	return {
		commands: []
	}
};