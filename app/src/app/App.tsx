import { AppThemeProvider } from '@/app/providers/theme-provider'
import { ModelLabPage } from '@/pages/model-lab'

const App = () => {
  return (
    <AppThemeProvider>
      <ModelLabPage />
    </AppThemeProvider>
  )
}

export default App