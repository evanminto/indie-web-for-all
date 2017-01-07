<template>
  <div class="h-card">
    <h1 class="p-name">
      <router-link
        class="u-url"
        rel="me"
        :to="path"
      >{{ username }}</router-link>
    </h1>

    <ul>
      <li v-for="link in links">
        <a :href="link.url" :rel="link.rel">{{ link.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: [
      'username',
      'path',
      'links',
    ],
  };
</script>
