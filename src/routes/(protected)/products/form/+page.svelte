<script lang="ts">
    import type {PageProps} from './$types';
    import {page} from "$app/state";
    import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Textarea } from "$lib/components/ui/textarea";
    import { Label } from "$lib/components/ui/label";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "$lib/components/ui/select";

    let { data }: PageProps = $props();

    const isUpdateMode = $derived(page.url.searchParams.get('type') === 'update' && data.product);
    const formTitle = $derived(isUpdateMode ? 'Modifier le produit' : 'Nouveau produit');
    const submitButtonText = $derived(isUpdateMode ? 'Mettre à jour' : 'Créer');

    const defaultValues = $derived({
        name: data.product?.name || '',
        sku: data.product?.sku || '',
        description: data.product?.description || '',
        minStock: data.product?.minStock || 0,
        categories: data.productCategories?.map(c => c.id) || []
    });
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
            >
                <input type="hidden" name="id" id="id" value={data.product.id} />
                <Button variant="destructive" type="submit" class="w-full">
                    Supprimer
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
            >
                {#if data.product}
                    <input type="hidden" name="id" id="id" value={data.product.id} />
                {/if}

                <div class="space-y-2">
                    <Label for="name">Nom du produit <span class="text-destructive">*</span></Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        required
                        bind:value={defaultValues.name}
                    />
                </div>

                <div class="space-y-2">
                    <Label for="sku">SKU <span class="text-destructive">*</span></Label>
                    <Input
                        type="text"
                        id="sku"
                        name="sku"
                        required
                        bind:value={defaultValues.sku}
                    />
                </div>

                <div class="space-y-2">
                    <Label for="description">Description <span class="text-destructive">*</span></Label>
                    <Textarea
                        id="description"
                        name="description"
                        required
                        bind:value={defaultValues.description}
                    />
                </div>

                <div class="space-y-2">
                    <Label for="minStock">Stock minimum <span class="text-destructive">*</span></Label>
                    <Input
                        type="number"
                        id="minStock"
                        name="minStock"
                        required
                        bind:value={defaultValues.minStock}
                    />
                </div>

                <div class="space-y-2">
                    <Label for="categories">Catégories</Label>
                    <Select
                        id="categories"
                        name="categories"
                        multiple
                        bind:value={defaultValues.categories}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner des catégories" />
                        </SelectTrigger>
                        <SelectContent>
                            {#each data.categories as category}
                                <SelectItem value={category.id}>{category.label}</SelectItem>
                            {/each}
                        </SelectContent>
                    </Select>
                </div>

                <Button type="submit" class="w-full">
                    {submitButtonText}
                </Button>
            </form>
        </CardContent>
    </Card>
{/if}