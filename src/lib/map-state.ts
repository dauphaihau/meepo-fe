import { computed } from 'vue'
// import { useStore } from 'vuex'
import { key, useStore } from "@/store";

// export const mapState = () => {
//   const store = useStore()
//   console.log('dauphaihau debug: store-', store.state.openLoginDialog)
//   return Object.fromEntries(
//     Object.keys(store.state).map(
//       key => [key, computed(() => store.state[key])]
//     )
//   )
// }

export const mapGetters = () => {
  // const store = useStore()
  const store = useStore()
  return Object.fromEntries(
    Object.keys(store.getters).map(
      getter => [getter, computed(() => store.getters[getter])]
    )
  )
}

export const mapMutations = () => {
  const store = useStore()
  return Object.fromEntries(
    Object.keys(store._mutations).map(
      mutation => [mutation, value => store.commit(mutation, value)]
    )
  )
}

export const mapActions = () => {
  const store = useStore()
  return Object.fromEntries(
    Object.keys(store._actions).map(
      action => [action, value => store.dispatch(action, value)]
    )
  )
}

// export const mapGetters = (module: string | undefined) => {
//   const store = useStore();
//   // const store = useStore(key);
//   return Object.fromEntries(
//     Object.keys(store.getters).map(getter =>
//       module !== undefined && getter.startsWith(module)
//         ? [getter.substring(module.length + 1), computed(() => store.getters[getter])]
//         : [getter, computed(() => store.getters[getter])]
//     )
//   );
// };

// export const mapMutations = (module: string | undefined) => {
//   const store = useStore();
//   return Object.fromEntries(
//     Object.keys(store._mutations[module]).map(mutation =>
//       module !== undefined && mutation.startsWith(module)
//         ? [mutation.substring(module.length + 1), (value: any) => store.commit(mutation, value)]
//         : [mutation, (value: any) => store.commit(mutation, value)]
//     )
//   );
// };

// export const mapActions = (module: string | undefined) => {
//   const store = useStore();
//   return Object.fromEntries(
//     Object.keys(store._actions).map(action =>
//       module !== undefined && action.startsWith(module)
//         ? [action.substring(module.length + 1), (value: any) => store.dispatch(action, value)]
//         : [action, (value: any) => store.dispatch(action, value)]
//     )
//   );
// };


