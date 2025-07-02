<script>
  import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Label } from '$lib/components/ui/label';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '$lib/components/ui/select';
  import { enhance } from '$app/forms';
  import { Loader2 } from 'lucide-svelte';

    let { data, form } = $props();

    let inLoading = $state(false);
</script>

{#if data.mode === 'create'}
    <Card class="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Créer une commande</CardTitle>
        </CardHeader>
        <CardContent>
            <form 
                action="?/create" 
                method="POST" 
                class="space-y-4"
                use:enhance={() => {
                    inLoading = true;
                    return async ({update}) => {
                        await update();
                        inLoading = false;
                    }
                }}
            >
                <div class="space-y-4">
                    <div class="space-y-2">
                        <Label for="name">Nom <span class="text-destructive">*</span></Label>
                        <Input type="text" id="name" name="name" placeholder="Entrer le nom de la commande" required />
                    </div>
                    <div class="space-y-2">
                        <Label for="description">Description <span class="text-destructive">*</span></Label>
                        <Textarea id="description" name="description" placeholder="Entrer la description de la commande" required />
                    </div>
                    <div class="space-y-2">
                        <Label for="status">Statut <span class="text-destructive">*</span></Label>
                        <Select name="status" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un statut" />
                            </SelectTrigger>
                            <SelectContent>
                                {#each data.statuses || [] as status}
                                    <SelectItem value={status.id}>{status.label}</SelectItem>
                                {/each}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </form>
        </CardContent>
        <CardFooter>
            <Button type="submit" disabled={inLoading}>
                {#if inLoading}
                    <Loader2 class="w-4 h-4 animate-spin" />
                {:else}
                    Créer
                {/if}
            </Button>
        </CardFooter>
    </Card>
{:else if data.mode === 'update'}
    <h1>Modifier une commande</h1>
{:else if data.mode === 'delete'}
    <h1>Supprimer une commande</h1>
{/if}