import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';

export const actions: Actions = {
    default: async (event) => {
        if (!event.locals.session) {
            return redirect(302, '/login');
        }
        await auth.invalidateSession(event.locals.session.id);
        auth.deleteSessionTokenCookie(event);
        return redirect(302, '/login');
    }
};