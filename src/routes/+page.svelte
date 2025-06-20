<script lang="ts">
  import { formA, formB } from '$lib/data';
	import DynamicFrom from '../component/dynamic-from.svelte';
  
  let selectedForm = $state(formA);
  let submittedData = $state<Record<string, string> | null>(null);
  console.log('Selected Form:', selectedForm);

  function handleFormSubmit(data: Record<string, string>) {
    submittedData = data;
    console.log('Form submitted:', data);
  }

  function resetForm() {
    submittedData = null;
  }
</script>

<main class="min-h-screen bg-gray-50">
  {#if !submittedData}
  
    

    <!-- Dynamic Form -->
    <DynamicFrom form={selectedForm} onSubmit={handleFormSubmit} />
  {:else}
    <!-- Success Page -->
    <div class="flex items-center justify-center min-h-screen">
      <div class="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Form Submitted!</h2>
        <p class="text-gray-600 mb-6">Thank you for providing your information.</p>
        
        
        <button
          onclick={resetForm}
          class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Submit Another Form
        </button>
      </div>
    </div>
  {/if}
</main>