<script lang="ts">
    import type { LayoutProps } from './$types';
    import { page } from "$app/state";
    import Breadcrumb from '$lib/components/protected/breadcrumb.svelte';

    let { children, data }: LayoutProps = $props();

    interface NavItem {
        href: string;
        icon: string;
        label: string;
        active?: boolean;
    }

    let navItems: NavItem[] = [
        { href: '/dashboard', icon: '📊', label: 'Dashboard' },
        { href: '/inventory', icon: '📦', label: 'Inventaire' },
        { href: '/products', icon: '🏷️', label: 'Produits' },
        { href: '/commands', icon: '📋', label: 'Commandes' },
        { href: '/suppliers', icon: '🏢', label: 'Fournisseurs' },
        { href: '/categories', icon: '📁', label: 'Catégories' },
    ];

    const settingsItems = [
        { href: '/settings', icon: '⚙️', label: 'Paramètres' },
        { href: '/logs', icon: '📜', label: 'Historique' },
        { href: '/profil', icon: '👤', label: 'Profil' },
    ];

    let sidebarOpen = $derived(false);

    let activeNavItems = $derived(
        navItems.map(item => ({
            ...item,
            active: item.href === page.url.pathname
        }))
    );

    $effect(() => {
        sidebarOpen = false;
    });

    function closeSidebar() {
        sidebarOpen = false;
    }
</script>


<!-- Layout Dashboard complet -->
<div class="flex h-screen bg-slate-100">
    <!-- Overlay mobile -->
    {#if sidebarOpen}
        <button
                class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onclick={closeSidebar}
                aria-label="Fermer le menu"
        ></button>
    {/if}

    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-sm border-r border-slate-200 flex flex-col fixed lg:relative z-50 h-full transform transition-transform lg:transform-none {sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}">
        <!-- Logo Dashboard -->
        <div class="p-6 border-b border-slate-200">
            <h1 class="text-xl font-bold text-slate-800 flex items-center">
                📦 <span class="ml-2">Stock Fast</span>
            </h1>
        </div>

        <!-- Navigation principale -->
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
            <div class="mb-6">
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Gestion
                </p>
                {#each activeNavItems as item (item.href)}
                    <a
                            href={item.href}
                            onclick={closeSidebar}
                            class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors group
                               {item.active ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}"
                    >
                        <span class="mr-3 text-lg">{item.icon}</span>
                        {item.label}
                        {#if item.active}
                            <span class="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        {/if}
                    </a>
                {/each}
            </div>

            <div class="border-t border-slate-200 pt-4">
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Compte
                </p>
                {#each settingsItems as item (item.href)}
                    <a
                            href={item.href}
                            onclick={closeSidebar}
                            class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                               {page.url.pathname === item.href ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}"
                    >
                        <span class="mr-3 text-lg">{item.icon}</span>
                        {item.label}
                        {#if page.url.pathname === item.href}
                            <span class="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        {/if}
                    </a>
                {/each}
            </div>
        </nav>

        <!-- User info + logout -->
        <div class="p-4 border-t border-slate-200">
            <div class="flex items-center mb-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-blue-700">
                        {data.user?.username?.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div class="ml-3 flex-1 min-w-0">
                    <p class="text-sm font-medium text-slate-700 truncate">
                        {data.user?.username}
                    </p>
                    <p class="text-xs text-slate-500">Administrateur</p>
                </div>
            </div>
            <form action="/logout" method="POST" class="w-full">
                <button type="submit" class="w-full btn btn-ghost btn-sm justify-start">
                    <span class="mr-2">🚪</span>
                    Déconnexion
                </button>
            </form>
        </div>
    </aside>

    <!-- Contenu principal -->
    <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header Dashboard -->
        <header class="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <!-- Bouton menu mobile - UNIQUEMENT visible sur mobile -->
                    <button
                            class="block md:hidden btn btn-ghost btn-sm mr-4"
                            onclick={() => sidebarOpen = !sidebarOpen}
                            aria-label="{sidebarOpen ? 'Fermer' : 'Ouvrir'} le menu"
                    >
                        <span class="text-lg">{sidebarOpen ? '✕' : '☰'}</span>
                    </button>

                    <!-- Breadcrumb Component -->
                    <Breadcrumb />
                </div>

                <div class="flex items-center space-x-4">
                    <a href="/products/form" class="btn btn-primary btn-sm">
                        <span class="mr-2">➕</span>
                        <span class="hidden sm:inline">Produit</span>
                        <span class="sm:hidden">Ajouter un produit</span>
                    </a>
                    <a
                    href="/categories/form"
                    class="btn btn-primary btn-sm"
                    >
                        <span class="mr-2">➕</span>
                        <span class="hidden sm:inline">Catégorie</span>
                        <span class="sm:hidden">Ajouter une catégorie</span>
                    </a>
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto p-6">
            {@render children()}
        </main>
    </div>
</div>