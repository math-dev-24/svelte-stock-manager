<script lang="ts">
    import type { LayoutProps } from './$types';
    import { Button } from "$lib/components/ui/button";

    let {children, data}: LayoutProps = $props();
</script>

<svelte:head>
    <title>Stock Fast - Gestion d'inventaire simplifiée</title>
</svelte:head>

<!-- Layout avec navbar classique pour pages publiques -->
<div class="flex flex-col min-h-screen bg-slate-50">
    <!-- Navbar principal -->
    <header class="bg-white shadow-sm border-b border-slate-200">
        <div class="container mx-auto px-4">
            <div class="flex items-center justify-between h-16">
                <!-- Logo -->
                <div class="flex items-center">
                    <h1 class="text-xl font-bold text-slate-800">
                        <a class="hover:text-blue-600 transition-colors" href="/">
                            📦 Stock Fast
                        </a>
                    </h1>
                </div>

                <!-- Actions utilisateur -->
                <div class="flex items-center space-x-4">
                    {#if data.user}
                        <!-- Utilisateur connecté -->
                        <span class="text-sm text-slate-600">
                            Bonjour, {data.user.username}
                        </span>
                        <Button href="/dashboard" variant="outline">
                            Dashboard
                        </Button>
                        <form action="/logout" method="POST" class="inline">
                            <Button type="submit" variant="destructive">
                                Déconnexion
                            </Button>
                        </form>
                    {:else}
                        <Button href="/features" variant="link">
                            Fonctionnalités
                        </Button>
                        <Button href="/pricing" variant="link">
                            Prix
                        </Button>
                        <Button href="/login" variant="secondary">
                            Connexion
                        </Button>
                        <Button href="/register" variant="outline">
                            S'inscrire
                        </Button>
                    {/if}
                </div>
            </div>
        </div>
    </header>

    <!-- Contenu principal -->
    <main class="flex-1 mt-4">
        {@render children()}
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 mt-auto">
        <div class="container mx-auto px-4 py-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="font-semibold text-slate-800 mb-4">Stock Manager</h3>
                    <p class="text-sm text-slate-600">
                        La solution complète pour gérer votre inventaire et optimiser votre stock.
                    </p>
                </div>
                <div>
                    <h4 class="font-medium text-slate-700 mb-3">Produit</h4>
                    <ul class="space-y-2 text-sm text-slate-600">
                        <li><a class="hover:text-slate-800" href="/features">Fonctionnalités</a></li>
                        <li><a class="hover:text-slate-800" href="/pricing">Prix</a></li>
                        <li><a class="hover:text-slate-800" href="/demo">Démo</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-medium text-slate-700 mb-3">Support</h4>
                    <ul class="space-y-2 text-sm text-slate-600">
                        <li><a class="hover:text-slate-800" href="/contact">Contact</a></li>
                        <li><a class="hover:text-slate-800" href="/docs">Documentation</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-medium text-slate-700 mb-3">Application</h4>
                    <ul class="space-y-2 text-sm text-slate-600">
                        {#if data.user}
                            <li><a class="hover:text-slate-800" href="/dashboard">dashboard</a></li>
                            <li><a class="hover:text-slate-800" href="/settings">paramètres</a></li>
                            <li><a class="hover:text-slate-800" href="/logout">Se déconnecter</a></li>
                        {:else}
                            <li><a class="hover:text-slate-800" href="/contact">Se connecter</a></li>
                            <li><a class="hover:text-slate-800" href="/register">S'inscrire</a></li>
                        {/if}
                    </ul>

                </div>
            </div>
            <div class="border-t border-slate-200 mt-8 pt-6 text-center text-sm text-slate-500">
                © 2025 Stock Manager. Tous droits réservés.
            </div>
        </div>
    </footer>
</div>