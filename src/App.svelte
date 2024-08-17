<script>
  import Content from "./Content.svelte";
  import Tailwind from "./Tailwind.svelte";
  import { lib } from "./store";

  // Example: Subscribing to the store to initialize and update the `app` variable.
  let app;

  lib().sub((i) => {
    app = i;
  });

  // The `Content.svelte` component is included as a starting point for your application.
</script>

<Content />
<Tailwind />
