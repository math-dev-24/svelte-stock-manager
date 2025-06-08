<script lang="ts">
    import type {PageProps} from './$types';
    import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "$lib/components/ui/card";
    import TitleEdit from "$lib/components/protected/company/title-edit.svelte";
    import {Alert, AlertTitle} from "$lib/components/ui/alert";
    import { AlertCircle } from 'lucide-svelte';
    
    let { data }: PageProps = $props();
</script>

{#if data.flashMessage}
    <Alert variant="destructive" class="my-4 flex items-center gap-2">
        <AlertCircle />
        <AlertTitle>{data.flashMessage.message}</AlertTitle>
    </Alert>
{/if}

<Card class="p-4 w-full">
    <CardHeader>
        <CardTitle class="text-2xl font-bold">
            <TitleEdit title={data.company.name} />
        </CardTitle>
    </CardHeader>
    <CardContent>
        <p class="text-sm text-gray-500">Email: {data.company.email}</p>
        <p class="text-sm text-gray-500">Téléphone: {data.company.phone}</p>
        <p class="text-sm text-gray-500">Créé le: {new Date(data.company.createdAt).toLocaleDateString('fr-FR')}</p>
    </CardContent>
    <CardFooter class="flex flex-col items-start gap-2">
        <h2 class="text-lg font-bold"> {data.company.userCompanies.length} utilisateur{data.company.userCompanies.length > 1 ? 's' : ''} :</h2>
        <ul class="list-disc list-inside">
            {#each data.company.userCompanies as user}
                <li>{user.user.username}</li>
            {/each}
        </ul>
    </CardFooter>
</Card>

