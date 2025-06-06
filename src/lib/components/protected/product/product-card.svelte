<script lang="ts">
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { PencilIcon, TrashIcon } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import { Badge } from "$lib/components/ui/badge";

    let {product} = $props();
</script>

<Card>
    <CardHeader>
        <CardTitle>{product.name}</CardTitle>
    </CardHeader>
    <CardContent>
        <p class="text-sm text-muted-foreground">SKU: {product.sku}</p>
        <p class="text-sm text-muted-foreground">Stock minimum: {product.minStock}</p>
        
        {#if product.categories && product.categories.length > 0}
            <div class="flex flex-wrap gap-2 mt-2">
                {#each product.categories as category}
                    <Badge class="text-xs">{category.label}</Badge>
                {/each}
            </div>
        {/if}

        <div class="grid grid-cols-2 gap-2 mt-2">
            <Button
                variant="outline"
                color="success"
                class="w-full flex items-center gap-1"
                onclick={() => goto(`/products/form?type=update&id=${product.id}`)}
            >
                <PencilIcon class="w-4 h-4" />
                Modifier
            </Button>
            <Button
                variant="destructive"
                class="w-full flex items-center gap-1"
                onclick={() => goto(`/products/form?type=delete&id=${product.id}`)}
            >
                <TrashIcon class="w-4 h-4" />
                Supprimer
            </Button>
        </div>
    </CardContent>
</Card>