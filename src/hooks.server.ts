import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import type { Company } from '$lib/server/db/schema';

const handleAuth: Handle = async ({ event, resolve }) => {

    const sessionToken = event.cookies.get(auth.sessionCookieName);

    if (!sessionToken) {
        event.locals.user = null;
        event.locals.session = null;
        event.locals.selectedCompany = null;
        return resolve(event);
    }

    const { session, user } = await auth.validateSessionToken(sessionToken);


    if (session) {
        auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
    } else {
        auth.deleteSessionTokenCookie(event);
    }

    event.locals.user = user;   
    event.locals.session = session;

    const selectedCompanyCookie = event.cookies.get('selectedCompany');
    
    if (selectedCompanyCookie) {
        try {
            event.locals.selectedCompany = JSON.parse(selectedCompanyCookie) as Company;
        } catch {
            event.locals.selectedCompany = null;
        }
    }

    return resolve(event);
};

export const handle: Handle = handleAuth;