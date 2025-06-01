<script lang="ts">
    let selectedDemo = $state('dashboard');
    let isVideoPlaying = $state(false);

    const demoSections = [
        {
            id: 'dashboard',
            title: 'Dashboard principal',
            description: 'Vue d\'ensemble de votre inventaire avec métriques en temps réel',
            duration: '2:30',
            features: ['Statistiques temps réel', 'Graphiques interactifs', 'Alertes visuelles']
        },
        {
            id: 'inventory',
            title: 'Gestion d\'inventaire',
            description: 'Ajout, modification et suivi de vos produits',
            duration: '3:15',
            features: ['Catalogage produits', 'Codes-barres', 'Niveaux de stock']
        },
        {
            id: 'orders',
            title: 'Commandes automatiques',
            description: 'Comment l\'IA prédit et automatise vos approvisionnements',
            duration: '2:45',
            features: ['Prédictions IA', 'Commandes auto', 'Optimisation coûts']
        },
        {
            id: 'reports',
            title: 'Analytics & Rapports',
            description: 'Analyses avancées pour optimiser votre business',
            duration: '3:00',
            features: ['Rapports détaillés', 'Tendances marché', 'ROI tracking']
        }
    ];

    const testimonials = [
        {
            name: 'Marie Dubois',
            company: 'TechStore Paris',
            role: 'Directrice Logistique',
            avatar: '👩‍💼',
            quote: 'Stock Manager a révolutionné notre gestion d\'inventaire. 40% de temps gagné sur nos processus.'
        },
        {
            name: 'Pierre Martin',
            company: 'ElectroMax',
            role: 'CEO',
            avatar: '👨‍💼',
            quote: 'L\'automatisation des commandes nous a fait économiser 25% sur nos coûts d\'approvisionnement.'
        },
        {
            name: 'Sophie Laurent',
            company: 'Fashion Hub',
            role: 'Responsable Stock',
            avatar: '👩‍💻',
            quote: 'Interface intuitive et support excellent. Recommandé les yeux fermés !'
        }
    ];

    let demoForm = $state({
        name: '',
        email: '',
        company: '',
        phone: '',
        employees: '1-10',
        demo_type: 'standard'
    });

    let isSubmitting = $state(false);
    let submitStatus = $state(null);

    async function handleDemoRequest(event) {
        event.preventDefault();
        isSubmitting = true;

        try {
            // Simulation d'envoi
            await new Promise(resolve => setTimeout(resolve, 2000));
            submitStatus = 'success';
            demoForm = {
                name: '', email: '', company: '', phone: '',
                employees: '1-10', demo_type: 'standard'
            };
        } catch (error) {
            submitStatus = 'error';
        } finally {
            isSubmitting = false;
        }
    }
</script>

<svelte:head>
    <title>Démo - Stock Manager</title>
    <meta name="description" content="Découvrez Stock Manager en action avec notre démo interactive. Planifiez une démonstration personnalisée avec notre équipe.">
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-blue-50 to-slate-100 py-16">
    <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-slate-800 mb-6">
            Découvrez Stock Manager <span class="text-blue-600">en action</span>
        </h1>
        <p class="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Explorez toutes les fonctionnalités de notre solution de gestion d'inventaire
            à travers nos démonstrations interactives et planifiez une session personnalisée.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#demo-interactive" class="btn btn-primary btn-lg">
                Voir la démo interactive
            </a>
            <a href="#demo-personnalisee" class="btn btn-secondary btn-lg">
                Planifier une démo
            </a>
        </div>
    </div>
</section>

<!-- Démo interactive -->
<section id="demo-interactive" class="py-16 bg-white">
    <div class="container mx-auto px-4">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-slate-800 mb-4">
                Démo interactive
            </h2>
            <p class="text-lg text-slate-600">
                Explorez les différentes sections de Stock Manager
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Menu des sections -->
            <div class="space-y-3">
                {#each demoSections as section}
                    <button
                            class="w-full text-left p-4 rounded-lg border-2 transition-all {selectedDemo === section.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}"
                            onclick={() => selectedDemo = section.id}
                    >
                        <h3 class="font-semibold text-slate-800 mb-1">{section.title}</h3>
                        <p class="text-sm text-slate-600 mb-2">{section.description}</p>
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-slate-500">⏱️ {section.duration}</span>
                            <span class="text-xs bg-slate-100 px-2 py-1 rounded">{section.features.length} fonctionnalités</span>
                        </div>
                    </button>
                {/each}
            </div>

            <!-- Lecteur vidéo/demo -->
            <div class="lg:col-span-2">
                <div class="bg-slate-100 rounded-xl overflow-hidden shadow-lg">
                    {#if !isVideoPlaying}
                        <div class="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 flex flex-col items-center justify-center relative">
                            <button
                                    class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors mb-4"
                                    onclick={() => isVideoPlaying = true}
                            >
                                <span class="text-white text-2xl ml-1">▶</span>
                            </button>
                            <h3 class="text-xl font-semibold text-slate-700 mb-2">
                                {demoSections.find(s => s.id === selectedDemo)?.title}
                            </h3>
                            <p class="text-slate-600 text-center px-8">
                                {demoSections.find(s => s.id === selectedDemo)?.description}
                            </p>
                        </div>
                    {:else}
                        <div class="aspect-video bg-slate-800 flex items-center justify-center relative">
                            <button
                                    class="absolute top-4 right-4 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white"
                                    onclick={() => isVideoPlaying = false}
                            >
                                ✕
                            </button>
                            <p class="text-white">🎥 Lecture de la démo : {demoSections.find(s => s.id === selectedDemo)?.title}</p>
                        </div>
                    {/if}

                    <!-- Détails de la section -->
                    <div class="p-6 bg-white">
                        <h4 class="font-semibold text-slate-800 mb-3">Fonctionnalités couvertes :</h4>
                        <div class="flex flex-wrap gap-2">
                            {#each demoSections.find(s => s.id === selectedDemo)?.features || [] as feature}
                                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    {feature}
                                </span>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Témoignages -->
<section class="py-16 bg-slate-50">
    <div class="container mx-auto px-4">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-slate-800 mb-4">
                Ce que disent nos clients
            </h2>
            <p class="text-lg text-slate-600">
                Des entreprises qui ont transformé leur gestion d'inventaire
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {#each testimonials as testimonial}
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <span class="text-xl">{testimonial.avatar}</span>
                        </div>
                        <div>
                            <h4 class="font-semibold text-slate-800">{testimonial.name}</h4>
                            <p class="text-sm text-slate-600">{testimonial.role}</p>
                            <p class="text-sm text-blue-600">{testimonial.company}</p>
                        </div>
                    </div>
                    <blockquote class="text-slate-700 italic">
                        "{testimonial.quote}"
                    </blockquote>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- Formulaire de demande de démo -->
<section id="demo-personnalisee" class="py-16 bg-white">
    <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-slate-800 mb-4">
                    Planifiez une démo personnalisée
                </h2>
                <p class="text-lg text-slate-600">
                    Découvrez comment Stock Manager peut s'adapter spécifiquement à vos besoins
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <!-- Avantages démo personnalisée -->
                <div>
                    <h3 class="text-xl font-semibold text-slate-800 mb-6">
                        Votre démo personnalisée inclut :
                    </h3>

                    <div class="space-y-4">
                        <div class="flex items-start">
                            <div class="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span class="text-emerald-600 text-sm">✓</span>
                            </div>
                            <div>
                                <h4 class="font-medium text-slate-800">Analyse de vos besoins</h4>
                                <p class="text-slate-600 text-sm">Nous étudions votre situation actuelle et vos objectifs</p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span class="text-emerald-600 text-sm">✓</span>
                            </div>
                            <div>
                                <h4 class="font-medium text-slate-800">Démonstration sur mesure</h4>
                                <p class="text-slate-600 text-sm">Focus sur les fonctionnalités pertinentes pour votre secteur</p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span class="text-emerald-600 text-sm">✓</span>
                            </div>
                            <div>
                                <h4 class="font-medium text-slate-800">Session Q&R dédiée</h4>
                                <p class="text-slate-600 text-sm">Toutes vos questions techniques et commerciales</p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span class="text-emerald-600 text-sm">✓</span>
                            </div>
                            <div>
                                <h4 class="font-medium text-slate-800">Plan de migration</h4>
                                <p class="text-slate-600 text-sm">Stratégie personnalisée pour passer à Stock Manager</p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span class="text-emerald-600 text-sm">✓</span>
                            </div>
                            <div>
                                <h4 class="font-medium text-slate-800">Devis personnalisé</h4>
                                <p class="text-slate-600 text-sm">Tarification adaptée à votre volume et besoins</p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 p-4 bg-blue-50 rounded-lg">
                        <p class="text-blue-800 text-sm">
                            <strong>🎯 Durée :</strong> 45 minutes • <strong>📅 Disponibilité :</strong> Sous 24h • <strong>💰 Coût :</strong> Gratuit
                        </p>
                    </div>
                </div>

                <!-- Formulaire -->
                <div class="bg-slate-50 rounded-xl p-8">
                    <h3 class="text-xl font-semibold text-slate-800 mb-6">
                        Planifiez votre démo
                    </h3>

                    {#if submitStatus === 'success'}
                        <div class="callout callout-success mb-6">
                            ✅ Votre demande de démo a été envoyée ! Nous vous contacterons sous 24h pour planifier votre session.
                        </div>
                    {:else if submitStatus === 'error'}
                        <div class="callout callout-error mb-6">
                            ❌ Une erreur s'est produite. Veuillez réessayer ou nous contacter directement.
                        </div>
                    {/if}

                    <form onsubmit={handleDemoRequest} class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="form-group">
                                <label for="demo-name">Nom complet *</label>
                                <input
                                        type="text"
                                        id="demo-name"
                                        bind:value={demoForm.name}
                                        required
                                        placeholder="Jean Dupont"
                                />
                            </div>
                            <div class="form-group">
                                <label for="demo-email">Email professionnel *</label>
                                <input
                                        type="email"
                                        id="demo-email"
                                        bind:value={demoForm.email}
                                        required
                                        placeholder="jean@entreprise.com"
                                />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="form-group">
                                <label for="demo-company">Entreprise *</label>
                                <input
                                        type="text"
                                        id="demo-company"
                                        bind:value={demoForm.company}
                                        required
                                        placeholder="Nom de votre entreprise"
                                />
                            </div>
                            <div class="form-group">
                                <label for="demo-phone">Téléphone</label>
                                <input
                                        type="tel"
                                        id="demo-phone"
                                        bind:value={demoForm.phone}
                                        placeholder="+33 1 23 45 67 89"
                                />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="form-group">
                                <label for="demo-employees">Taille de l'entreprise *</label>
                                <select id="demo-employees" bind:value={demoForm.employees} required>
                                    <option value="1-10">1-10 employés</option>
                                    <option value="11-50">11-50 employés</option>
                                    <option value="51-200">51-200 employés</option>
                                    <option value="201-1000">201-1000 employés</option>
                                    <option value="1000+">1000+ employés</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="demo-type">Type de démo *</label>
                                <select id="demo-type" bind:value={demoForm.demo_type} required>
                                    <option value="standard">Démo standard (45min)</option>
                                    <option value="technical">Démo technique (60min)</option>
                                    <option value="executive">Présentation executive (30min)</option>
                                    <option value="workshop">Workshop approfondi (90min)</option>
                                </select>
                            </div>
                        </div>

                        <button
                                type="submit"
                                class="btn btn-primary w-full {isSubmitting ? 'loading' : ''}"
                                disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Envoi en cours...' : 'Planifier ma démo gratuite'}
                        </button>

                        <p class="text-xs text-slate-500 text-center">
                            Nous vous contacterons sous 24h pour confirmer le créneau qui vous convient.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Comparaison avec concurrents -->
<section class="py-16 bg-slate-50">
    <div class="container mx-auto px-4">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-slate-800 mb-4">
                Pourquoi choisir Stock Manager ?
            </h2>
            <p class="text-lg text-slate-600">
                Comparaison avec les solutions traditionnelles
            </p>
        </div>

        <div class="max-w-5xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-slate-50">
                        <tr>
                            <th class="text-left p-4 font-semibold text-slate-800">Fonctionnalité</th>
                            <th class="text-center p-4 font-semibold text-blue-600">Stock Manager</th>
                            <th class="text-center p-4 font-semibold text-slate-600">Solutions traditionnelles</th>
                            <th class="text-center p-4 font-semibold text-slate-600">Feuilles Excel</th>
                        </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200">
                        <tr>
                            <td class="p-4 text-slate-700">Temps de mise en place</td>
                            <td class="p-4 text-center text-emerald-600 font-medium"> 1 jour</td>
                            <td class="p-4 text-center text-amber-600">2-6 semaines</td>
                            <td class="p-4 text-center text-slate-600">Variables</td>
                        </tr>
                        <tr>
                            <td class="p-4 text-slate-700">Automatisation IA</td>
                            <td class="p-4 text-center text-emerald-600">✓</td>
                            <td class="p-4 text-center text-slate-400">Limitée</td>
                            <td class="p-4 text-center text-red-500">✗</td>
                        </tr>
                        <tr>
                            <td class="p-4 text-slate-700">Prédictions de demande</td>
                            <td class="p-4 text-center text-emerald-600">✓</td>
                            <td class="p-4 text-center text-amber-600">Basique</td>
                            <td class="p-4 text-center text-red-500">✗</td>
                        </tr>
                        <tr>
                            <td class="p-4 text-slate-700">Interface moderne</td>
                            <td class="p-4 text-center text-emerald-600">✓</td>
                            <td class="p-4 text-center text-amber-600">Variable</td>
                            <td class="p-4 text-center text-red-500">✗</td>
                        </tr>
                        <tr>
                            <td class="p-4 text-slate-700">Support français</td>
                            <td class="p-4 text-center text-emerald-600">✓</td>
                            <td class="p-4 text-center text-amber-600">Limité</td>
                            <td class="p-4 text-center text-red-500">✗</td>
                        </tr>
                        <tr>
                            <td class="p-4 text-slate-700">Coût mensuel</td>
                            <td class="p-4 text-center text-emerald-600">À partir de 29€</td>
                            <td class="p-4 text-center text-red-600">200€+</td>
                            <td class="p-4 text-center text-emerald-600">Gratuit</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Prochaines étapes -->
<section class="py-16 bg-white">
    <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-slate-800 mb-6">
            Prêt à commencer ?
        </h2>
        <p class="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Plus de 10 000 entreprises nous font déjà confiance pour optimiser leur gestion d'inventaire.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="/register" class="btn btn-primary btn-lg">
                Essai gratuit 30 jours
            </a>
            <a href="#demo-personnalisee" class="btn btn-secondary btn-lg">
                Planifier une démo
            </a>
            <a href="/contact" class="btn btn-ghost btn-lg">
                Nous contacter
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-sm">
            <div class="flex items-center justify-center text-slate-600">
                <span class="mr-2">✓</span>
                Aucune carte de crédit requise
            </div>
            <div class="flex items-center justify-center text-slate-600">
                <span class="mr-2">✓</span>
                Support gratuit inclus
            </div>
            <div class="flex items-center justify-center text-slate-600">
                <span class="mr-2">✓</span>
                Migration de données offerte
            </div>
        </div>
    </div>
</section>