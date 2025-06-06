<script lang="ts">
    import type {PageProps} from './$types';
    import CategoryCard from '$lib/components/protected/category/category-card.svelte';

    let { data }: PageProps = $props();

</script>

<section class="container mx-auto px-4 py-8 rounded border border-slate-200 bg-white shadow-sm">
    <h1 class="mb-2">listes des catégories :</h1>

    {#if data.categories.length === 0}
        <p class="text-slate-600 mb-2">
            Vous n'avez pas encore ajouté de catégorie.
        </p>
        <a
                href="/categories/form"
                class="btn btn-primary w-full"
        >
            Ajouter une catégorie
        </a>
    {:else}
        <div class="grid grid-cols-3 gap-2">
            {#each data.categories as category (category.id)}
                <CategoryCard {category} />
            {/each}
        </div>
    {/if}
</section>