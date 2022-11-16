export default async function ({ store, redirect, route }) {
  await store.dispatch('fire/loadMyApp')
  console.log('login now')
}
