<script lang="ts">
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import { Loader2 } from "lucide-svelte";
    import { enhance } from "$app/forms";

    let { data, form } = $props();
    let inLoading = $state(false);
</script>


{#if data.mode === 'create'}
    <Card class="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Créer un statut</CardTitle>
        </CardHeader>
        <CardContent>
            <form action="?/create" method="POST" class="space-y-4" use:enhance={() => {
                inLoading = true;
                return async ({update}) => {
                    await update();
                    inLoading = false;
                }
            }}>
                <div class="space-y-2">
                    <Label for="label">Label</Label>
                    <Input id="label" name="label" required />
                </div>
                <Button type="submit" disabled={inLoading}>
                    {#if inLoading}
                        <Loader2 class="w-4 h-4 animate-spin" />
                    {:else}
                        Créer
                    {/if}
                </Button>
            </form>
        </CardContent>
    </Card>
{/if}

{#if data.mode === 'update'}
    <Card class="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Mettre à jour un statut</CardTitle>
        </CardHeader>
        <CardContent>
            <form action="?/update" method="POST" class="space-y-4" use:enhance={() => {
                inLoading = true;
                return async ({update}) => {
                    await update();
                    inLoading = false;
                }
            }}>
                <div class="space-y-2">
                    <Label for="label">Label</Label>
                    <Input id="label" name="label" required value={data.status?.label} />
                </div>
                <Button type="submit" disabled={inLoading}>
                    {#if inLoading}
                        <Loader2 class="w-4 h-4 animate-spin" />
                    {:else}
                        Mettre à jour
                    {/if}
                </Button>
            </form>
        </CardContent>
    </Card>
{/if}

{#if data.mode === 'delete'}
    <Card class="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Supprimer un statut</CardTitle>
        </CardHeader>
        <CardContent>
            <form action="?/delete" method="POST" class="space-y-4" use:enhance={() => {
                inLoading = true;
                return async ({update}) => {
                    await update();
                    inLoading = false;
                }
            }}>
                <div class="space-y-2">
                    <Label for="label">Label</Label>
                    <Input id="label" name="label" type="hidden" required value={data.status?.label} />
                </div>
                <Button type="submit" disabled={inLoading}>
                    {#if inLoading}
                        <Loader2 class="w-4 h-4 animate-spin" />
                    {:else}
                        Supprimer
                    {/if}
                </Button>
            </form>
        </CardContent>
    </Card>
{/if}

{#if data.flashMessage}
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-4 rounded-lg">
            <p>{data.flashMessage}</p>
        </div>
    </div>
{/if}