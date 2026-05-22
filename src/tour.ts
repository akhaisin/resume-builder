import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

export function startTour() {
  const driverObj = driver({
    showProgress: true,
    animate: true,
    smoothScroll: true,
    steps: [
      {
        popover: {
          title: 'Resume Builder',
          description:
            'Edit one JSON Resume document, adjust the active Typst template, and keep the rendered preview visible while you work.',
        },
      },
      {
        element: '#tour-resume-toolbar',
        popover: {
          title: 'Editing modes',
          description:
            'Switch between Resume and Template editing here. The Resume tab also lets you choose JSON or form editing for the same in-memory document.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#tour-editor-panel',
        popover: {
          title: 'Editor pane',
          description:
            'The left panel is the active editor surface. JSON, forms, and the current Typst template all edit the same live state that feeds the preview.',
          side: 'right',
          align: 'start',
        },
      },
      {
        element: '#tour-preview-panel',
        popover: {
          title: 'Live preview',
          description:
            'The right panel renders the current resume with Typst in the browser and keeps the previous render visible until the next one is ready.',
          side: 'left',
          align: 'start',
        },
      },
      {
        element: '#tour-download-pdf',
        popover: {
          title: 'PDF export',
          description:
            'Download the current document as PDF from this floating action when the resume JSON is valid and the preview is not in an error state.',
          side: 'left',
          doneBtnText: 'Start editing',
        },
      },
    ],
  })

  driverObj.drive()
}