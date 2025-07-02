import { redirect } from "@sveltejs/kit";
import { CommandService } from "$lib/services/command.service";
import type { Actions } from "@sveltejs/kit";

export const load = async ({ locals, url }) => {
    const { user, selectedCompany } = locals;

    const query = url.searchParams.get('action');
    const id = url.searchParams.get('id');

    if (!user) {
        return redirect(303, '/login');
    }
    if (!selectedCompany) {
        return redirect(303, '/settings');
    }

    if (query === 'update' && id) {
        const status = await CommandService.getStatusById(id);

        if (status.success) {
            return {
                mode: 'update',
                status: status.data
            };
        }
    }

    if (query === 'delete' && id) {
        const status = await CommandService.getStatusById(id);

        if (status.success) {
            return {
                mode: 'delete',
                status: status.data
            };
        }
    }

    return {
        mode: 'create',
        status: null
    };
}

export const actions: Actions = {
    create: async (event) => {
        const { user, selectedCompany } = event.locals;

        if (!user) {
            return redirect(303, '/login');
        }
        if (!selectedCompany) {
            return redirect(303, '/settings');
        }

        const formData = await event.request.formData();

        const response = await CommandService.createStatus({
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            label: formData.get('label') as string,
            companyId: selectedCompany.id
        });

        if (response.success) {
            return redirect(303, '/status');
        }

        return {
            success: false,
            errorCode: response.errorCode,
            message: response.message
        };
    }
}