// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  enableMultiTabIndexedDbPersistence,
  doc,
  getDocFromCache,
  getDocFromServer,
  getDocs,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  deleteDoc,
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

/**
 * データベースの設定情報
 * @type {{storageBucket: string, apiKey: string, messagingSenderId:
 *     string, appId: string, projectId: string, databaseURL: string, authDomain: string}}
 */
const firebaseConfig = {
  apiKey: 'AIzaSyBcX6DLb34dpg9MUBmmce-HJtEPHQSeAuY',
  authDomain: 'ifnanfaapp2.firebaseapp.com',
  projectId: 'ifnanfaapp2',
  storageBucket: 'ifnanfaapp2.appspot.com',
  messagingSenderId: '603579018350',
  appId: '1:603579018350:web:843cb38707702de7740a7f',
  measurementId: 'G-5VRCVZTEWK',
}

/**
 * firebaseの初期化
 * @type {FirebaseApp}
 */
export const firebase = initializeApp(firebaseConfig)

/**
 * キャッシュサイズを最大化
 * @type {Firestore}
 */
const firestore = initializeFirestore(firebase, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
})

/**
 * オフラインキャッシュを有効化
 */
enableMultiTabIndexedDbPersistence(firestore).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log(
      '// Multiple tabs open, persistence can only be enabled ' +
        '            // in one tab at a a time. '
    )
  } else if (err.code === 'unimplemented') {
    console.log(
      '// The current browser does not support all of the' +
        '// features required to enable persistence'
    )
  }
  throw err
})

// firestore.enablePersistence({synchronizeTabs:true})

export const firestoreDb = firestore

/**
 * fireStoreの初期化
 * @type {FirebaseStorage}
 */
export const storage = getStorage(firebase)

export async function fireGetDoc(collectionId, docId) {
  const ref = await doc(firestoreDb, collectionId, docId)
  const docSnap = await getDoc(ref).catch((err) => {
    console.error(err)
  })
  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.log('getData fail: no data in Cache or Server')
    return ''
  }
}

export async function fireGetDocLocalFirst(collectionId, docId) {
  const ref = await doc(firestoreDb, collectionId, docId)
  console.log('getData from cache')
  const docSnap = await getDocFromCache(ref).catch(async () => {
    console.log('getData fail: no data in Cache. getData from fireBase')
    return await getDocFromServer(ref)
  })
  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.log('getData fail: no data in Cache or Server')
    return ''
  }
}

export async function fireGetDocRemoteFirst(collectionId, docId) {
  const ref = await doc(firestoreDb, collectionId, docId)
  console.log('getData from server')
  const docSnap = await getDocFromServer(ref).catch((err) => {
    console.log('getData fail: no remote access. getData from local cache')
    console.log(err)
  })
  if (docSnap.exists()) {
    console.log(docSnap.data())
    return docSnap.data()
  } else {
    console.log('getData fail: no data in Cache or Server')
    return ''
  }
}

export async function fireGetDocRemoteOnly(collectionId, docId) {
  const ref = await doc(firestoreDb, collectionId, docId)
  console.log('getData from server')
  const docSnap = await getDocFromServer(ref).catch((err) => {
    console.error(err)
    throw new Error('getData fail: no internet access.')
  })
  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.log('getData fail: no data in Server')
    return ''
  }
}

export async function getFileList(myCollection, returnValue = 1) {
  const res = []
  const querySnapshot = await getDocs(collection(firestoreDb, myCollection))
  querySnapshot.forEach((item) => {
    if (returnValue === 2) {
      res.push({
        id: item.id,
        name: item.data().user.displayName,
      })
    } else {
      res.push(item.id)
    }
  })
  return res
}

export async function getDocByName(displayName) {
  const q = query(
    collection(firestoreDb, 'users'),
    where('user.displayName', '==', displayName)
  )
  const querySnapshot = await getDocs(q)
  const res = []
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    res.push(doc.data())
  })
  return res
}

export async function getAuthAccountByEmail(email) {
  // #TODO getUserByEmailが使えない問題への対応
  return await getAuth()
    .getUserByEmail(email)
    .catch((err) => {
      console.log('Error fetching user data:', err)
      return false
    })
}

export async function removeUserByName(displayName) {
  const docBody = await getDocByName(displayName)
  const docName = docBody[0].user.uid

  if (docName) {
    // 単一のドキュメントリファレンスを取得
    const docRef = doc(firestoreDb, 'users', docName)
    // 削除
    await deleteDoc(docRef)
    console.log('user document have successfully been deleted')

    getAuth()
      .deleteUser(docName)
      .then(() => {
        console.log('Successfully deleted user')
      })
      .catch((error) => {
        console.log('Error deleting user:', error)
      })
    console.log('user auth account have successfully been deleted')

    return true
  } else {
    return false
  }
}

export async function fireSaveDoc(collectionId, docId, myDoc) {
  const ref = doc(firestoreDb, collectionId, docId)
  await setDoc(ref, myDoc).catch((err) => {
    throw new Error('Error in fireSaveQuestions:' + err)
  })
}
