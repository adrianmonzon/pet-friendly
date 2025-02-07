<template>
  <div class="p-4">
    <h1 class="text-xl font-bold">Add a Pet-Friendly Restaurant</h1>
    <form class="mt-4">
      <div class="mb-4">
        <label for="name" class="block font-semibold">Name</label>
        <input type="text" id="name" class="w-full border p-2 rounded" />
      </div>
      <div class="mb-4">
        <label for="description" class="block font-semibold">Description</label>
        <textarea id="description" class="w-full border p-2 rounded"></textarea>
      </div>
      <div class="mb-4">
        <label for="address" class="block font-semibold">Address</label>
        <input type="text" id="address" class="w-full border p-2 rounded" />
      </div>
      <div class="mb-4">
        <label for="petPolicy" class="block font-semibold">Pet Policy</label>
        <textarea id="petPolicy" class="w-full border p-2 rounded"></textarea>
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
    </form>
  </div>
</template>