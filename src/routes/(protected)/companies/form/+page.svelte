<script lang="ts">
    import type {PageProps} from './$types';
    import {page} from "$app/state";

    let { data, form }: PageProps = $props();

    const isUpdateMode = $derived(page.url.searchParams.get('type') === 'update' && data.company);
    const formTitle = $derived(isUpdateMode ? 'Modifier l\'entreprise :' : 'Nouveau l\'entreprise :');
    const submitButtonText = $derived(isUpdateMode ? 'Mettre à jour' : 'Créer');

</script>

<section class="container mx-auto px-4 py-8 max-w-2xl rounded border border-slate-200 bg-white shadow-sm">
    <h1 class="text-2xl font-bold text-slate-800 mb-6">
        {formTitle}
    </h1>

    <form
            class="space-y-6"
            method="POST"
            action={isUpdateMode ? '?/update' : '?/create'}
    >

        <div class="form-group">
            <label for="name">Nom de l'entreprise <span class="text-red-500">*</span></label>
            <input
                    type="text"
                    id="name"
                    name="name"
                    required
            />
        </div>

        <div class="form-group">
            <label for="email">Email <span class="text-red-500">*</span></label>
            <input
                    type="email"
                    id="email"
                    name="email"
                    required
            />
        </div>

        <div class="form-group">
            <label for="phone">Téléphone <span class="text-red-500">*</span></label>
            <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
            />
        </div>

        <button
                class="btn btn-primary w-full"
        >
            {submitButtonText}
        </button>

    </form>

    {#if form?.message}
        <div class={`callout callout-${form.type}`}>{form.message}</div>
    {/if}

</section>