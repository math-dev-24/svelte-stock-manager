<script lang="ts">
    import type {PageProps} from './$types';
    import {page} from "$app/state";
    import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Textarea } from "$lib/components/ui/textarea";
    import { Label } from "$lib/components/ui/label";
    import { Alert, AlertDescription } from "$lib/components/ui/alert";
    import { AlertTriangle, Loader2 } from "lucide-svelte";
    import { enhance } from '$app/forms';
    let { data, form }: PageProps = $props();

    const isUpdateMode = $derived(page.url.searchParams.get('type') === 'update' && data.product);
    const formTitle = $derived(isUpdateMode ? 'Modifier le produit' : 'Nouveau produit');
    const submitButtonText = $derived(isUpdateMode ? 'Mettre à jour' : 'Créer');

    // État réactif pour les valeurs du formulaire
    let formValues = $state({
        name: data.product?.name || '',
        sku: data.product?.sku || '',
        description: data.product?.description || '',
        minStock: data.product?.minStock || 0,
        categories: data.productCategories?.map(c => c.id) || []
    });

    let inLoading = $state(false);
</script>

{#if data.mode === 'delete'}
    <Card class="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Vous allez supprimer le produit suivant :</CardTitle>
        </CardHeader>
        <CardContent>
            <p class="text-muted-foreground mb-4">
                Voulez-vous vraiment supprimer le produit suivant <b>"{data.product.name}"</b> ?
            </p>
        </CardContent>
        <CardFooter>
            <form
                class="w-full"
                method="POST"
                action="?/delete"
                use:enhance={() => {
                    inLoading = true;
                    return async ({update}) => {
                        await update();
                        inLoading = false;
                    }
                }}
            >
                <input type="hidden" name="id" id="id" value={data.product.id} />
                <Button variant="destructive" type="submit" class="w-full" disabled={inLoading}>
                    {#if inLoading}
                        <Loader2 class="w-4 h-4 animate-spin" />
                    {:else}
                        Supprimer
                    {/if}
                </Button>
            </form>
        </CardFooter>
    </Card>
{:else}
    <Card class="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>{formTitle}</CardTitle>
        </CardHeader>
        <CardContent>
            <form
                class="space-y-6"
                method="POST"
                action={isUpdateMode ? '?/update' : '?/create'}
                use:enhance={() => {
                    inLoading = true;
                    return async ({update}) => {
                        await update();
                        inLoading = false;
                    }
                }}
            >
                {#if data.product}
                    <input type="hidden" name="id" id="id" value={data.product.id} />
                {/if}

                {#if form?.message}
                    <Alert variant="destructive">
                        <AlertTriangle class="h-4 w-4" />
                        <AlertDescription>{form.message}</AlertDescription>
                    </Alert>
                {/if}

                <div class="space-y-2">
                    <Label for="name">Nom du produit <span class="text-destructive">*</span></Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        required
                        bind:value={formValues.name}
                    />
                </div>

                <div class="space-y-2">
                    <Label for="sku">SKU <span class="text-destructive">*</span></Label>
                    <Input
                        type="text"
                        id="sku"
                        name="sku"
                        required
                        bind:value={formValues.sku}
                    />
                </div>

                <div class="space-y-2">
                    <Label for="description">Description <span class="text-destructive">*</span></Label>
                    <Textarea
                        id="description"
                        name="description"
                        required
                        bind:value={formValues.description}
                    />
                </div>

                <div class="space-y-2">
                    <Label for="minStock">Stock minimum <span class="text-destructive">*</span></Label>
                    <Input
                        type="number"
                        id="minStock"
                        name="minStock"
                        required
                        bind:value={formValues.minStock}
                    />
                </div>

                <div class="space-y-2">
                    <Label for="categories">Catégories</Label>
                    <select
                        id="categories"
                        name="categories"
                        multiple
                        bind:value={formValues.categories}
                        class="border-input bg-background ring-offset-background min-h-[200px] focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {#each data.categories as category}
                            <option value={category.id}>{category.label}</option>
                        {/each}
                    </select>
                    <p class="text-sm text-muted-foreground">
                        Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs catégories
                    </p>
                </div>

                <Button type="submit" class="w-full" disabled={inLoading}>
                    {#if inLoading}
                        <Loader2 class="w-4 h-4 animate-spin" />
                    {:else}
                        {submitButtonText}
                    {/if}
                </Button>
            </form>
        </CardContent>
    </Card>
{/if}