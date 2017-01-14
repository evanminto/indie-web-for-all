<template>
  <div class="h-feed">
    <div class="p-author h-card">
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

    <section>
      <ul>
        <li v-for="note in notes">
          <note-object :note="note"></note-object>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
  import NoteObjectComponent from './NoteObject.vue';

  export default {
    name: 'profile-page',
    props: [
      'links',
      'notes',
      'url',
      'username',
    ],
    components: {
      'note-object': NoteObjectComponent,
    },
  };
</script>
