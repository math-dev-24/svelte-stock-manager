<script lang="ts">
    let isAnnual = $state(false);

    const plans = [
        {
            name: "Starter",
            description: "Parfait pour les petites entreprises",
            monthlyPrice: 29,
            annualPrice: 290,
            features: [
                "Jusqu'à 1 000 produits",
                "1 entrepôt",
                "Rapports de base",
                "Support email",
                "Alertes de stock"
            ],
            limitations: [
                "Pas d'automatisation",
                "Pas d'intégrations",
                "Historique 6 mois"
            ],
            popular: false,
            cta: "Commencer gratuitement"
        },
        {
            name: "Professional",
            description: "Pour les entreprises en croissance",
            monthlyPrice: 79,
            annualPrice: 790,
            features: [
                "Jusqu'à 10 000 produits",
                "5 entrepôts",
                "Rapports avancés",
                "Support prioritaire",
                "Alertes de stock",
                "Automatisation des commandes",
                "Intégrations (10+)",
                "Prédictions IA",
                "Multi-utilisateurs (5)"
            ],
            limitations: [
                "Historique 2 ans"
            ],
            popular: true,
            cta: "Essai gratuit 30 jours"
        },
        {
            name: "Enterprise",
            description: "Solution complète pour grandes entreprises",
            monthlyPrice: 199,
            annualPrice: 1990,
            features: [
                "Produits illimités",
                "Entrepôts illimités",
                "Rapports personnalisés",
                "Support dédié 24/7",
                "Alertes de stock",
                "Automatisation complète",
                "Intégrations illimitées",
                "IA avancée",
                "Utilisateurs illimités",
                "API complète",
                "Formation personnalisée"
            ],
            limitations: [],
            popular: false,
            cta: "Contactez-nous"
        }
    ];
</script>

<svelte:head>
    <title>Prix - Stock Manager</title>
    <meta name="description" content="Découvrez nos plans de prix flexibles et abordables pour Stock Manager. Essai gratuit de 30 jours.">
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-blue-50 to-slate-100 py-16">
    <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-slate-800 mb-6">
            Des prix <span class="text-blue-600">transparents</span> pour chaque entreprise
        </h1>
        <p class="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos besoins. Tous nos plans incluent un essai gratuit de 30 jours,
            sans engagement et sans carte de crédit requise.
        </p>

        <!-- Toggle annuel/mensuel -->
        <div class="flex items-center justify-center mb-8">
            <span class="text-slate-600 mr-3">Mensuel</span>
            <button
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 {isAnnual ? 'bg-blue-600' : 'bg-slate-300'}"
                    onclick={() => isAnnual = !isAnnual}
                    aria-label="Toggle annuel/mensuel"
            >
                <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {isAnnual ? 'translate-x-6' : 'translate-x-1'}"></span>
            </button>
            <span class="text-slate-600 ml-3">Annuel</span>
            <span class="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">-17%</span>
        </div>
    </div>
</section>

<!-- Plans de prix -->
<section class="py-16 bg-white">
    <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {#each plans as plan (plan.name)}
                <div class="relative bg-white rounded-xl border-2 shadow-sm transition-all hover:shadow-lg {plan.popular ? 'border-blue-500 scale-105' : 'border-slate-200'}">
                    {#if plan.popular}
                        <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span class="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                Plus populaire
                            </span>
                        </div>
                    {/if}

                    <div class="p-6">
                        <!-- En-tête du plan -->
                        <div class="text-center mb-6">
                            <h3 class="text-xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                            <p class="text-slate-600 text-sm mb-4">{plan.description}</p>

                            <div class="mb-4">
                                <span class="text-4xl font-bold text-slate-800">
                                    €{isAnnual ? Math.floor(plan.annualPrice / 12) : plan.monthlyPrice}
                                </span>
                                <span class="text-slate-600">/mois</span>
                                {#if isAnnual}
                                    <div class="text-sm text-slate-500">
                                        Facturé €{plan.annualPrice}/an
                                    </div>
                                {/if}
                            </div>
                        </div>

                        <!-- Fonctionnalités -->
                        <div class="space-y-3 mb-6">
                            {#each plan.features as feature (feature)}
                                <div class="flex items-start">
                                    <span class="text-emerald-500 mr-3 mt-0.5">✓</span>
                                    <span class="text-slate-700 text-sm">{feature}</span>
                                </div>
                            {/each}

                            {#each plan.limitations as limitation (limitation)}
                                <div class="flex items-start">
                                    <span class="text-slate-400 mr-3 mt-0.5">✗</span>
                                    <span class="text-slate-500 text-sm">{limitation}</span>
                                </div>
                            {/each}
                        </div>

                        <!-- CTA -->
                        <div class="text-center">
                            {#if plan.name === 'Enterprise'}
                                <a href="/contact" class="btn btn-secondary w-full">
                                    {plan.cta}
                                </a>
                            {:else}
                                <a href="/register" class="btn {plan.popular ? 'btn-primary' : 'btn-secondary'} w-full">
                                    {plan.cta}
                                </a>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- Comparaison détaillée -->
<section class="py-16 bg-slate-50">
    <div class="container mx-auto px-4">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-slate-800 mb-4">
                Comparaison détaillée
            </h2>
            <p class="text-lg text-slate-600">
                Toutes les fonctionnalités en un coup d'œil
            </p>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-slate-50">
                    <tr>
                        <th class="text-left p-4 font-semibold text-slate-800">Fonctionnalité</th>
                        <th class="text-center p-4 font-semibold text-slate-800">Starter</th>
                        <th class="text-center p-4 font-semibold text-slate-800 bg-blue-50">Professional</th>
                        <th class="text-center p-4 font-semibold text-slate-800">Enterprise</th>
                    </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                    <tr>
                        <td class="p-4 text-slate-700">Nombre de produits</td>
                        <td class="p-4 text-center text-slate-600">1 000</td>
                        <td class="p-4 text-center text-slate-600 bg-blue-50">10 000</td>
                        <td class="p-4 text-center text-slate-600">Illimité</td>
                    </tr>
                    <tr>
                        <td class="p-4 text-slate-700">Nombre d'entrepôts</td>
                        <td class="p-4 text-center text-slate-600">1</td>
                        <td class="p-4 text-center text-slate-600 bg-blue-50">5</td>
                        <td class="p-4 text-center text-slate-600">Illimité</td>
                    </tr>
                    <tr>
                        <td class="p-4 text-slate-700">Utilisateurs</td>
                        <td class="p-4 text-center text-slate-600">1</td>
                        <td class="p-4 text-center text-slate-600 bg-blue-50">5</td>
                        <td class="p-4 text-center text-slate-600">Illimité</td>
                    </tr>
                    <tr>
                        <td class="p-4 text-slate-700">Automatisation des commandes</td>
                        <td class="p-4 text-center text-slate-400">✗</td>
                        <td class="p-4 text-center text-emerald-500 bg-blue-50">✓</td>
                        <td class="p-4 text-center text-emerald-500">✓</td>
                    </tr>
                    <tr>
                        <td class="p-4 text-slate-700">Prédictions IA</td>
                        <td class="p-4 text-center text-slate-400">✗</td>
                        <td class="p-4 text-center text-emerald-500 bg-blue-50">✓</td>
                        <td class="p-4 text-center text-emerald-500">✓</td>
                    </tr>
                    <tr>
                        <td class="p-4 text-slate-700">API complète</td>
                        <td class="p-4 text-center text-slate-400">✗</td>
                        <td class="p-4 text-center text-slate-400 bg-blue-50">✗</td>
                        <td class="p-4 text-center text-emerald-500">✓</td>
                    </tr>
                    <tr>
                        <td class="p-4 text-slate-700">Support</td>
                        <td class="p-4 text-center text-slate-600">Email</td>
                        <td class="p-4 text-center text-slate-600 bg-blue-50">Prioritaire</td>
                        <td class="p-4 text-center text-slate-600">Dédié 24/7</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>

<!-- FAQ -->
<section class="py-16 bg-white">
    <div class="container mx-auto px-4">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-slate-800 mb-4">
                Questions fréquentes
            </h2>
        </div>

        <div class="max-w-3xl mx-auto space-y-6">
            <div class="bg-slate-50 rounded-lg p-6">
                <h4 class="font-semibold text-slate-800 mb-2">Puis-je changer de plan à tout moment ?</h4>
                <p class="text-slate-600">Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement.</p>
            </div>

            <div class="bg-slate-50 rounded-lg p-6">
                <h4 class="font-semibold text-slate-800 mb-2">Que se passe-t-il après l'essai gratuit ?</h4>
                <p class="text-slate-600">Après 30 jours, vous pouvez choisir un plan payant ou continuer avec notre version gratuite limitée.</p>
            </div>

            <div class="bg-slate-50 rounded-lg p-6">
                <h4 class="font-semibold text-slate-800 mb-2">Proposez-vous des réductions pour les associations ?</h4>
                <p class="text-slate-600">Oui, nous offrons des tarifs préférentiels pour les associations, écoles et organisations à but non lucratif. Contactez-nous pour en savoir plus.</p>
            </div>

            <div class="bg-slate-50 rounded-lg p-6">
                <h4 class="font-semibold text-slate-800 mb-2">Vos prix incluent-ils la TVA ?</h4>
                <p class="text-slate-600">Tous nos prix sont affichés HT. La TVA applicable sera ajoutée selon votre localisation.</p>
            </div>
        </div>
    </div>
</section>

<!-- CTA Final -->
<section class="py-16 bg-slate-50">
    <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-slate-800 mb-4">
            Prêt à commencer ?
        </h2>
        <p class="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Rejoignez plus de 10 000 entreprises qui font confiance à Stock Manager pour optimiser leur inventaire.
        </p>
        <a href="/register" class="btn btn-primary btn-lg">
            Commencer l'essai gratuit
        </a>
        <p class="text-sm text-slate-500 mt-4">
            Aucune carte de crédit requise • Annulation à tout moment
        </p>
    </div>
</section>