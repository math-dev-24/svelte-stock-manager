import type {PageServerLoad, Actions} from './$types';
import {fail, redirect} from "@sveltejs/kit";
import {AuthService} from "$lib/services/auth.service";
import {FlashService} from "$lib/services";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

    return {};
};

export const actions: Actions = {
	changePassword: async (event) => {
		const formData = await event.request.formData();
		const password = formData.get('password');
		const newPassword = formData.get('newPassword');
		const confirmNewPassword = formData.get('confirmNewPassword');

		if (!event.locals.user) {
			return redirect(302, '/login');
		}


		if (!password || !newPassword || !confirmNewPassword || typeof password !== 'string' || typeof newPassword !== 'string' || typeof confirmNewPassword !== 'string') {
			return fail(400, {message: 'Missing password, newPassword or confirmNewPassword', type: 'error'});
		}

		if (password === newPassword) {
			return fail(400, {message: 'New password must be different from the current password', type: 'error'});
		}

		if (newPassword !== confirmNewPassword) {
			return fail(400, {message: 'Passwords do not match', type: 'error'});
		}

		const validity = AuthService.validatePasswordWithDetails(password);

		if (!validity.isValid) {
			return fail(400, {message: `${validity.errors.join(', ')}`, type: 'error'});
		}

		const response = await AuthService.updateProfile(event.locals.user.username, password , newPassword);

		if (!response.success) {
			return fail(400, {
				message: response.error?.message || 'Update profile failed',
				type: 'error'
			});
		}

		FlashService.success(event, 'Votre mot de passe a été modifié avec succès !');

		return redirect(302, '/logout');
	}
}