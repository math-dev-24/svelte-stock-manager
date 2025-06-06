<script lang="ts">
    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { goto } from "$app/navigation";
    import { PencilIcon, TrashIcon } from "lucide-svelte";

    let {category} = $props();
</script>


<Card>
    <CardHeader>
        <CardTitle>{category.label}</CardTitle>
    </CardHeader>
    <CardContent>
        <p class="text-sm text-muted-foreground">Crée le {new Date(category.createdAt).toLocaleDateString()}</p>
    </CardContent>
    <CardFooter>
        <div class="flex items-center justify-between w-full gap-4">
            <Button variant="outline" class="w-full flex items-center gap-1" onclick={() => goto(`/categories/form?action=update&id=${category.id}`)}>
                <PencilIcon class="w-4 h-4" />
                Modifier
            </Button>
            <Button variant="destructive" class="w-full flex items-center gap-1" onclick={() => goto(`/categories/form?action=delete&id=${category.id}`)}>
                <TrashIcon class="w-4 h-4" />
                Supprimer
            </Button>
        </div>
    </CardFooter>
</Card>