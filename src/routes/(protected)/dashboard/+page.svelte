<script lang="ts">
    import type { PageProps } from './$types';
    import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
    import { HomeIcon, PlusIcon, BoxIcon } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    
    let { data }: PageProps = $props();

    const stats = [
        { label: 'Produits', value: data.productsCount },
        { label: 'Entreprises', value: data.companiesCount },
        { label: 'Catégories', value: data.categoriesCount },
        {label: "Commandes", value: data.commandsCount },
    ];

    const recentActivities = [
        { type: 'stock', message: 'Stock mis à jour pour "iPhone 15"', time: 'Il y a 5 min' },
        { type: 'order', message: 'Nouvelle commande #CMD-2025-001', time: 'Il y a 12 min' },
        { type: 'alert', message: 'Stock faible: Samsung Galaxy S24', time: 'Il y a 1h' },
        { type: 'stock', message: 'Réapprovisionnement MacBook Pro', time: 'Il y a 2h' },
    ];

</script>

<svelte:head>
    <title>Dashboard - Stock Manager</title>
</svelte:head>

<div class="mb-8">
    <h1 class="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
        <HomeIcon class="w-6 h-6 mr-2" />
        Bonjour, {data.user?.username} 👋
    </h1>
</div>

<!-- Statistiques principales -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {#each stats as stat (stat.label)}
        <Card>
            <CardHeader>
                <CardTitle class="flex items-center gap-2">
                    <span class="text-xl">
                        {#if stat.label.includes('Produits')}
                            <span class="text-xl">📦</span>
                        {:else if stat.label.includes('Commandes')}
                            <span class="text-xl">📋</span>
                        {:else if stat.label.includes('Entreprises')}
                            <span class="text-xl">🏢</span>
                        {:else if stat.label.includes('Catégories')}
                            <span class="text-xl">🔖</span>
                        {/if}
                    </span>
                    {stat.label}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p class="text-2xl font-bold text-slate-800">{stat.value}</p>
            </CardContent>
        </Card>
    {/each}
</div>

<!-- Contenu principal du dashboard -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Graphique des ventes (placeholder) -->
    <div class="lg:col-span-2">
        <div class="card">
            <div class="card-header">
                <h3 class="text-lg font-semibold text-slate-800">Évolution du stock</h3>
            </div>
            <div class="card-body">
                <!-- Placeholder pour un graphique -->
                <div class="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                    <p class="text-slate-500">📊 Graphique des tendances de stock</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Activités récentes -->
    <Card>
        <CardHeader>
            <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="space-y-0">
                {#each recentActivities as activity (activity.message)}
                    <div class="p-4 border-b border-slate-100 last:border-b-0">
                        <div class="flex items-start space-x-3">
                            <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm text-slate-800">{activity.message}</p>
                                <p class="text-xs text-slate-500 mt-1">{activity.time}</p>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </CardContent>
    </Card>
</div>

<!-- Actions rapides -->
<div class="mt-8">
    <Card>
        <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button href="/products/form" variant="outline" class="w-full flex gap-1 items-center text-blue-500 hover:text-blue-600 hover:bg-blue-50 border-blue-500">
                    <PlusIcon class="w-4 h-4" />
                    Ajouter un produit
                </Button>
                <Button href="/commands/form" variant="outline" class="w-full flex gap-1 items-center text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 border-emerald-500">
                    <PlusIcon class="w-4 h-4" />
                    Nouvelle commande
                </Button>
                <Button href="/inventory" variant="outline" class="w-full flex gap-1 items-center text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 border-yellow-500">
                    <BoxIcon class="w-4 h-4" />
                    Voir le stock
                </Button>
                <Button href="/reports" variant="outline" class="w-full flex gap-1 items-center text-red-500 hover:text-red-600 hover:bg-red-50 border-red-500">
                    <PlusIcon class="w-4 h-4" />
                    Rapports
                </Button>
            </div>
        </CardContent>
    </Card>
</div>