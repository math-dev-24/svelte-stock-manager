<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();

    const stats = [
        { label: 'Produits en stock', value: data.productsCount },
        { label: 'Entreprises', value: data.companiesCount },
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
    <h1 class="text-2xl font-bold text-slate-800 mb-2">
        Bonjour, {data.user?.username} 👋
    </h1>
</div>

<!-- Statistiques principales -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {#each stats as stat (stat.label)}
        <div class="card">
            <div class="card-body">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-slate-600 mb-1">{stat.label}</p>
                        <p class="text-2xl font-bold text-slate-800">{stat.value}</p>
                    </div>
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        {#if stat.label.includes('Produits')}
                            <span class="text-xl">📦</span>
                        {:else if stat.label.includes('Commandes')}
                            <span class="text-xl">📋</span>
                        {:else if stat.label.includes('Entreprises')}
                            <span class="text-xl">🏢</span>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
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
    <div>
        <div class="card">
            <div class="card-header">
                <h3 class="text-lg font-semibold text-slate-800">Activité récente</h3>
            </div>
            <div class="card-body p-0">
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
            </div>
        </div>
    </div>
</div>

<!-- Actions rapides -->
<div class="mt-8">
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-semibold text-slate-800">Actions rapides</h3>
        </div>
        <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <a href="/products/form" class="btn btn-primary">
                    <span class="mr-2">➕</span>
                    Ajouter un produit
                </a>
                <a href="/commands/form" class="btn btn-warning">
                    <span class="mr-2">📋</span>
                    Nouvelle commande
                </a>
                <a href="/inventory" class="btn btn-secondary">
                    <span class="mr-2">📦</span>
                    Voir le stock
                </a>
                <a href="/reports" class="btn btn-success">
                    <span class="mr-2">📊</span>
                    Rapports
                </a>
            </div>
        </div>
    </div>
</div>