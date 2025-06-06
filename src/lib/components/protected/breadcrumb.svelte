<script lang="ts">
    import { page } from '$app/state';
    import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "$lib/components/ui/breadcrumb";
    import { HomeIcon } from "lucide-svelte";
    
    interface BreadcrumbItemType {
        label: string;
        href?: string;
        icon?: string;
    }

    interface Props {
        customTitle?: string;
        customItems?: BreadcrumbItemType[];
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
    const routeConfig: Record<string, { title: string; items: BreadcrumbItemType[] }> = {
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

<Breadcrumb>
    <BreadcrumbList>
        <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard" class="flex items-center gap-1">
                <HomeIcon class="w-4 h-4" />
                Accueil
            </BreadcrumbLink>
        </BreadcrumbItem>
        {#each items as item, index (index)}
            <BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbLink href={item.href}>
                    {#if showIcons && item.icon}
                        <span class="mr-1 text-xs" aria-hidden="true">
                            {item.icon}
                        </span>
                    {/if}
                    {item.label}
                </BreadcrumbLink>
            </BreadcrumbItem>
        {/each}
    </BreadcrumbList>
</Breadcrumb>