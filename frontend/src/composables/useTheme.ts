import { ref, onMounted, onUnmounted } from 'vue'

// Estado global para compartir entre componentes si es necesario
const themeMode = ref('auto')
const isDark = ref(false)

export function useTheme() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const applyTheme = () => {
    let shouldBeDark = false
    if (themeMode.value === 'auto')
      shouldBeDark = isDark.value || mediaQuery.matches
    else if (themeMode.value === 'dark')
      shouldBeDark = true
    else if (themeMode.value === 'light')
      shouldBeDark = false

    isDark.value = shouldBeDark

    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const cycleTheme = () => {
    const modes = ['auto', 'dark', 'light']
    const nextIndex = (modes.indexOf(themeMode.value) + 1) % modes.length
    themeMode.value = modes[nextIndex]
    localStorage.setItem('theme', themeMode.value)
    applyTheme()
  }

  const handleSystemChange = (e) => {
    if (themeMode.value === 'auto')
      applyTheme()
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      themeMode.value = savedTheme
    } else {
      themeMode.value = 'auto'
    }
    applyTheme()
    mediaQuery.addEventListener('change', handleSystemChange)
  })

  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handleSystemChange)

  })

  return { themeMode, isDark, cycleTheme }
}
