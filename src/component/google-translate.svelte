<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  let scriptLoaded = false;
  let translateVisible = false;
  let currentLanguage = 'English';
  let googleTranslateElement: any;

  onMount(() => {
    if (browser && !scriptLoaded) {
      loadGoogleTranslate();
    }
  });
  
  function loadGoogleTranslate() {
    (window as any).googleTranslateElementInit = () => {
      googleTranslateElement = new (window as any).google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es,fr,de,it',
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
        multilanguagePage: true
      }, 'google_translate_element');
      
      // Listen for language change events
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.addEventListener('change', handleLanguageChange);
      }
      
      setTimeout(styleGoogleTranslateWidget, 1000);
    };
    
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onload = () => {
      scriptLoaded = true;
    };
    document.head.appendChild(script);
  }
  
  function handleLanguageChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedLanguage = languages.find(lang => lang.code === select.value);
    if (selectedLanguage) {
      currentLanguage = selectedLanguage.name;
    }
  }
  
  function styleGoogleTranslateWidget() {
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-banner-frame { display: none !important; }
      .goog-te-menu-value { color: white !important; }
      .goog-te-gadget { font-family: inherit !important; }
      .goog-te-combo { 
        background: #374151 !important;
        border: 1px solid #6B7280 !important;
        border-radius: 0.5rem !important;
        color: white !important;
        padding: 0.5rem !important;
        font-size: 0.875rem !important;
        width: 100% !important;
      }
      .goog-te-combo:hover {
        border-color: #DC2626 !important;
      }
      .goog-te-combo:focus {
        outline: none !important;
        border-color: #DC2626 !important;
      }
      .goog-te-gadget-simple { 
        background: transparent !important;
        border: none !important;
        font-size: 0.875rem !important;
      }
      .goog-te-menu-value span { color: #D1D5DB !important; }
      .goog-te-menu-value span:first-child { display: none; }
      body { top: 0 !important; }
      .goog-te-balloon-frame { display: none !important; }
    `;
    document.head.appendChild(style);
  }
  
  function toggleTranslate() {
    translateVisible = !translateVisible;
    if (translateVisible && !scriptLoaded) {
      loadGoogleTranslate();
    }
  }
  
  function changeLanguage(code: string) {
    // Update current language display
    const selectedLanguage = languages.find(lang => lang.code === code);
    if (selectedLanguage) {
      currentLanguage = selectedLanguage.name;
    }
    
    // Directly trigger Google Translate
    if ((window as any).google && (window as any).google.translate) {
      const translateElement = (window as any).google.translate.TranslateElement;
      if (translateElement) {
        // Create a temporary select element to trigger translation
        const tempSelect = document.createElement('select');
        tempSelect.value = code;
        
        // Find the actual Google Translate select and update it
        const googleSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (googleSelect) {
          googleSelect.value = code;
          googleSelect.dispatchEvent(new Event('change'));
        }
        
        // Alternative method: directly call Google Translate API
        if ((window as any).googleTranslateElementInit) {
          // Force translation by triggering the Google Translate widget
          const translateWidget = document.querySelector('#google_translate_element');
          if (translateWidget) {
            // Simulate user interaction with the Google Translate widget
            const event = new Event('change', { bubbles: true });
            googleSelect?.dispatchEvent(event);
          }
        }
      }
    }
    
    // Close the dropdown after selection
    translateVisible = false;
  }
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ];
</script>

<div class="fixed top-8 left-8 z-50">
  <div class="relative">
    <button
      on:click={toggleTranslate}
      class="flex items-center px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 hover:border-red-500 transition-all duration-300"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
      </svg>
      <span class="font-medium">Translate</span>
      <svg class="w-4 h-4 ml-2 transition-transform duration-300" class:rotate-180={translateVisible} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
    
    {#if translateVisible}
      <div class="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
        <div class="p-4 border-b border-gray-600">
          <h3 class="font-bold text-white text-sm">Select Language</h3>
        </div>
        
        <div class="p-4">
          <div class="mb-4">
            <div id="google_translate_element"></div>
          </div>
          
          <div class="space-y-2">
            {#each languages as lang}
              <button
                on:click={() => changeLanguage(lang.code)}
                class="w-full flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-red-500 rounded text-white transition-all duration-300 text-sm"
              >
                <span class="mr-3">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            {/each}
          </div>
          
          <div class="mt-4 p-2 bg-gray-700 rounded text-center">
            <span class="text-sm text-gray-300">Current: {currentLanguage}</span>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  @keyframes slide-in-from-top-2 {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-in {
    animation-fill-mode: both;
  }
  
  .slide-in-from-top-2 {
    animation-name: slide-in-from-top-2;
  }
  
  .duration-300 {
    animation-duration: 300ms;
  }
  
  :global(.google-translate-container) {
    filter: brightness(1.2) contrast(1.1);
  }
</style>