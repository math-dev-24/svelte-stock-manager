import type {PageServerLoad} from './$types';
import {CommandService} from "$lib/services";
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	return {
		commands: (await CommandService.getCommandsByUserId(event.locals.user.id)).data
	}
};