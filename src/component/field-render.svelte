<script lang="ts">
  import type { Field } from '$lib/types';
  
  interface Props {
    field: Field;
    value: string;
    error?: string;
  }
  
  let { field, value = $bindable(), error }: Props = $props();

  function validateZipCode(zip: string): boolean {
    return /^\d{5}(-\d{4})?$/.test(zip);
  }

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateDate(date: string): boolean {
    const parts = date.split('/');
    if (parts.length !== 3) return false;
    const [month, day, year] = parts.map(Number);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;
    return true;
  }

  function formatDateInput(input: string): string {
    const numbers = input.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  }

  function handleDateInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const formatted = formatDateInput(target.value);
    value = formatted;
    target.value = formatted;
  }
</script>

<div class="field-container">
  {#if field.type === 'short_text'}
    <input
      type="text"
      bind:value
      placeholder="Type your answer here..."
      class="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
      class:border-red-500={error}
    />
  {:else if field.type === 'email'}
    <input
      type="email"
      bind:value
      placeholder="name@example.com"
      class="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
      class:border-red-500={error}
    />
  {:else if field.type === 'zip_code'}
    <input
      type="text"
      bind:value
      placeholder="12345"
      maxlength="10"
      class="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
      class:border-red-500={error}
    />
  {:else if field.type === 'number'}
    <input
      type="number"
      bind:value
      min="0"
      placeholder="Enter a number"
      class="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
      class:border-red-500={error}
    />
  {:else if field.type === 'date'}
    <input
      type="text"
      bind:value
      placeholder="MM/DD/YYYY"
      maxlength="10"
      oninput={handleDateInput}
      class="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
      class:border-red-500={error}
    />
  {:else if field.type === 'choice' && field.choices}
    {#if field.choices.length <= 5}
      <div class="space-y-3">
        {#each field.choices as choice}
          <label class="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors" class:border-blue-500={value === choice.id}>
            <input
              type="radio"
              bind:group={value}
              value={choice.id}
              class="sr-only"
            />
            <div class="w-5 h-5 border-2 border-gray-300 rounded-full mr-3 flex items-center justify-center" class:border-blue-500={value === choice.id}>
              {#if value === choice.id}
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              {/if}
            </div>
            <span class="text-lg">{choice.label}</span>
          </label>
        {/each}
      </div>
    {:else}
      <select
        bind:value
        class="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors appearance-none bg-white"
        class:border-red-500={error}
      >
        <option value="">Select an option...</option>
        {#each field.choices as choice}
          <option value={choice.id}>{choice.label}</option>
        {/each}
      </select>
    {/if}
  {/if}

  {#if error}
    <p class="text-red-500 text-sm mt-2">{error}</p>
  {/if}
</div>
