<script lang="ts">
    import '../app.css';
    import FlashMessage from '$lib/components/protected/flash-message.svelte';
    import type {LayoutProps} from "./$types";


    let { children, data }: LayoutProps = $props();
</script>


<FlashMessage flashMessage={data.flashMessage} />

<div class="min-h-screen">
    {@render children()}
</div>