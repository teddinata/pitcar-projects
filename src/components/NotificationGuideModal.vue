<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity ease-linear duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-linear duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="show" 
        class="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[100] flex flex-col justify-center sm:justify-center items-center p-4 sm:p-0"
      >
        <div class="bg-white p-6 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl transform transition-all">
          
          <div v-if="type === 'ios-safari'">
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 mx-auto">
              <Compass class="w-6 h-6 text-blue-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2 text-center">Safari Mendeteksi</h3>
            <p class="text-sm text-gray-600 mb-5 text-center leading-relaxed">
              Apple mengharuskan aplikasi diinstal ke Layar Utama (Home Screen) untuk dapat menerima Web Push Notification.
            </p>
            
            <div class="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
              <ol class="list-decimal pl-4 space-y-3 text-sm text-gray-700">
                <li>Tekan tombol <strong>Share</strong> <Share class="w-4 h-4 inline text-blue-500 mb-1" /> di menu navigasi bawah Safari.</li>
                <li>Geser ke bawah dan pilih <strong>"Add to Home Screen"</strong> <PlusSquare class="w-4 h-4 inline text-gray-600 mb-1" />.</li>
                <li>Buka aplikasi Pitcar dari ikon barunya di Layar Utama HP Anda.</li>
              </ol>
            </div>
          </div>

          <div v-else-if="type === 'insecure'">
            <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4 mx-auto">
              <ShieldAlert class="w-6 h-6 text-orange-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2 text-center">Koneksi Tidak Aman</h3>
            <p class="text-sm text-gray-600 mb-5 text-center leading-relaxed">
              Fitur Notifikasi membutuhkan koneksi <strong>HTTPS</strong>. Jika Anda mengakses lewat IP Lokal, browser HP Anda akan memblokir fitur notifikasi secara otomatis demi keamanan. Minta tim IT mendeploy aplikasi ini ke domain HTTPS.
            </p>
          </div>
          
          <div v-else>
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
              <AlertCircle class="w-6 h-6 text-red-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2 text-center">{{ title }}</h3>
            <p class="text-sm text-gray-600 mb-5 text-center leading-relaxed">{{ message }}</p>
          </div>

          <button @click="$emit('close')" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3.5 px-4 rounded-xl transition-colors text-sm">
            Saya Mengerti
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { Share, PlusSquare, Compass, ShieldAlert, AlertCircle } from 'lucide-vue-next'

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String, // 'ios-safari' | 'insecure' | 'error'
    default: 'error'
  },
  title: {
    type: String,
    default: 'Peringatan'
  },
  message: {
    type: String,
    default: 'Terjadi kesalahan sistem.'
  }
})

defineEmits(['close'])
</script>
