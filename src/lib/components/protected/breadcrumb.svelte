<script lang="ts">
    import { page } from '$app/state';

    interface BreadcrumbItem {
        label: string;
        href?: string;
        icon?: string;
    }

    interface Props {
        customTitle?: string;
        customItems?: BreadcrumbItem[];
        showIcons?: boolean;
        separator?: string;
    }

    let {
        customTitle,
        customItems,
        showIcons = true,
        separator = '/'
    }: Props = $props();

    // Configuration des routes et leurs breadcrumbs
    const routeConfig: Record<string, { title: string; items: BreadcrumbItem[] }> = {
        '/dashboard': {
            title: 'Dashboard',
            items: [
                { label: 'Accueil', icon: '🏠' }
            ]
        },
        '/inventory': {
            title: 'Inventaire',
            items: [
                { label: 'Accueil', href: '/dashboard', icon: '🏠' },
                { label: 'Inventaire', icon: '📦' }
            ]
        },
        '/products': {
            title: 'Produits',
            items: [
                { label: 'Accueil', href: '/dashboard', icon: '🏠' },
                { label: 'Produits', icon: '🏷️' }
            ]
        },
        '/products/new': {
            title: 'Nouveau produit',
            items: [
                { label: 'Accueil', href: '/dashboard', icon: '🏠' },
                { label: 'Produits', href: '/products', icon: '🏷️' },
                { label: 'Nouveau', icon: '➕' }
            ]
        },
        '/commands': {
            title: 'Commandes',
            items: [
                { label: 'Accueil', href: '/dashboard', icon: '🏠' },
                { label: 'Commandes', icon: '📋' }
            ]
        },
        '/suppliers': {
            title: 'Fournisseurs',
            items: [
                { label: 'Accueil', href: '/dashboard', icon: '🏠' },
                { label: 'Fournisseurs', icon: '🏢' }
            ]
        },
        '/categories': {
            title: 'Catégories',
            items: [
                { label: 'Accueil', href: '/dashboard', icon: '🏠' },
                { label: 'Catégories', icon: '📁' }
            ]
        },
        '/settings': {
            title: 'Paramètres',
            items: [
                { label: 'Accueil', href: '/dashboard', icon: '🏠' },
                { label: 'Paramètres', icon: '⚙️' }
            ]
        },
        '/profil': {
            title: 'Profil',
            items: [
                { label: 'Accueil', href: '/dashboard', icon: '🏠' },
                { label: 'Profil', icon: '👤' }
            ]
        }
    };

    // Fonction pour obtenir les données de la route courante
    function getCurrentRoute() {
        const pathname = page.url.pathname;

        if (customItems) {
            return {
                title: customTitle || 'Page',
                items: customItems
            };
        }
        if (routeConfig[pathname]) {
            return routeConfig[pathname];
        }
        for (const [route, config] of Object.entries(routeConfig)) {
            if (route.includes(':') || route.includes('[')) {
                continue;
            }
            if (pathname.startsWith(route) && route !== '/dashboard') {
                return config;
            }
        }

        return routeConfig['/dashboard'];
    }

    let currentRoute = $derived(getCurrentRoute());
    let items = $derived(customItems || currentRoute.items);
</script>

<div class="flex items-center justify-center space-x-4">

    <nav class="flex items-center text-sm text-slate-500" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
            {#each items as item, index (item.label)}
                <li class="flex items-center">
                    {#if index > 0}
                        <span class="mx-2 text-slate-400" aria-hidden="true">
                            {separator}
                        </span>
                    {/if}

                    {#if item.href}
                        <a
                                href={item.href}
                                class="flex items-center hover:text-slate-700 transition-colors duration-200"
                                aria-label="Aller à {item.label}"
                        >
                            {#if showIcons && item.icon}
                                <span class="mr-1 text-xs" aria-hidden="true">
                                    {item.icon}
                                </span>
                            {/if}
                            {item.label}
                        </a>
                    {:else}
                        <span
                                class="flex items-center text-slate-700 font-medium"
                                aria-current="page"
                        >
                            {#if showIcons && item.icon}
                                <span class="mr-1 text-xs" aria-hidden="true">
                                    {item.icon}
                                </span>
                            {/if}
                            {item.label}
                        </span>
                    {/if}
                </li>
            {/each}
        </ol>
    </nav>
</div>