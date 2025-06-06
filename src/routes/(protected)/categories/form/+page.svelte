<script>
    import { goto } from '$app/navigation';
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Label } from "$lib/components/ui/label";
    import { Alert, AlertDescription } from "$lib/components/ui/alert";
    import { AlertTriangle } from "lucide-svelte";
    
    let { data } = $props();

    const handleCancel = () => {
        goto('/categories');
    }
</script>

{#if data.mode === 'create'}
    <Card class="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Créer une catégorie</CardTitle>
        </CardHeader>
        <form method="POST" action="?/create">
            <CardContent>
                <div class="space-y-4">
                    <div class="space-y-2">
                        <Label for="name">Nom <span class="text-destructive">*</span></Label>
                        <Input type="text" id="name" name="name" placeholder="Entrer le nom de la catégorie" required />
                    </div>
                </div>
            </CardContent>
            <CardFooter class="flex justify-end space-x-2">
                <Button type="submit" variant="default">Créer</Button>
                <Button type="button" variant="outline" on:click={handleCancel}>Annuler</Button>
            </CardFooter>
        </form>
    </Card>
{:else if data.mode === 'update' && data.category}
    <Card class="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Modifier la catégorie</CardTitle>
        </CardHeader>
        <form method="POST" action="?/update">
            <input type="hidden" name="id" value={data.category.id} />
            <CardContent>
                <div class="space-y-4">
                    <div class="space-y-2">
                        <Label for="name">Nom <span class="text-destructive">*</span></Label>
                        <Input type="text" id="name" name="name" value={data.category.label} required />
                    </div>
                </div>
            </CardContent>
            <CardFooter class="flex justify-end space-x-2">
                <Button type="submit" variant="default">Mettre à jour</Button>
                <Button type="button" variant="outline" on:click={handleCancel}>Annuler</Button>
            </CardFooter>
        </form>
    </Card>
{:else if data.mode === 'delete' && data.category}
    <Card class="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Supprimer la catégorie</CardTitle>
        </CardHeader>
        <form method="POST" action="?/delete">
            <CardContent>
                <Alert variant="destructive" class="mb-4">
                    <AlertTriangle class="h-4 w-4" />
                    <AlertDescription>
                        Êtes-vous sûr de vouloir supprimer la catégorie "{data.category.label}"? Cette action est irréversible.
                    </AlertDescription>
                </Alert>
                <input type="hidden" name="id" value={data.category.id} />
            </CardContent>
            <CardFooter class="flex justify-end space-x-2">
                <Button type="submit" variant="destructive">Supprimer</Button>
                <Button type="button" variant="outline" on:click={handleCancel}>Annuler</Button>
            </CardFooter>
        </form>
    </Card>
{/if}