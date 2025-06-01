<script lang="ts">

    let {product} = $props();
</script>

<div class="card">
    <div class="card-body">
        <h2 class="card-title">{product.name}</h2>
        <p class="card-text">SKU: {product.sku}</p>
        <p class="card-text text-sm italic">Stock minimum: {product.minStock}</p>
        <div class="grid grid-cols-2 gap-2 mt-2">
            <a
                    href="/products/form?type=update&id={product.id}"
                    class="btn btn-primary"
            >
                update
            </a>
            <a
                href="{`/products/form?type=delete&id=${product.id}`}"
                class="btn btn-danger"
            >
                delete
            </a>
        </div>
    </div>
</div>