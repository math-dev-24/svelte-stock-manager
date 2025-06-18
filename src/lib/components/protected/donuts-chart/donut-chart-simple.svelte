<script lang="ts">
    import { onMount } from 'svelte';
    
    interface ChartData {
        label: string;
        value: number;
        color?: string;
    }

    interface Props {
        data: ChartData[];
        title?: string;
    }

    let { data, title }: Props = $props();
    let canvas: HTMLCanvasElement;

    onMount(async () => {
        try {
            // Import dynamique de Chart.js avec tous les éléments nécessaires
            const { Chart, ArcElement, Tooltip, Legend, DoughnutController } = await import('chart.js');
            
            // Enregistrer tous les éléments nécessaires
            Chart.register(ArcElement, Tooltip, Legend, DoughnutController);
            
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Données simplifiées
            const chartData = {
                labels: data.map(item => item.label),
                datasets: [{
                    data: data.map(item => item.value),
                    backgroundColor: [
                        '#374151', // gray-700 - gris sombre
                        '#6B7280', // gray-500 - gris moyen
                        '#9CA3AF', // gray-400 - gris pâle
                        '#D1D5DB', // gray-300 - gris très pâle
                        '#F3F4F6', // gray-100 - gris très clair
                        '#1F2937', // gray-800 - gris très sombre
                        '#4B5563', // gray-600 - gris foncé
                        '#E5E7EB', // gray-200 - gris clair
                        '#FECACA', // rose pastel
                        '#FED7AA', // orange pastel
                        '#FEF3C7', // jaune pastel
                        '#D1FAE5', // vert pastel
                        '#DBEAFE', // bleu pastel
                        '#E0E7FF', // violet pastel
                        '#FCE7F3', // rose poudré
                        '#F3E8FF'  // lavande pastel
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            };

            new Chart(ctx, {
                type: 'doughnut',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    },
                    cutout: '60%'
                }
            });
            
            console.log('Simple chart created successfully');
        } catch (error) {
            console.error('Error creating simple chart:', error);
        }
    });
</script>

<div class="chart-container">
    {#if title}
        <h3 class="text-lg font-semibold text-slate-800 mb-4 text-center">{title}</h3>
    {/if}
    
    <div class="relative h-64">
        <canvas bind:this={canvas}></canvas>
    </div>
    
    {#if data.length === 0}
        <div class="flex items-center justify-center h-64 text-slate-500">
            <p>Aucune donnée disponible</p>
        </div>
    {/if}
</div>

<style>
    .chart-container {
        position: relative;
    }
</style> 