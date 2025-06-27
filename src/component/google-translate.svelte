<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  let scriptLoaded = false;
  let translateVisible = false;
  let currentLanguage = 'English';
  let googleTranslateElement: any;

  onMount(() => {
    if (browser && !scriptLoaded) {
      (window as any).googleTranslateElementInit = () => {
        googleTranslateElement = new (window as any).google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,es,fr,de,it,pt,ru,ja,ko,zh,ar,hi',
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
  });
  
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
        background: rgba(31, 41, 55, 0.8) !important;
        border: 2px solid #374151 !important;
        border-radius: 0.75rem !important;
        color: white !important;
        padding: 0.5rem 1rem !important;
        font-size: 0.875rem !important;
        backdrop-filter: blur(4px) !important;
        transition: all 0.3s ease !important;
      }
      .goog-te-combo:hover {
        border-color: #DC2626 !important;
        background: rgba(31, 41, 55, 0.9) !important;
      }
      .goog-te-combo:focus {
        outline: none !important;
        border-color: #DC2626 !important;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
      }
      .goog-te-gadget-simple { 
        background: white !important;
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
      // Load the Google Translate script if not already loaded
      (window as any).googleTranslateElementInit = () => {
        googleTranslateElement = new (window as any).google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,es,fr,de,it,pt,ru,ja,ko,zh,ar,hi',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true
        }, 'google_translate_element');
        
        setTimeout(styleGoogleTranslateWidget, 1000);
      };
      
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    }
  }
  
  function changeLanguage(code: string) {
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change'));
    }
  }
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
  ];
</script>

<div class="fixed top-8 left-8 z-50">
  <div class="relative">
    <button
      on:click={toggleTranslate}
      class="group flex items-center px-4 py-3 bg-gray-900/80 border-2 border-gray-700 rounded-xl text-gray-300 hover:border-red-500/70 hover:bg-gray-900/90 transition-all duration-300 backdrop-blur-sm shadow-lg"
      class:border-red-500={translateVisible}
      class:bg-red-900={translateVisible}
    >
      <svg class="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
      </svg>
      <span class="font-medium text-sm">Translate</span>
      <svg class="w-4 h-4 ml-2 transition-transform duration-300" class:rotate-180={translateVisible} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
    
    {#if translateVisible}
      <div class="absolute top-full left-0 mt-2 w-72 bg-gray-900/95 border-2 border-gray-700 rounded-xl shadow-2xl backdrop-blur-sm overflow-hidden animate-in slide-in-from-top-2 duration-300">
        <div class="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-gradient-to-r from-red-600 to-red-500 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-white text-sm">Language Selector</h3>
              <p class="text-gray-400 text-xs">Choose your preferred language</p>
            </div>
          </div>
        </div>
        
        <div class="p-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              🌐 Select Language:
            </label>
            <div id="google_translate_element" class="google-translate-container"></div>
          </div>
          
          <div class="grid grid-cols-2 gap-2 mt-4">
            {#each languages.slice(0, 6) as lang}
              <button
                on:click={() => changeLanguage(lang.code)}
                class="flex items-center px-3 py-2 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-600 hover:border-red-500/50 rounded-lg text-gray-300 hover:text-white transition-all duration-300 text-sm"
              >
                <span class="mr-2">{lang.flag}</span>
                <span class="font-medium">{lang.name}</span>
              </button>
            {/each}
          </div>
          
          <div class="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div class="flex items-center text-red-300">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-sm font-medium">Current: {currentLanguage}</span>
            </div>
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