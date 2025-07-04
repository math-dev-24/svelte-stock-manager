<script lang="ts">
    const {data} = $props();
</script>
<h1>Inventory of {data.selectedCompany?.name}</h1>

<div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
        <h2 class="text-lg font-bold">Inventory</h2>
    </div>
</div>