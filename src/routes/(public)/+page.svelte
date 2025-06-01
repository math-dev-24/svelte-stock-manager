<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>

<svelte:head>
    <title>Stock Manager - Gestion d'inventaire simplifiée</title>
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-blue-50 to-slate-100 py-20">
    <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold text-slate-800 mb-6">
            Gérez votre stock en toute <span class="text-blue-600">simplicité</span>
        </h1>
        <p class="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Stock Manager vous aide à optimiser votre inventaire, suivre vos produits et automatiser vos commandes pour maximiser votre efficacité.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            {#if data.user}
                <a href="/dashboard" class="btn btn-primary btn-lg">
                    Accéder au Dashboard
                </a>
            {:else}
                <a href="/register" class="btn btn-primary btn-lg">
                    Commencer gratuitement
                </a>
                <a href="/login" class="btn btn-secondary btn-lg">
                    Se connecter
                </a>
            {/if}
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="py-16 bg-white">
    <div class="container mx-auto px-4">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-slate-800 mb-4">
                Tout ce dont vous avez besoin
            </h2>
            <p class="text-lg text-slate-600">
                Des fonctionnalités complètes pour gérer votre inventaire efficacement
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center p-6">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="text-2xl">📦</span>
                </div>
                <h3 class="text-xl font-semibold text-slate-800 mb-3">Suivi en temps réel</h3>
                <p class="text-slate-600">
                    Surveillez vos niveaux de stock en temps réel et recevez des alertes automatiques.
                </p>
            </div>

            <div class="text-center p-6">
                <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="text-2xl">📊</span>
                </div>
                <h3 class="text-xl font-semibold text-slate-800 mb-3">Analytics avancées</h3>
                <p class="text-slate-600">
                    Analysez vos performances avec des rapports détaillés et des insights précieux.
                </p>
            </div>

            <div class="text-center p-6">
                <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="text-2xl">⚡</span>
                </div>
                <h3 class="text-xl font-semibold text-slate-800 mb-3">Automatisation</h3>
                <p class="text-slate-600">
                    Automatisez vos commandes et optimisez vos approvisionnements.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="py-16 bg-slate-50">
    <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-slate-800 mb-4">
            Prêt à optimiser votre inventaire ?
        </h2>
        <p class="text-lg text-slate-600 mb-8">
            Rejoignez des milliers d'entreprises qui font confiance à Stock Manager
        </p>
        {#if !data.user}
            <a href="/register" class="btn btn-primary btn-lg">
                Démarrer maintenant
            </a>
        {/if}
    </div>
</section>