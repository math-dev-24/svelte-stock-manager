import { CompanyService } from "$lib/services/company.service";
import { FlashService } from "$lib/services/flash.service";
import { redirect, type Actions } from "@sveltejs/kit";

export const load = async (event) => {

    if (!event.locals.user) {
        return redirect(302, '/login');
    }

    const { id } = event.params;

    const company = await CompanyService.getCompanyByIdAndByUserId(id, event.locals.user.id);

    if (!company.success || !company.data) {
        return redirect(302, '/companies');
    }

    return { company: company.data };
};

export const actions: Actions = {
    updateTitle: async (event) => {
        const { id } = event.params;

        if (!id) {
            FlashService.error(event, "ID de l'entreprise requis");
            return {
                success: false,
                message: "ID de l'entreprise requis"
            }
        }

        const formData = await event.request.formData();

        const title = formData.get('title') as string;

        const company = await CompanyService.updateCompanyTitle(id, title);

        if (!company.success || !company.data) {
            FlashService.error(event, "Erreur lors de la mise à jour du titre");
            return {
                success: false,
                message: "Erreur lors de la mise à jour du titre"
            }
        }

        FlashService.success(event, "Titre mis à jour avec succès");

        return {
            success: true,
            message: "Titre mis à jour avec succès"
        }
    }
}