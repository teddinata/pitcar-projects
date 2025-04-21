<!-- Komponen RetroGameArchiveReminder.vue -->
<template>
  <div class="retro-game-banner">
    <div class="retro-text-content">
      <span class="pixel-icon">📦</span>
      <span>INFO: PROYEK MELEWATI DUE DATE > 7 HARI AKAN OTOMATIS DIARSIPKAN</span>
      <span class="pixel-icon">📦</span>
      <span>GUNAKAN FILTER "SHOW ARCHIVED" UNTUK MELIHAT PROYEK LAMA</span>
      <span class="pixel-icon">📦</span>
    </div>
  </div>
</template>

<script setup>
// Tidak memerlukan import khusus, menggunakan emoji untuk icon
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.retro-game-banner {
  width: 100%;
  overflow: hidden;
  background-color: #000;
  margin-bottom: 1rem;
  border: 2px solid #fff;
  box-shadow: 0 0 0 4px #000, 0 0 0 6px #555;
  position: relative;
}

.retro-game-banner::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 1;
}

.retro-text-content {
  display: flex;
  align-items: center;
  padding: 8px 0;
  color: #fff;
  font-family: 'Press Start 2P', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
  animation: scrollText 30s linear infinite;
}

.pixel-icon {
  display: inline-block;
  margin: 0 12px;
  font-size: 14px;
}

@keyframes scrollText {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* Efek CRT flicker */
@keyframes flicker {
  0% {
    opacity: 0.97;
  }
  5% {
    opacity: 0.9;
  }
  10% {
    opacity: 0.97;
  }
  15% {
    opacity: 0.92;
  }
  20% {
    opacity: 0.98;
  }
  25% {
    opacity: 0.93;
  }
  30% {
    opacity: 0.97;
  }
  35% {
    opacity: 0.95;
  }
  40% {
    opacity: 0.98;
  }
  45% {
    opacity: 0.94;
  }
  50% {
    opacity: 0.98;
  }
  55% {
    opacity: 0.93;
  }
  60% {
    opacity: 0.99;
  }
  65% {
    opacity: 0.94;
  }
  70% {
    opacity: 0.97;
  }
  75% {
    opacity: 0.93;
  }
  80% {
    opacity: 0.98;
  }
  85% {
    opacity: 0.91;
  }
  90% {
    opacity: 0.97;
  }
  95% {
    opacity: 0.94;
  }
  100% {
    opacity: 0.98;
  }
}

.retro-game-banner {
  animation: flicker 3s infinite;
}
</style>