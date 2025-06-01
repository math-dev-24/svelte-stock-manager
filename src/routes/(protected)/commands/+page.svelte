<script lang="ts">
    import type {PageProps} from './$types';

    let { data }: PageProps = $props();

</script>

<section class="container mx-auto px-4 py-8 rounded border border-slate-200 bg-white shadow-sm">
    <h1 class="mb-2">Liste des commandes :</h1>

    {#if data.commands.length === 0}
        <p class="text-slate-600 mb-2">
            Vous n'avez pas encore ajouté de commande.
        </p>
        <a
                href="/commands/form"
                class="btn btn-primary w-full"
        >
            Ajouter une commande
        </a>
    {:else}
        <div class="grid grid-cols-3 gap-2">
            {#each data.commands as command (command.id)}
                <div>
                    <pre>{JSON.stringify(command, null, 2)}</pre>
                </div>
            {/each}
        </div>
    {/if}
</section>