import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './lib/namespace'
import { DirectionProvider } from './components/ui/direction.tsx'


const renderApp = async () => {
  const { default: App } = await import('./App.tsx')

  //@ts-expect-error - frappe will be available
  frappe.model.sync(frappe.boot.docs);
  createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
      <DirectionProvider dir={window.frappe?.boot?.layout_direction ?? 'ltr'}>
        <App />
      </DirectionProvider>
    </StrictMode>,
  )
}

if (import.meta.env.DEV) {
  fetch('/api/method/erpnext.www.banking.get_context_for_dev', {
    method: 'POST',
  }).then(response => response.json()).then((values) => {
    if (!window.frappe) window.frappe = {};
    //@ts-expect-error - frappe will be available
    frappe.boot = JSON.parse(values.message.boot);
    //@ts-expect-error - frappe will be available
    frappe._messages = frappe.boot["__messages"];

    // Set document direction to rtl
    document.dir = values.message.layout_direction;
    void renderApp()

  })
} else {
  // The page template loads translations asynchronously. Wait for them before
  // the first render so translated labels do not permanently fall back to English.
  void Promise.resolve(window.frappe?._translations_loaded).then(renderApp, renderApp)
}
