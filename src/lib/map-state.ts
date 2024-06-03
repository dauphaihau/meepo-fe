import { computed } from 'vue';
import { useStore } from '@/store';
import { GetterTypes } from '@/types/store/root';

// export const mapState = () => {
//   const store = useStore()
//   // console.log('store-state-open-login-dialog', store.state.openLoginDialog);
//   return Object.fromEntries(
//     Object.keys(store.state).map(
//       key => [key, computed(() => store.state[key])]
//     )
//   )
// }

export const mapGetters = () => {
  const store = useStore();
  return Object.fromEntries(
    Object.keys(store.getters).map(
      getter => [getter, computed(() => store.getters[getter])]
    )
  ) as { [K in keyof GetterTypes]: any };
};

// export const mapMutations = () => {
//   const store = useStore()
//   return Object.fromEntries(
//     Object.keys(store._mutations).map(
//       mutation => [mutation, value => store.commit(mutation, value)]
//     )
//   )
// }
//

// export const mapActions = () => {
//   const store = useStore()
//   return Object.fromEntries(
//     // Object.keys(store.actions).map(
//     // @ts-ignore
//     Object.keys(store._actions).map(
//       action => [action, value => store.dispatch(action, value)]
//     )
//   )
// }
