export default async function ({ store, redirect, route }) {
  /**
   * ログイン状態をチェックし、ログインしていなければログイン画面にリダイレクト
   * ログイン後にmyAppのfetch
   * forcedUpdateInfoを確認して、更新情報があればnavbarに表示(checkUpdate)
   */
  // 永続化したログイン情報を取得する
  let user
  const location = route.name
  user = await store.dispatch('fire/getCurrentLogin').catch((err) => {
    console.error(err)
    user = null
  })

  // ログイン情報が取得できた場合
  if (user) {
    // ログイン状態を更新
    await store.dispatch('fire/updateIsLoggedIn', true)

    // firebaseからmyAppを読み込む
    await store.dispatch('fire/loadMyApp')
  }

  // ログイン情報が取得できない場合
  // 特定のページ以外はホーム画面に戻る
  else if (
    !location.includes('userLogin') &&
    !location.includes('userReg') &&
    !location.includes('tool') &&
    !location.includes('index')
  ) {
    alert('please login/register first to use all functions')
    return redirect('/')
  }
}
