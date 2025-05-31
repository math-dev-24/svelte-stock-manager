<script lang="ts">
    import type { PageProps } from './$types';
    let { form }: PageProps = $props();
</script>

<h1>Login</h1>

<form
        method="POST"
        action="?/login"
        class="flex flex-col gap-4"
>
    <label for="username">Username</label>
    <input type="text" name="username" id="username" required>
    <label for="password">Password</label>
    <input type="password" name="password" id="password" required>
    <div class="flex justify-end gap-2">
        <button type="submit" class="btn btn-primary" aria-label="Login">Login</button>
        <button formaction="?/register" class="btn btn-secondary" aria-label="Register">Register</button>
    </div>

    {#if form?.message}
        <div class={`callout callout-${form.type}`}>{form.message}</div>
    {/if}
</form>