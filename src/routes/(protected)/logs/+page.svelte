<script lang="ts">
    import type {PageProps} from './$types';

    let {data}: PageProps = $props();
</script>

<section class="container mx-auto px-4 py-8 rounded border border-slate-200 bg-white shadow-sm">
    <h1 class="mb-2">Historique :</h1>

    {#if data.logs.length === 0}
        <p class="text-slate-600 mb-2">
            Aucun historique pour le moment.
        </p>
    {:else}
        <div class="grid grid-cols-3 gap-2">
            {#each data.logs as log (log.id)}
                <div>
                    <pre>{JSON.stringify(log, null, 2)}</pre>
                </div>
            {/each}
        </div>
    {/if}
</section>