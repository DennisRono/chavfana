'use client'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store, persistor } from '@/store/store'
import { PersistGate } from 'redux-persist/integration/react'
import { ProgressProvider } from '@bprogress/next/app'

export default function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ProgressProvider
          height="4px"
          color="#117216"
          options={{ showSpinner: false }}
          shallowRouting
        >
          {children}
        </ProgressProvider>
      </PersistGate>
    </Provider>
  )
}
