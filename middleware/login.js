export default async function ({ store, redirect, route }) {
  await store.dispatch('fire/loadMyApp')
  await console.log('login now')
}
