<template>
  <article class="h-entry">
    <p class="p-name e-content">
      {{ note.content }}
    </p>

    <time class="dt-published">{{ note.publishedAt.format('M/D/YY h:mm A') }}</time>
  </article>
</template>

<script>
  export default {
    name: 'note-object',
    props: [
      'note',
    ],
  };
</script>
