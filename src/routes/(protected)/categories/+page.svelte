<script lang="ts">
    import type {PageProps} from './$types';
    import CategoryCard from '$lib/components/protected/category/category-card.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import { PlusIcon } from 'lucide-svelte';
    let { data }: PageProps = $props();

</script>

<section class="container mx-auto px-4 py-8 rounded border border-slate-200 bg-white shadow-sm">
    <h1>listes des catégories :</h1>

    {#if data.categories.length === 0}
        <p class="text-slate-600 mb-2">
            Vous n'avez pas encore ajouté de catégorie.
        </p>
        <Button
            variant="default"
            href="/categories/form"
            class="w-full flex items-center gap-2"
        >
            <PlusIcon class="w-4 h-4" />
            Ajouter une catégorie
        </Button>
    {:else}
        <div class="grid grid-cols-3 gap-2">
            {#each data.categories as category (category.id)}
                <CategoryCard {category} />
            {/each}
        </div>
    {/if}
</section>