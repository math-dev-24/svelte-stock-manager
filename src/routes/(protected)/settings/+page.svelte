<script lang="ts">
    import type {PageProps} from './$types';

    let { data }: PageProps = $props();
</script>

<section class="container mx-auto px-4 py-8 rounded border border-slate-200 bg-white shadow-sm">
    <h1 class="mb-4">Paramètres :</h1>
    <div class="flex flex-col gap-4">
        <h2>Mes entreprises :</h2>
        {#if data.companies.length === 0}
            <p>
                Vous n'avez pas encore ajouté d'entreprise.
            </p>
            <a href="/companies/form" class="btn btn-primary">Ajouter une entreprise</a>
        {:else}
            {#each data.companies as company (company.id)}
                <div class="card">
                    <div class="card-body">
                        <h2 class="card-title">{company.name}</h2>
                        <p class="card-text">Email: {company.email}</p>
                        <p class="card-text">Téléphone: {company.phone}</p>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</section>