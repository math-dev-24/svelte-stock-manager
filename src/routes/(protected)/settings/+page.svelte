<script lang="ts">
    import type {PageProps} from './$types';
    import {Button} from "$lib/components/ui/button";
    import {PencilIcon, PlusIcon} from "lucide-svelte";
    import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "$lib/components/ui/card";
    import {Alert} from "$lib/components/ui/alert";

    
    let { data }: PageProps = $props();
</script>

<section class="container mx-auto px-4 py-8 rounded border border-slate-200 bg-white shadow-sm">
    <h1 class="mb-4 text-2xl font-bold">Paramètres :</h1>
    <div class="flex flex-col gap-4">
        <h2 class="text-lg font-bold">Mes entreprises :</h2>
        {#if data.companies.length === 0}
            <p>
                Vous n'avez pas encore ajouté d'entreprise.
            </p>
            <Button href="/companies/form" variant="outline">
                <PlusIcon class="w-4 h-4 mr-2" />
                Ajouter une entreprise
            </Button>
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
    </div>
</section>