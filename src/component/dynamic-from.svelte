<script lang="ts">
  import type { Form, Field } from '$lib/types';
	import FieldRender from './field-render.svelte';
  
  interface Props {
    form: Form;
    onSubmit?: (data: Record<string, string>) => void;
  }
  
  let { form, onSubmit }: Props = $props();

  let currentStep = $state(0);
  let formData = $state<Record<string, string>>({});
  let errors = $state<Record<string, string>>({});

  const totalSteps = $derived(form.fields.length);
  const progress = $derived(((currentStep + 1) / totalSteps) * 100);
  const currentField = $derived(form.fields[currentStep]);
  const isLastStep = $derived(currentStep === totalSteps - 1);
  const isFirstStep = $derived(currentStep === 0);

  function validateField(field: Field, value: string): string | null {
    if (field.required && (!value || value.trim() === '')) {
      return 'This field is required';
    }

    if (!value) return null;

    switch (field.type) {
      case 'zip_code':
        if (!/^\d{5}(-\d{4})?$/.test(value)) {
          return 'Please enter a valid ZIP code';
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'date':
        const parts = value.split('/');
        if (parts.length !== 3) {
          return 'Please enter date in MM/DD/YYYY format';
        }
        const [month, day, year] = parts.map(Number);
        if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > new Date().getFullYear()) {
          return 'Please enter a valid date';
        }
        break;
      case 'number':
        if (isNaN(Number(value)) || Number(value) < 0) {
          return 'Please enter a valid number';
        }
        break;
    }

    return null;
  }

  function nextStep() {
    const field = currentField;
    const value = formData[field.id] || '';
    const error = validateField(field, value);

    if (error) {
      errors[field.id] = error;
      return;
    }

    errors[field.id] = '';

    if (isLastStep) {
      handleSubmit();
    } else {
      currentStep++;
    }
  }

  function prevStep() {
    if (!isFirstStep) {
      currentStep--;
    }
  }

  function handleSubmit() {
    onSubmit?.(formData);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      nextStep();
    }
  }

  // Initialize form data with default values
  $effect(() => {
    form.fields.forEach(field => {
      if (field.default && !formData[field.id]) {
        formData[field.id] = field.default;
      }
    });
  });
</script>

<div class="flex flex-col min-h-screen max-w-2xl mx-auto p-6 bg-white" role="form">
  <!-- Progress Bar -->
  <div class="w-full h-2 bg-gray-200 rounded-full mb-8">
    <div 
      class="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
      style="width: {progress}%"
    ></div>
  </div>

  <!-- Form Header -->
  <div class="mb-8">
    {#if form.caption}
      <p class="text-blue-600 font-medium mb-2">{form.caption}</p>
    {/if}
    <h1 class="text-3xl font-bold text-gray-900 mb-4">{form.title}</h1>
    {#if form.description}
      <p class="text-gray-600">{form.description}</p>
    {/if}
  </div>

  <!-- Current Question -->
  <div class="flex-grow">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 leading-tight">
        {currentField.title}
      </h2>
      
      {#if currentField.description}
        <p class="text-gray-600 mb-6">{currentField.description}</p>
      {/if}

      <div role="application">
        <FieldRender
          field={currentField}
          bind:value={formData[currentField.id]}
          error={errors[currentField.id]}
        />
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <div class="flex justify-between items-center pt-6 border-t border-gray-200">
    <button
      onclick={prevStep}
      disabled={isFirstStep}
      class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      Previous
    </button>

    <div class="text-sm text-gray-500">
      {currentStep + 1} of {totalSteps}
    </div>

    <button
      onkeydown={handleKeydown}
      onclick={(event) => { event.preventDefault(); nextStep(); }}
      class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
    >
      {isLastStep ? 'Submit' : 'Next'}
    </button>
  </div>
</div>
