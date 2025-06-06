<script lang="ts">
    import type {PageProps} from './$types';
    import LogCard from '$lib/components/protected/log/log-card.svelte';
    import type {Log} from '$lib/server/db/schema';

    let {data}: PageProps = $props();

    const sort = (a: Log, b: Log) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

</script>

<section class="container mx-auto px-4 py-8 rounded border border-slate-200 bg-white shadow-sm">
    <h1 class="mb-2">Historique :</h1>

    {#if data.logs.length === 0}
        <p class="text-slate-600 mb-2">
            Aucun historique pour le moment.
        </p>
    {:else}
        <div class="flex flex-col gap-2">
            {#each data.logs.sort(sort) as log (log.id)}
                <LogCard {log} />
            {/each}
        </div>
    {/if}
</section>