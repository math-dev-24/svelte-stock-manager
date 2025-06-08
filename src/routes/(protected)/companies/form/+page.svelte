<script lang="ts">
    import type {PageProps} from './$types';
    import {page} from "$app/state";
    import {Card, CardContent, CardHeader, CardTitle, CardFooter} from "$lib/components/ui/card";
    import { Alert } from '$lib/components/ui/alert';
    import {Button} from "$lib/components/ui/button";
    import {Input} from "$lib/components/ui/input";
    import {Label} from "$lib/components/ui/label";
    import {enhance} from "$app/forms";

    let { data, form }: PageProps = $props();


    let isLoading = $state(false);
    const isUpdateMode = $derived(page.url.searchParams.get('type') === 'update' && data.company);
    const formTitle = $derived(isUpdateMode ? 'Modifier l\'entreprise :' : 'Nouveau l\'entreprise :');
    const submitButtonText = $derived(isUpdateMode ? 'Mettre à jour' : 'Créer l\'entreprise');

</script>

<Card>
    <CardHeader>
        <CardTitle>
            {formTitle}
        </CardTitle>
    </CardHeader>
    <CardContent>
        <form
            class="space-y-6"
            method="POST"
            action={isUpdateMode ? '?/update' : '?/create'}
            use:enhance={() => {
                isLoading = true;
                return async ({update}) => {
                    await update();
                    isLoading = false;
                }
            }}
    >

        <div class="form-group">
            <Label for="name">Nom de l'entreprise <span class="text-red-500">*</span></Label>
            <Input
                    type="text"
                    id="name"
                    name="name"
                    required
            />
        </div>

        <div class="form-group">
            <Label for="email">Email <span class="text-red-500">*</span></Label>
            <Input
                    type="email"
                    id="email"
                    name="email"
                    required
            />
        </div>

        <div class="form-group">
            <Label for="phone">Téléphone <span class="text-red-500">*</span></Label>
            <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
            />
        </div>

        <Button
            type="submit"
            disabled={isLoading}
        >
            {isLoading ? 'En cours...' : submitButtonText}
        </Button>

    </form>
    </CardContent>
    <CardFooter>
        {#if form?.message}
            <Alert variant="destructive">{form.message}</Alert>
        {/if}
    </CardFooter>
</Card>