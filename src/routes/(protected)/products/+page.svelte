<script lang="ts">
    import type {PageProps} from './$types';
    import ProductCard from "$lib/components/protected/product/product-card.svelte";

    let { data }: PageProps = $props();

</script>

<section class="container mx-auto px-4 py-8 rounded border border-slate-200 bg-white shadow-sm">
    <h1 class="mb-2">listes des produits :</h1>

    {#if data.products.length === 0}
        <p class="text-slate-600 mb-2">
            Vous n'avez pas encore ajouté de produit.
        </p>
        <a
                href="/products/form"
                class="btn btn-primary w-full"
        >
            Ajouter un produit
        </a>
    {:else}
        <div class="grid grid-cols-3 gap-2">
            {#each data.products as product (product.id)}
                <ProductCard product={product}/>
            {/each}
        </div>
    {/if}
</section>