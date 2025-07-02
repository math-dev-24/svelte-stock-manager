<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Plus } from "lucide-svelte";

    let { data } = $props();
</script>

<div class="flex flex-col gap-4">
    <h1 class="text-2xl font-bold">Statuts</h1>
    {#if data.statuses.length === 0}
        <p class="text-sm text-gray-500">Aucun statut trouvé</p>
    {:else}
    <div class="flex flex-col gap-4">
        {#each data.statuses as status}
            <div class="flex flex-col gap-2">
                <h2 class="text-lg font-bold">{status.label}</h2>
            </div>
        {/each}
    </div>
    {/if}
    <Button href="/status/form?action=create">
        <Plus class="w-4 h-4" />
        Créer un statut
    </Button>
</div>