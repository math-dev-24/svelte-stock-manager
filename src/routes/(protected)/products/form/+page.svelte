<script lang="ts">
    import type {PageProps} from './$types';
    import {page} from "$app/state";

    let { data }: PageProps = $props();

    const isUpdateMode = $derived(page.url.searchParams.get('type') === 'update' && data.product);
    const formTitle = $derived(isUpdateMode ? 'Modifier le produit' : 'Nouveau produit');
    const submitButtonText = $derived(isUpdateMode ? 'Mettre à jour' : 'Créer');

    const defaultValues = $derived({
        name: data.product?.name || '',
        sku: data.product?.sku || '',
        description: data.product?.description || '',
        minStock: data.product?.minStock || 0
    });

</script>


{#if data.mode === 'delete'}
    <section class="container mx-auto px-4 py-8 max-w-2xl rounded border border-slate-200 bg-white shadow-sm">
        <h1 class="text-2xl font-bold text-slate-800 mb-6">
            Suppression du produit :
        </h1>

        <p class="text-slate-600 mb-1">
            Voulez-vous vraiment supprimer le produit suivant <b>"{data.product.name}"</b> ?
        </p>

        <form
                class="space-y-6"
                method="POST"
                action="?/delete"
        >
            <input type="hidden" name="id" id="id" value={data.product.id} />
            <button
                    class="btn btn-danger w-full"
            >
                Supprimer
            </button>
        </form>
    </section>
{:else}

    <section class="container mx-auto px-4 py-8 max-w-2xl rounded border border-slate-200 bg-white shadow-sm">
        <h1 class="text-2xl font-bold text-slate-800 mb-6">
            {formTitle} :
        </h1>

        <form
                class="space-y-6"
                method="POST"
                action={isUpdateMode ? '?/update' : '?/create'}
        >

            {#if data.product}
                <input type="hidden" name="id" id="id" value={data.product.id} />
            {/if}

            <div class="form-group">
                <label for="name">Nom du produit <span class="text-red-500">*</span></label>
                <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        bind:value={defaultValues.name}
                />
            </div>

            <div class="form-group">
                <label for="sku">SKU <span class="text-red-500">*</span></label>
                <input
                        type="text"
                        id="sku"
                        name="sku"
                        required
                        bind:value={defaultValues.sku}
                />
            </div>

            <div class="form-group">
                <label for="description">Description <span class="text-red-500">*</span></label>
                <textarea
                        id="description"
                        name="description"
                        required
                        bind:value={defaultValues.description}
                ></textarea>
            </div>

            <div class="form-group">
                <label for="minStock">Stock minimum <span class="text-red-500">*</span></label>
                <input
                        type="number"
                        id="minStock"
                        name="minStock"
                        required
                        bind:value={defaultValues.minStock}
                />
            </div>

            <button
                    class="btn btn-primary w-full"
            >
                {submitButtonText}
            </button>

        </form>
    </section>
{/if}