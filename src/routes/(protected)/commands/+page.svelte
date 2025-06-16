<script lang="ts">
    import type {PageProps} from './$types';
    import {Button} from "$lib/components/ui/button";
    import { PlusIcon } from "lucide-svelte";

    let { data }: PageProps = $props();

</script>

<section class="container mx-auto px-4 py-8 rounded border border-slate-200 bg-white shadow-sm">
    <h1 class="mb-2">Liste des commandes :</h1>

    {#if data.commands.length === 0}
        <p class="text-slate-600 mb-2">
            Vous n'avez pas encore ajouté de commande.
        </p>
        <Button
            class="btn btn-primary w-full flex items-center gap-2 w-1/4 mx-auto"
            href="/commands/form"
        >
            <PlusIcon class="w-4 h-4" />
            Ajouter une commande
        </Button>
    {:else}
        <div class="grid grid-cols-3 gap-2">
            {#each data.commands as command, index (index)}
                <div>
                    <pre>{JSON.stringify(command, null, 2)}</pre>
                </div>
            {/each}
        </div>
    {/if}
</section>