<template>

</template>

<script>
import { toRaw } from 'vue';

export default {
    name: 'updates',
    data() {
        return{
        updates: []
        }
    },
    methods: {
        async fetchUpdates() {
            try {
                const response = await fetch('http://localhost:8080/featureupdates');
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                this.updates = await response.json();

                console.log("updates: ", this.updates);

            } catch (error) {
                console.error("Error fetching updates:", updates.updates);
            }
        }
    },
    mounted() {
        this.fetchUpdates();
        console.log(this.updates);
    }
}

</script>