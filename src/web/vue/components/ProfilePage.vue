<template>
  <div class="h-card">
    <h1 class="p-name">
      <a
        class="u-url"
        rel="me"
        :href="url"
      >{{ username }}</a>
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
      'url',
      'links',
    ],
  };
</script>
