<script lang="ts">
    import type {PageProps} from './$types';
    import ProductCard from "$lib/components/protected/product/product-card.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { PlusIcon } from "lucide-svelte";
    
    let { data }: PageProps = $props();

</script>
<section class="container mx-auto px-4 py-8 rounded border border-slate-200 bg-white shadow-sm">
    <h1 class="mb-2">Liste des produits :</h1>

    {#if data.products.length === 0}
        <p class="text-slate-600 mb-2">
            Vous n'avez pas encore ajouté de produit.
        </p>
        <Button
            variant="default"
            href="/products/form"
            class="w-full flex items-center gap-2"
        >
            <PlusIcon class="w-4 h-4" />
            Ajouter un produit
        </Button>
    {:else}
        <div class="grid grid-cols-3 gap-2">
            {#each data.products as product (product.id)}
                <ProductCard product={product}/>
            {/each}
        </div>
    {/if}
</section>