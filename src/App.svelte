<script>
	import Tailwind from "./Tailwind.svelte";
	import { dndzone } from "svelte-dnd-action";
  import { writable } from "svelte/store";

	const app = writable({
    columns: []
  });

	let theApp

	app.subscribe((i)=>{theApp = i})

  let textInput = '';
  let inputEmpty = false;

  function createColumn(title) {
    if (textInput !== '') {
      inputEmpty = false;
      let obj = {
        title,
        id: generateId(), // generate random id
        items: []
      };
      app.columns.push(obj);
      textInput = ''; // Clear the input after adding column
    } else {
      inputEmpty = true;
    }
	
  }

  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  function addItem(columnId) {
    const itemText = prompt("Enter item text:");
    if (itemText) {
      const column = app.columns.find(col => col.id === columnId);
      if (column) {
        column.items.push({ id: generateId(), text: itemText });
      }
    }
  }

	function handleDrop({ items, info }) {
    app.update(current => {
      const { source, destination } = info;
      const sourceColumn = current.columns.find(col => col.id === source.droppableId);
      const destinationColumn = current.columns.find(col => col.id === destination.droppableId);

      if (sourceColumn && destinationColumn) {
        // Remove item from source column
        const [movedItem] = sourceColumn.items.splice(source.index, 1);

        // Add item to destination column
        destinationColumn.items.splice(destination.index, 0, movedItem);
      }

      return current;
    });
  }

	
</script>

{#if inputEmpty}
	<p class="text-red-400">Need to name the column</p>
{/if}

<input bind:value={textInput} placeholder="Enter column title">
<button on:click={() => createColumn(textInput)}>Create Column</button>

{#each app.columns as column}
  <div>
    <h3>{column.title}</h3>
    <button on:click={() => addItem(column.id)}>Add Item</button>
    <div
      class="column"
      use:dndzone={{ items: column.items, flipDurationMs: 0, dropFromOthersDisabled: false, dropTargetStyle: {}, centreDraggedOnCursor: true }}
      on:consider={handleDrop}
      on:finalize={handleDrop}
    >
      {#each column.items as item}
        <p>{item.text}</p>
      {/each}
    </div>
  </div>
{/each}

<style>
  .column {
    border: 1px solid #ccc;
    padding: 1em;
    margin-bottom: 1em;
    min-height: 100px; /* To ensure there's space to drop items */
  }
  [draggable="true"] {
    cursor: grab;
  }
</style>

<Tailwind />
