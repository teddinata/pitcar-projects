<!-- src/components/team/ProjectTeamSummary.vue -->
<!--
  Menampilkan informasi anggota tim sebuah project sekaligus meng-highlight
  project leader (project manager) nya.

  variant:
    - "block" : kartu ringkas (leader + chip anggota) untuk grid project
    - "row"   : satu baris (leader + stack avatar) untuk header/bar
-->
<template>
  <div v-if="hasTeam || showEmpty" class="w-full">
    <!-- ============================ BLOCK ============================ -->
    <template v-if="variant === 'block'">
      <div class="rounded-lg border border-gray-100 bg-gray-50/70 p-2.5">
        <!-- Project Leader -->
        <div class="flex items-center gap-2 min-w-0">
          <div class="relative flex-none">
            <div
              class="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold ring-2"
              :class="leader
                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white ring-amber-200'
                : 'bg-gray-100 text-gray-400 ring-gray-200'"
            >
              <span v-if="leader">{{ getInitials(leader.name) }}</span>
              <UserIcon v-else class="h-4 w-4" />
            </div>
            <span
              v-if="leader"
              class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white ring-1 ring-amber-200 flex items-center justify-center"
            >
              <StarIcon class="h-2.5 w-2.5 text-amber-500" />
            </span>
          </div>

          <div class="min-w-0 flex-1">
            <div class="text-[10px] font-semibold uppercase tracking-wide text-amber-600">
              Project Leader
            </div>
            <div
              class="text-xs font-semibold text-gray-900 truncate"
              :title="leader ? leaderTooltip : ''"
            >
              {{ leader ? leader.name : 'Belum ditentukan' }}
            </div>
          </div>
        </div>

        <!-- Anggota tim -->
        <div class="mt-2 pt-2 border-t border-gray-200/70">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              Anggota Tim
            </span>
            <span class="text-[10px] font-medium text-gray-500">
              {{ members.length }} orang
            </span>
          </div>

          <div v-if="members.length" class="flex flex-wrap gap-1">
            <span
              v-for="member in visibleMembers"
              :key="member.id || member.name"
              class="inline-flex items-center gap-1 pl-0.5 pr-1.5 py-0.5 rounded-full bg-white border border-gray-200 max-w-full"
              :title="memberTooltip(member)"
            >
              <span
                class="h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold flex-none"
                :class="getAvatarClass(member)"
              >
                {{ getInitials(member.name) }}
              </span>
              <span class="text-[11px] text-gray-700 truncate max-w-[80px]">
                {{ firstName(member.name) }}
              </span>
            </span>

            <span
              v-if="hiddenMembers.length"
              class="inline-flex items-center px-1.5 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-[11px] font-medium text-gray-600"
              :title="hiddenMembersTooltip"
            >
              +{{ hiddenMembers.length }}
            </span>
          </div>

          <div v-else class="text-[11px] text-gray-400 italic">
            Belum ada anggota tim
          </div>
        </div>
      </div>
    </template>

    <!-- ============================= ROW ============================= -->
    <template v-else>
      <div class="flex items-center gap-2 min-w-0">
        <!-- Leader -->
        <div class="flex items-center gap-1.5 min-w-0" :title="leader ? leaderTooltip : 'Project leader belum ditentukan'">
          <div class="relative flex-none">
            <div
              class="rounded-full flex items-center justify-center font-bold ring-2"
              :class="[
                avatarSizeClass,
                leader
                  ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white ring-amber-200'
                  : 'bg-gray-100 text-gray-400 ring-gray-200'
              ]"
            >
              <span v-if="leader">{{ getInitials(leader.name) }}</span>
              <UserIcon v-else class="h-3.5 w-3.5" />
            </div>
            <span
              v-if="leader"
              class="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-white ring-1 ring-amber-200 flex items-center justify-center"
            >
              <StarIcon class="h-2 w-2 text-amber-500" />
            </span>
          </div>

          <div v-if="showLeaderName" class="min-w-0">
            <div class="text-[9px] font-semibold uppercase tracking-wide text-amber-600 leading-tight">
              Leader
            </div>
            <div class="text-[11px] font-semibold text-gray-800 truncate leading-tight">
              {{ leader ? leader.name : '—' }}
            </div>
          </div>
        </div>

        <!-- Separator -->
        <span v-if="members.length" class="h-5 w-px bg-gray-200 flex-none"></span>

        <!-- Anggota -->
        <div class="flex items-center gap-1.5 flex-none">
          <div v-if="members.length" class="flex -space-x-1.5">
            <span
              v-for="member in visibleMembers"
              :key="member.id || member.name"
              class="rounded-full ring-2 ring-white flex items-center justify-center font-semibold flex-none"
              :class="[avatarSizeClass, getAvatarClass(member)]"
              :title="memberTooltip(member)"
            >
              {{ getInitials(member.name) }}
            </span>
            <span
              v-if="hiddenMembers.length"
              class="rounded-full ring-2 ring-white bg-gray-200 text-gray-700 flex items-center justify-center font-semibold flex-none"
              :class="avatarSizeClass"
              :title="hiddenMembersTooltip"
            >
              +{{ hiddenMembers.length }}
            </span>
          </div>
          <span v-else class="text-[11px] text-gray-400 italic">Tanpa anggota</span>

          <span v-if="showMemberCount && members.length" class="text-[11px] text-gray-500 whitespace-nowrap">
            {{ members.length }} anggota
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { StarIcon } from '@heroicons/vue/24/solid'
import { UserIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  // { manager: { id, name, position }, members: [{ id, name, position }] }
  team: {
    type: Object,
    default: () => ({})
  },
  variant: {
    type: String,
    default: 'block', // 'block' | 'row'
    validator: (value) => ['block', 'row'].includes(value)
  },
  // Jumlah anggota yang ditampilkan sebelum diringkas menjadi "+N"
  maxMembers: {
    type: Number,
    default: 3
  },
  size: {
    type: String,
    default: 'sm', // 'xs' | 'sm' | 'md'
    validator: (value) => ['xs', 'sm', 'md'].includes(value)
  },
  showLeaderName: {
    type: Boolean,
    default: true
  },
  showMemberCount: {
    type: Boolean,
    default: false
  },
  // Tetap render walau project belum punya tim sama sekali
  showEmpty: {
    type: Boolean,
    default: true
  }
})

const leader = computed(() => props.team?.manager || null)

const members = computed(() =>
  Array.isArray(props.team?.members)
    // Leader tidak diduplikasi di daftar anggota
    ? props.team.members.filter((member) => !leader.value || member.id !== leader.value.id)
    : []
)

const hasTeam = computed(() => !!leader.value || members.value.length > 0)

const visibleMembers = computed(() => members.value.slice(0, props.maxMembers))
const hiddenMembers = computed(() => members.value.slice(props.maxMembers))

const avatarSizeClass = computed(() => {
  const sizes = {
    xs: 'h-5 w-5 text-[9px]',
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-8 w-8 text-xs'
  }
  return sizes[props.size] || sizes.sm
})

const AVATAR_CLASSES = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-emerald-100 text-emerald-700',
  'bg-pink-100 text-pink-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
  'bg-cyan-100 text-cyan-700'
]

// Warna avatar konsisten per orang (berdasarkan id, fallback ke nama)
const getAvatarClass = (member) => {
  const seed = member?.id != null
    ? Number(member.id)
    : String(member?.name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const index = Math.abs(seed || 0) % AVATAR_CLASSES.length
  return AVATAR_CLASSES[index]
}

const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const firstName = (name) => (name ? name.split(' ')[0] : '-')

const withPosition = (person, prefix) => {
  if (!person) return ''
  const parts = [prefix ? `${prefix}: ${person.name}` : person.name]
  if (person.position) parts.push(`(${person.position})`)
  return parts.join(' ')
}

const leaderTooltip = computed(() => withPosition(leader.value, 'Project Leader'))
const memberTooltip = (member) => withPosition(member)
const hiddenMembersTooltip = computed(() =>
  hiddenMembers.value.map((member) => memberTooltip(member)).join('\n')
)
</script>
