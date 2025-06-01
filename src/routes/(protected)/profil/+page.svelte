<script lang="ts">
    import type {PageProps} from './$types';

    let {data, form}: PageProps = $props();

    const formData = $state({
        password: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const passwordValidation = $derived.by(() => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(formData.newPassword);
        const hasLowerCase = /[a-z]/.test(formData.newPassword);
        const hasNumbers = /\d/.test(formData.newPassword);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword);

        return {
            minLength: formData.newPassword.length >= minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasSpecialChar,
            isValid: formData.newPassword.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers
        };
    });

    const passwordsMatch = $derived(
        formData.newPassword.length > 0 &&
        formData.confirmNewPassword.length > 0 &&
        formData.newPassword === formData.confirmNewPassword
    );

    const passwordsDifferent = $derived(
        formData.password.length > 0 &&
        formData.newPassword.length > 0 &&
        formData.password !== formData.newPassword
    );

    const canSubmit = $derived(
        formData.password.length > 0 &&
        passwordValidation.isValid &&
        passwordsMatch &&
        passwordsDifferent
    );

    // Messages d'erreur conditionnels
    const showPasswordMismatch = $derived(
        formData.confirmNewPassword.length > 0 && !passwordsMatch
    );

    const showSamePassword = $derived(
        formData.newPassword.length > 0 &&
        formData.password.length > 0 &&
        !passwordsDifferent
    );
</script>

<h1 class="mb-6 text-2xl font-bold text-gray-800">Bonjour, {data.user?.username} 👋</h1>

<form
        method="POST"
        action="?/changePassword"
        class="mx-auto space-y-6 rounded-lg border border-gray-200 bg-white shadow-lg px-6 py-8"
>
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Changer de mot de passe</h2>

    <!-- Mot de passe actuel -->
    <div class="form-group">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe actuel <span class="text-red-500">*</span>
        </label>
        <input
                type="password"
                id="password"
                name="password"
                required
                bind:value={formData.password}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Saisissez votre mot de passe actuel"
        >
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Nouveau mot de passe -->
        <div class="form-group">
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe <span class="text-red-500">*</span>
            </label>
            <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    required
                    bind:value={formData.newPassword}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Saisissez votre nouveau mot de passe"
            >
        </div>
        <!-- Confirmation du nouveau mot de passe -->
        <div class="form-group">
            <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le nouveau mot de passe <span class="text-red-500">*</span>
            </label>
            <input
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    required
                    bind:value={formData.confirmNewPassword}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirmez votre nouveau mot de passe"
            >
        </div>
    </div>

    <!-- Indicateurs de force du mot de passe -->
    {#if formData.newPassword.length > 0}
        <div class="mt-3 space-y-2">
            <div class="text-xs text-gray-600 mb-2">Critères de sécurité :</div>
            <div class="space-y-1">
                <div class="flex items-center gap-2 text-xs">
                        <span class={passwordValidation.minLength ? 'text-green-600' : 'text-red-500'}>
                            {passwordValidation.minLength ? '✅' : '❌'}
                        </span>
                    <span class={passwordValidation.minLength ? 'text-green-700' : 'text-gray-600'}>
                            Au moins 8 caractères
                        </span>
                </div>
                <div class="flex items-center gap-2 text-xs">
                        <span class={passwordValidation.hasUpperCase ? 'text-green-600' : 'text-red-500'}>
                            {passwordValidation.hasUpperCase ? '✅' : '❌'}
                        </span>
                    <span class={passwordValidation.hasUpperCase ? 'text-green-700' : 'text-gray-600'}>
                            Une majuscule
                        </span>
                </div>
                <div class="flex items-center gap-2 text-xs">
                        <span class={passwordValidation.hasLowerCase ? 'text-green-600' : 'text-red-500'}>
                            {passwordValidation.hasLowerCase ? '✅' : '❌'}
                        </span>
                    <span class={passwordValidation.hasLowerCase ? 'text-green-700' : 'text-gray-600'}>
                            Une minuscule
                        </span>
                </div>
                <div class="flex items-center gap-2 text-xs">
                        <span class={passwordValidation.hasNumbers ? 'text-green-600' : 'text-red-500'}>
                            {passwordValidation.hasNumbers ? '✅' : '❌'}
                        </span>
                    <span class={passwordValidation.hasNumbers ? 'text-green-700' : 'text-gray-600'}>
                            Un chiffre
                        </span>
                </div>
            </div>
        </div>
    {/if}

    <!-- Messages de validation -->
    {#if passwordsMatch && formData.confirmNewPassword.length > 0}
        <div class="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-md">
            <span class="text-green-600">✅</span>
            <span class="text-green-700 text-sm">Les mots de passe correspondent</span>
        </div>
    {/if}

    {#if showPasswordMismatch}
        <div class="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-md">
            <span class="text-red-600">❌</span>
            <span class="text-red-700 text-sm">Les mots de passe ne correspondent pas</span>
        </div>
    {/if}

    {#if showSamePassword}
        <div class="flex items-center gap-2 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <span class="text-yellow-600">⚠️</span>
            <span class="text-yellow-700 text-sm">Le nouveau mot de passe doit être différent de l'ancien</span>
        </div>
    {/if}

    <button
            disabled={!canSubmit}
            class={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
            canSubmit
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
    >
        {canSubmit ? 'Mettre à jour le mot de passe' : 'Veuillez remplir tous les critères'}
    </button>

    <!-- Messages du serveur -->
    {#if form?.message}
        <div class={`px-4 py-3 rounded-md border ${
            form.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
        }`}>
            {form.message}
        </div>
    {/if}
</form>