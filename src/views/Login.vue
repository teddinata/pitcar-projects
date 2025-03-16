<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
      <div class="w-full max-w-[420px]">
        <div class="text-center mb-8">
          <img src="/pitcar-logo.png" alt="Content Management" class="h-12 mx-auto mb-6" />
          <h2 class="text-2xl font-bold text-gray-900">Welcome to Project Management by PITCAR</h2>
          <p class="text-gray-600 mt-2">Masuk untuk mengakses dasbor proyek Anda</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Database Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <div class="relative">
              <select
                v-model="formData.db"
                class="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required
              >
                <option value="" disabled>Select Branch</option>
                <option value="Pitcar1">Pitcar Service</option>
                <option value="pitcar.bodyrepair">Pitcar Body Repair</option>
                <option value="db_test">Pitcar DB Test</option>
              </select>
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BuildingOfficeIcon class="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div class="relative">
              <input
                type="email"
                v-model="formData.login"
                required
                class="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon class="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="formData.password"
                required
                class="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-gray-400" />
              </div>
              <button
                type="button"
                @click="togglePassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <EyeIcon v-if="showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                <EyeSlashIcon v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                v-model="formData.rememberMe"
                class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" class="text-sm text-red-600 hover:text-red-500 font-medium">Forgot password?</a>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-200 transition-colors disabled:opacity-70 flex justify-center items-center"
          >
            <div v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing in...
            </div>
            <span v-else>Sign in</span>
          </button>
          
          <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {{ error }}
          </div>
        </form>
        
        <div class="mt-8 text-center text-sm text-gray-500">
          <p>Butuh bantuan? Hubungi <a href="https://wa.me/6285155095022?text=Halo%20Tim%20IT%2C%20saya%20butuh%20bantuan%20untuk%20akses%20Project%20Management" target="_blank" class="text-red-600 hover:text-red-500">Tim IT</a></p>
        </div>

        <div class="mt-8 text-center text-xs text-gray-400">
          <p>v{{ version }}</p>
        </div>
      </div>
    </div>

    <!-- Right Side - Illustration & Features -->
    <div class="hidden lg:block lg:w-1/2 bg-gradient-to-br from-red-50 via-white to-gray-50 relative overflow-hidden">
      <!-- Main Content Area -->
      <div class="relative w-full h-full flex items-center justify-center p-16">
        <div class="relative w-full max-w-md">
          <!-- Heading -->
          <h1 class="text-3xl font-bold text-gray-900 mb-4">
            Project Management <span class="text-red-600">Dashboard</span>
          </h1>
          
          <p class="text-gray-600 mb-8 leading-relaxed">
            Kelola alur kerja konten dengan sistem manajemen proyek komprehensif kami. Pantau kemajuan, kelola tugas, dan tingkatkan produktivitas tim.
          </p>

          <!-- Feature Cards -->
          <div class="space-y-4">
            <!-- Project Management -->
            <div class="bg-white shadow-md rounded-xl p-5 transform transition-all hover:scale-[1.02] relative z-10">
              <div class="flex items-start">
                <div class="bg-red-100 rounded-full p-3 flex-shrink-0">
                  <FolderIcon class="h-6 w-6 text-red-600" />
                </div>
                <div class="ml-4">
                  <h3 class="font-medium text-gray-900">Manajemen Proyek</h3>
                  <p class="text-gray-600 text-sm mt-1">Lacak status proyek, tenggat waktu, dan penugasan tim dari satu dasbor terpadu</p>
                </div>
              </div>
            </div>
            
            <!-- Task Tracking -->
            <div class="bg-white shadow-md rounded-xl p-5 transform transition-all hover:scale-[1.02] relative z-20">
              <div class="flex items-start">
                <div class="bg-blue-100 rounded-full p-3 flex-shrink-0">
                  <ClipboardDocumentCheckIcon class="h-6 w-6 text-blue-600" />
                </div>
                <div class="ml-4">
                  <h3 class="font-medium text-gray-900">Pelacakan Tugas</h3>
                  <p class="text-gray-600 text-sm mt-1">Kelola tugas, pantau penyelesaian, dan pastikan pengiriman tepat waktu dengan indikator visual yang jelas</p>
                </div>
              </div>
            </div>
            
            <!-- Analytics -->
            <div class="bg-white shadow-md rounded-xl p-5 transform transition-all hover:scale-[1.02] relative z-30">
              <div class="flex items-start">
                <div class="bg-green-100 rounded-full p-3 flex-shrink-0">
                  <ChartBarIcon class="h-6 w-6 text-green-600" />
                </div>
                <div class="ml-4">
                  <h3 class="font-medium text-gray-900">Analitik & Wawasan</h3>
                  <p class="text-gray-600 text-sm mt-1">Dapatkan wawasan berharga dengan metrik kinerja, produktivitas tim, dan analitik konten</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Decorative Elements remain unchanged -->
        <div class="absolute inset-0 pointer-events-none">
          <!-- Top Right -->
          <div class="absolute top-16 right-20 w-16 h-16 bg-red-50 rounded-xl -rotate-12 animate-float-slow">
            <DocumentTextIcon class="h-8 w-8 m-4 text-red-600" />
          </div>

          <!-- Bottom Right -->
          <div class="absolute bottom-20 right-32 w-20 h-20 bg-blue-50 rounded-full animate-float-medium">
            <UserGroupIcon class="h-10 w-10 m-5 text-blue-600" />
          </div>

          <!-- Top Left -->
          <div class="absolute top-40 left-16 w-14 h-14 bg-orange-50 rounded-lg rotate-12 animate-float-fast">
            <ClockIcon class="h-8 w-8 m-3 text-orange-500" />
          </div>

          <!-- Center Left -->
          <div class="absolute top-1/2 left-24 w-10 h-10 animate-spin-slow opacity-30">
            <div class="h-full w-full rounded-full border-4 border-red-600 border-t-transparent"></div>
          </div>

          <!-- Bottom Left Grid Pattern -->
          <div class="absolute bottom-12 left-12 grid grid-cols-3 gap-1 opacity-20">
            <div v-for="n in 9" :key="n" class="w-3 h-3 bg-gray-400 rounded-sm"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- Right before the closing </div> of the main container -->
    <div class="absolute bottom-4 w-full text-center text-xs text-gray-400">
      <p>PITCAR Project Management v{{ version }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import packageJson from '../../package.json' 
import {
  EnvelopeIcon,
  LockClosedIcon,
  BuildingOfficeIcon,
  EyeIcon,
  EyeSlashIcon,
  FolderIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const version = packageJson.version

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const formData = ref({
  db: '',
  login: '',
  password: '',
  rememberMe: false
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    
    await authStore.login(
      formData.value.db,
      formData.value.login,
      formData.value.password
    )
    
    router.push('/marketing/dashboard')
  } catch (err) {
    error.value = err.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes float-slow {
  0%, 100% { transform: translateY(0) rotate(-12deg); }
  50% { transform: translateY(-15px) rotate(-12deg); }
}

@keyframes float-medium {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@keyframes float-fast {
  0%, 100% { transform: translateY(0) rotate(12deg); }
  50% { transform: translateY(-8px) rotate(12deg); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-float-slow {
  animation: float-slow 6s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 5s ease-in-out infinite;
}

.animate-float-fast {
  animation: float-fast 4s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}
</style>