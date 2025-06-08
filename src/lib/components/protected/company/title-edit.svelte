<script lang="ts">
    import {Input} from "$lib/components/ui/input";
    import {Button} from "$lib/components/ui/button";
    import {enhance} from "$app/forms";
    import {Loader2, PencilIcon, XIcon} from "lucide-svelte";

    let { title } = $props();

    let isEditing = $state<boolean>(false);
    let isLoading = $state<boolean>(false);

    function handleEdit() {
        isEditing = true;
    }

</script>


{#if isEditing}
    <form
    class="flex items-center gap-2 m-0 p-0"
    method="post"
    action="?/updateTitle"
    use:enhance={() => {
        isLoading = true;
        return async ({update}) => {
            await update();
            isLoading = false;
            isEditing = false;
        }
    }}
    >
        <Input type="text" bind:value={title} />
        <Button type="submit" disabled={isLoading}>
            {#if isLoading}
                <Loader2 className="w-4 h-4 animate-spin" />
            {:else}
                Enregistrer
            {/if}
        </Button>
        <Button onclick={() => isEditing = false} variant="ghost">
            <XIcon className="w-4 h-4" />
        </Button>
    </form>
{:else}
    <div class="flex items-center gap-2">
        <h1 class="text-2xl font-bold text-gray-800">{title}</h1>
        <Button onclick={handleEdit} variant="ghost">
            <PencilIcon className="w-4 h-4" />
        </Button>
    </div>
{/if}