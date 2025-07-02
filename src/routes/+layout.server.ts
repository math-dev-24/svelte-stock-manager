import type { LayoutServerLoad } from './$types';
import {FlashService} from "$lib/services";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	return {
		user: locals.user ?? null,
		session: locals.session ?? null,
		company: locals.company ?? null,
		flashMessage: FlashService.read(cookies)
	};
};