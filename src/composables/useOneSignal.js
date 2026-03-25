// src/composables/useOneSignal.js
import { ref } from 'vue'

const isInitialized = ref(false)
const isSubscribed = ref(false)
const userId = ref(null)

export function useOneSignal() {
  const init = async (appId) => {
    if (isInitialized.value) return

    window.OneSignalDeferred = window.OneSignalDeferred || []

    await new Promise((resolve) => {
      window.OneSignalDeferred.push(async (OneSignal) => {
        await OneSignal.init({
          appId: appId,
          safari_web_id: 'web.onesignal.auto.4d1813bb-fb28-4cd6-9039-144582b81585', // opsional, hapus kalau gak perlu
          notifyButton: {
            enable: false, // kita handle sendiri UI-nya
          },
          allowLocalhostAsSecureOrigin: true, // untuk development
        })

        // Cek status subscription
        const permission = await OneSignal.Notifications.permission
        isSubscribed.value = permission

        // Ambil user ID
        const id = await OneSignal.User.PushSubscription.id
        userId.value = id

        isInitialized.value = true
        resolve()
      })
    })
  }

  const subscribe = async () => {
    if (window.OneSignalDeferred) {
      window.OneSignalDeferred.push(async (OneSignal) => {
        // Gunakan Slidedown prompt agar browser memahami konteks klik User
        await OneSignal.Slidedown.promptPush({ force: true })
        
        const permission = await OneSignal.Notifications.permission
        isSubscribed.value = permission

        if (permission) {
          const id = await OneSignal.User.PushSubscription.id
          userId.value = id
        }
      })
    }
  }

  const unsubscribe = async () => {
    window.OneSignalDeferred.push(async (OneSignal) => {
      await OneSignal.User.PushSubscription.optOut()
      isSubscribed.value = false
      userId.value = null
    })
  }

  const setExternalId = (externalId) => {
    window.OneSignalDeferred.push(async (OneSignal) => {
      await OneSignal.login(externalId) // link ke user ID sistem kamu
    })
  }

  const addTag = (key, value) => {
    window.OneSignalDeferred.push(async (OneSignal) => {
      await OneSignal.User.addTag(key, value)
    })
  }

  return {
    isInitialized,
    isSubscribed,
    userId,
    init,
    subscribe,
    unsubscribe,
    setExternalId,
    addTag,
  }
}