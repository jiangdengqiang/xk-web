<template>
    <div id="header">
        <div>{{greeting}}</div>
    </div>
</template>
<script>
    export default {
        name: 'Header',
        data(){
            return {
                greeting:"这个事导航栏"
            }
        }
    }
</script>
