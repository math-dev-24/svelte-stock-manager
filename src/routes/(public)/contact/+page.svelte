<script lang="ts">
    let formData = $state({
        name: '',
        email: '',
        company: '',
        subject: 'general',
        message: ''
    });

    let isSubmitting = $state(false);
    let submitStatus = $state(null); // 'success' | 'error' | null

    const handleSubmit = async (event: SubmitEvent) => {
        console.log('submit');
        event.preventDefault();
    }

    const contactMethods = [
        {
            icon: '📧',
            title: 'Email',
            description: 'Notre équipe vous répond sous 24h',
            contact: 'contact@stock-manager.com',
            link: 'mailto:contact@stock-manager.com'
        }
    ];

    const team = [
        {
            name: 'Sophie Martin',
            role: 'Directrice commerciale',
            email: 'sophie@stock-manager.com',
            image: '👩‍💼'
        },
        {
            name: 'Thomas Dubois',
            role: 'Support technique',
            email: 'thomas@stock-manager.com',
            image: '👨‍💻'
        },
        {
            name: 'Marie Laurent',
            role: 'Customer Success',
            email: 'marie@stock-manager.com',
            image: '👩‍💻'
        }
    ];
</script>

<svelte:head>
    <title>Contact - Stock Manager</title>
    <meta name="description" content="Contactez l'équipe Stock Manager. Support, ventes, questions techniques - nous sommes là pour vous aider.">
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-blue-50 to-slate-100 py-16">
    <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-slate-800 mb-6">
            Contactez-nous
        </h1>
        <p class="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Une question ? Un projet ? Notre équipe d'experts est là pour vous accompagner dans l'optimisation de votre gestion d'inventaire.
        </p>
    </div>
</section>

<!-- Moyens de contact -->
<section class="py-16 bg-white">
    <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {#each contactMethods as method (method.title)}
                <a href={method.link} class="group block">
                    <div class="bg-white border border-slate-200 rounded-xl p-6 text-center hover:shadow-lg transition-all hover:border-blue-300">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                            <span class="text-2xl">{method.icon}</span>
                        </div>
                        <h3 class="text-lg font-semibold text-slate-800 mb-2">{method.title}</h3>
                        <p class="text-slate-600 text-sm mb-3">{method.description}</p>
                        <p class="text-blue-600 font-medium text-sm">{method.contact}</p>
                    </div>
                </a>
            {/each}
        </div>
    </div>
</section>

<!-- Formulaire de contact et équipe -->
<section class="py-16 bg-slate-50">
    <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Formulaire -->
            <div>
                <div class="bg-white rounded-xl shadow-sm p-8">
                    <h2 class="text-2xl font-bold text-slate-800 mb-6">
                        Envoyez-nous un message
                    </h2>

                    {#if submitStatus === 'success'}
                        <div class="callout callout-success mb-6">
                            ✅ Votre message a été envoyé avec succès ! Nous vous répondrons sous 24h.
                        </div>
                    {:else if submitStatus === 'error'}
                        <div class="callout callout-error mb-6">
                            ❌ Une erreur s'est produite. Veuillez réessayer ou nous contacter directement.
                        </div>
                    {/if}

                    <form onsubmit={handleSubmit} class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="form-group">
                                <label for="name">Nom complet *</label>
                                <input
                                        type="text"
                                        id="name"
                                        bind:value={formData.name}
                                        required
                                        placeholder="Jean Dupont"
                                />
                            </div>
                            <div class="form-group">
                                <label for="email">Email *</label>
                                <input
                                        type="email"
                                        id="email"
                                        bind:value={formData.email}
                                        required
                                        placeholder="jean@entreprise.com"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="company">Entreprise</label>
                            <input
                                    type="text"
                                    id="company"
                                    bind:value={formData.company}
                                    placeholder="Nom de votre entreprise"
                            />
                        </div>

                        <div class="form-group">
                            <label for="subject">Sujet *</label>
                            <select id="subject" bind:value={formData.subject} required>
                                <option value="general">Question générale</option>
                                <option value="sales">Ventes et tarifs</option>
                                <option value="support">Support technique</option>
                                <option value="demo">Demande de démo</option>
                                <option value="partnership">Partenariat</option>
                                <option value="other">Autre</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="message">Message *</label>
                            <textarea
                                    id="message"
                                    bind:value={formData.message}
                                    required
                                    rows="5"
                                    placeholder="Décrivez votre projet, vos besoins ou votre question..."
                            ></textarea>
                        </div>

                        <button
                                type="submit"
                                class="btn btn-primary w-full {isSubmitting ? 'loading' : ''}"
                                disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                        </button>

                        <p class="text-xs text-slate-500 text-center">
                            En soumettant ce formulaire, vous acceptez notre politique de confidentialité.
                        </p>
                    </form>
                </div>
            </div>

            <!-- Équipe et informations -->
            <div class="space-y-8">
                <!-- Équipe -->
                <div class="bg-white rounded-xl shadow-sm p-8">
                    <h3 class="text-xl font-bold text-slate-800 mb-6">
                        Notre équipe
                    </h3>
                    <div class="space-y-4">
                        {#each team as member (member.name)}
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span class="text-lg">{member.image}</span>
                                </div>
                                <div>
                                    <h4 class="font-medium text-slate-800">{member.name}</h4>
                                    <p class="text-sm text-slate-600">{member.role}</p>
                                    <a href="mailto:{member.email}" class="text-sm text-blue-600 hover:text-blue-800">
                                        {member.email}
                                    </a>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- Horaires -->
                <div class="bg-white rounded-xl shadow-sm p-8">
                    <h3 class="text-xl font-bold text-slate-800 mb-4">
                        Horaires de support
                    </h3>
                    <div class="space-y-3 text-sm">
                        <div class="flex justify-between">
                            <span class="text-slate-600">Lundi - Vendredi</span>
                            <span class="text-slate-800 font-medium">9h00 - 18h00</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-600">Samedi</span>
                            <span class="text-slate-800 font-medium">10h00 - 16h00</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-600">Dimanche</span>
                            <span class="text-slate-500">Fermé</span>
                        </div>
                    </div>

                    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p class="text-sm text-blue-800">
                            <strong>Support d'urgence :</strong> Disponible 24/7 pour les clients Enterprise
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- FAQ rapide -->
<section class="py-16 bg-white">
    <div class="container mx-auto px-4">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-slate-800 mb-4">
                Questions fréquentes
            </h2>
            <p class="text-lg text-slate-600">
                Les réponses aux questions les plus courantes
            </p>
        </div>

        <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
                <div>
                    <h4 class="font-semibold text-slate-800 mb-2">Combien de temps pour une réponse ?</h4>
                    <p class="text-slate-600 text-sm">Nous répondons sous 24h pour les demandes générales, sous 4h pour le support technique.</p>
                </div>

                <div>
                    <h4 class="font-semibold text-slate-800 mb-2">Proposez-vous des formations ?</h4>
                    <p class="text-slate-600 text-sm">Oui, nous offrons des formations personnalisées pour tous nos plans Enterprise.</p>
                </div>

                <div>
                    <h4 class="font-semibold text-slate-800 mb-2">Support en français ?</h4>
                    <p class="text-slate-600 text-sm">Absolument ! Notre équipe française vous accompagne dans votre langue.</p>
                </div>
            </div>

            <div class="space-y-6">
                <div>
                    <h4 class="font-semibold text-slate-800 mb-2">Peut-on programmer un rendez-vous ?</h4>
                    <p class="text-slate-600 text-sm">Oui, nous proposons des créneaux de consultation gratuite pour les prospects.</p>
                </div>

                <div>
                    <h4 class="font-semibold text-slate-800 mb-2">Support technique inclus ?</h4>
                    <p class="text-slate-600 text-sm">Le support de base est inclus dans tous les plans, support prioritaire pour Pro+.</p>
                </div>

                <div>
                    <h4 class="font-semibold text-slate-800 mb-2">Assistance à la migration ?</h4>
                    <p class="text-slate-600 text-sm">Nous vous aidons gratuitement à migrer vos données depuis votre ancien système.</p>
                </div>
            </div>
        </div>
    </div>
</section>