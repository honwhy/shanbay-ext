import ReactDOM from 'react-dom/client'

import App from './Wrapper.tsx'

export async function createUi(ctx: any) {
  const ui = await createShadowRootUi(ctx, {
    anchor: 'body',
    name: 'shanbay-helper-v3',
    onMount: (container) => {
      // Container is a body, and React warns when creating a root on the body, so create a wrapper div
      const app = document.createElement('div')
      container.append(app)

      // Create a root on the UI container and render a component
      const root = ReactDOM.createRoot(app)
      root.render(<App />)
      return root
    },
    onRemove: (root) => {
      // Unmount the root when the UI is removed
      root?.unmount()
    },
    position: 'inline',
  })
  return ui
}
