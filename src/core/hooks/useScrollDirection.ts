import { onBeforeUnmount, onMounted, ref } from 'vue';

export function useScrollDirection() {
  const scrollYBefore = ref(0);
  const scrollDirection = ref('up');

  onMounted(async () => {
    window.addEventListener('scroll', onScroll);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll);
  });

  function onScroll() {
    const scrollY = window.scrollY;
    const direction = scrollY > scrollYBefore.value ? 'down' : 'up';
    if (
      direction !== scrollDirection.value &&
      (scrollY - scrollYBefore.value > 2 || scrollY - scrollYBefore.value < -2)
    ) {
      scrollDirection.value = direction;
    }
    scrollYBefore.value = scrollY > 0 ? scrollY : 0;
  }
  return scrollDirection;
}
