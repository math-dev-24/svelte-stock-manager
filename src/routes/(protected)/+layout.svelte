<script lang="ts">
    import type { LayoutProps } from './$types';
    import { page } from "$app/state";
    import Breadcrumb from '$lib/components/protected/breadcrumb.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import { 
        LayoutDashboard, 
        Package, 
        Tags, 
        ClipboardList, 
        Building2, 
        FolderTree,
        Settings,
        History,
        User,
        LogOut,
        Plus,
        Menu,
        X
    } from 'lucide-svelte';

    let { children, data }: LayoutProps = $props();

    interface NavItem {
        href: string;
        icon: any;
        label: string;
        active?: boolean;
    }

    let navItems: NavItem[] = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/inventory', icon: Package, label: 'Inventaire' },
        { href: '/products', icon: Tags, label: 'Produits' },
        { href: '/commands', icon: ClipboardList, label: 'Commandes' },
        { href: '/suppliers', icon: Building2, label: 'Fournisseurs' },
        { href: '/categories', icon: FolderTree, label: 'Catégories' },
    ];

    const settingsItems = [
        { href: '/settings', icon: Settings, label: 'Paramètres' },
        { href: '/logs', icon: History, label: 'Historique' },
        { href: '/profil', icon: User, label: 'Profil' },
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
<div class="flex h-screen bg-background">
    <!-- Overlay mobile -->
    {#if sidebarOpen}
        <button
            class="fixed inset-0 bg-black/50 z-40 md:hidden"
            onclick={closeSidebar}
            aria-label="Fermer le menu"
        ></button>
    {/if}

    <!-- Sidebar -->
    <aside class="w-64 bg-card border-r border-border flex flex-col fixed lg:relative z-50 h-full transform transition-transform lg:transform-none {sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}">
        <!-- Logo Dashboard -->
        <div class="p-6 border-b border-border">
            <h1 class="text-xl font-bold text-foreground flex items-center">
                <Package class="w-6 h-6" />
                <span class="ml-2">Stock Fast</span>
            </h1>
        </div>

        <!-- Navigation principale -->
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
            <div class="mb-6">
                <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Gestion
                </p>
                {#each activeNavItems as item (item.href)}
                    <a
                        href={item.href}
                        onclick={closeSidebar}
                        class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors group
                           {item.active ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
                    >
                        {#if item.icon}
                            <item.icon class="w-5 h-5 mr-3" />
                        {/if}
                        {item.label}
                    </a>
                {/each}
            </div>

            <div class="border-t border-border pt-4">
                <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Compte
                </p>
                {#each settingsItems as item (item.href)}
                    <a
                        href={item.href}
                        onclick={closeSidebar}
                        class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                           {page.url.pathname === item.href ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
                    >
                        {#if item.icon}
                            <item.icon class="w-5 h-5 mr-3" />
                        {/if}
                        {item.label}
                    </a>
                {/each}
            </div>
        </nav>

        <!-- User info + logout -->
        <div class="p-4 border-t border-border">
            <div class="flex items-center mb-3">
                <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-primary">
                        {data.user?.username?.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div class="ml-3 flex-1 min-w-0">
                    <p class="text-sm font-medium text-foreground truncate">
                        {data.user?.username}
                    </p>
                    <p class="text-xs text-muted-foreground">Administrateur</p>
                </div>
            </div>
            <form action="/logout" method="POST" class="w-full">
                <button type="submit" class="w-full flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
                    <LogOut class="w-5 h-5 mr-3" />
                    Déconnexion
                </button>
            </form>
        </div>
    </aside>

    <!-- Contenu principal -->
    <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header Dashboard -->
        <header class="bg-card border-b border-border px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <!-- Bouton menu mobile -->
                    <button
                        class="block md:hidden p-2 hover:bg-accent rounded-md transition-colors"
                        onclick={() => sidebarOpen = !sidebarOpen}
                        aria-label="{sidebarOpen ? 'Fermer' : 'Ouvrir'} le menu"
                    >
                        {#if sidebarOpen}
                            <X class="w-5 h-5" />
                        {:else}
                            <Menu class="w-5 h-5" />
                        {/if}
                    </button>

                    <!-- Breadcrumb Component -->
                    <Breadcrumb />
                </div>

                <div class="flex items-center space-x-4">
                    <Button href="/products/form" variant="outline" class="text-primary hover:text-primary hover:bg-primary/10 border-primary">
                        <Plus class="w-4 h-4 mr-2" />
                        <span class="hidden sm:inline">Produit</span>
                        <span class="sm:hidden">Ajouter un produit</span>
                    </Button>
                    <Button
                        href="/categories/form"
                        variant="outline"
                        class="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-600"
                    >
                        <Plus class="w-4 h-4 mr-2" />
                        <span class="hidden sm:inline">Catégorie</span>
                        <span class="sm:hidden">Ajouter une catégorie</span>
                    </Button>
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto p-6">
            {@render children()}
        </main>
    </div>
</div>