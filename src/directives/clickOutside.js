// directives/clickOutside.js
export const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = function(event) {
      // Check if the click was outside the element and its children
      if (!(el === event.target || el.contains(event.target))) {
        // Call the provided method
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
}