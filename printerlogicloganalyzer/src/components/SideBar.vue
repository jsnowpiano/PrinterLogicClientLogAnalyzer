<template>
    <VNavigationDrawer
        expand-on-hover rail>
    
        <VList>
            <VListItem
                prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
                title="Sandra Adams"
                subtitle="sandra_a88@gmail.com"
            >
            </VListItem>
        </VList>
        <VDivider />

        <VList density="compact" nav>
            <VListItem
                prepend-icon="mdi-image"
                title="Color Gallery"
                value="color"
            />
            <VListItem
                prepend-icon="mdi-dialpad"
                title="Grayspace Gallery"
                value="color"
            />
        </VList>
    </VNavigationDrawer>
</template>