<script lang="ts">
    import type {PageProps} from './$types';
    import {Button} from "$lib/components/ui/button";
    import {PencilIcon, PlusIcon} from "lucide-svelte";
    import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "$lib/components/ui/card";
    import {enhance} from "$app/forms";
    
    let { data }: PageProps = $props();
    let isLoading = $state(false);
    let selectedCompanyId = $state(data.selectedCompany?.id || '');
</script>

<section class="container mx-auto px-4 py-8 rounded border border-slate-200 bg-white shadow-sm">
    <h1 class="mb-4 text-2xl font-bold">Paramètres :</h1>
    <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
            <h2 class="text-lg font-bold">Entreprise active :</h2>
            <form
                method="POST"
                action="?/updateSelectedCompany"
                use:enhance={() => {
                    isLoading = true;
                    return async ({update}) => {
                        await update();
                        isLoading = false;
                    }
                }}
            >
                <div class="flex items-center gap-2">
                    <select
                        name="companyId"
                        bind:value={selectedCompanyId}
                        class="w-[300px] h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        {#each data.companies as company}
                            <option value={company.id}>
                                {company.name}
                            </option>
                        {/each}
                    </select>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Chargement...' : 'Changer'}
                    </Button>
                </div>
            </form>
        </div>

        <h2 class="text-lg font-bold">Mes entreprises :</h2>
        {#if data.companies.length === 0}
            <p>
                Vous n'avez pas encore ajouté d'entreprise.
            </p>
        {:else}
            {#each data.companies as company (company.id)}
                <Card>
                    <CardHeader>
                        <CardTitle>{company.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Email: {company.email}</p>
                        <p>Téléphone: {company.phone}</p>
                    </CardContent>
                    <CardFooter>
                        <Button href={`/companies/${company.id}`} variant="outline">
                            <PencilIcon class="w-4 h-4 mr-2" />
                            Modifier
                        </Button>
                    </CardFooter>
                </Card>
            {/each}
        {/if}
        <Button href="/companies/form">
            <PlusIcon class="w-4 h-4 mr-2" />
            Ajouter une entreprise
        </Button>
    </div>
</section>