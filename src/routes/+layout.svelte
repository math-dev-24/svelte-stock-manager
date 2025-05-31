<script lang="ts">
    import '../app.css';

    let { children } = $props();
</script>

<div class="flex flex-col min-h-screen">
    <header class="flex items-center justify-between container mx-auto px-4 py-4">
        <h1 class="text-3xl font-bold flex-1">
            <a href="/">Stock Manager</a>
        </h1>
        <nav class="flex justify-between">
            <a href="/">Stock Manager</a>
            <a href="/login">Login</a>
        </nav>
    </header>
    <main class="flex-1 container mx-auto px-4 py-4">
        {@render children()}
    </main>
</div>
