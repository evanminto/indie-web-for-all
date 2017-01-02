<template>
  <div class="h-card">
    <h1 class="p-nickname">
      <router-link
        class="u-url"
        rel="me"
        :to="path"
      >{{ username }}</router-link>
    </h1>
  </div>
</template>

<script>
  export default {
    props: [
      'username',
      'path',
    ],
  };
</script>
