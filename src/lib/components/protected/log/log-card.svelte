<script lang="ts">
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";

    let {log} = $props();

    const date = new Date(log.createdAt);
</script>

<Card>
    <CardHeader>
        <CardTitle>{log.message}</CardTitle>
    </CardHeader>
    <CardContent>
        <p class="text-sm text-muted-foreground">{date.toLocaleString()}</p>
    </CardContent>
</Card>