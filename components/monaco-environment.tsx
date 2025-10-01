"use client"

import { useEffect } from "react"

export default function MonacoEnvironment() {
  useEffect(() => {
    // Configurar el entorno de Monaco Editor para manejar web workers
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.MonacoEnvironment = {
        getWorker(_: string, label: string) {
          // Retornar un worker vacío para evitar errores
          // En el entorno de v0, los workers no son necesarios
          const workerBlob = new Blob(
            [
              `
              self.addEventListener('message', () => {
                // Worker vacío que no hace nada
              });
            `,
            ],
            { type: "application/javascript" },
          )
          return new Worker(URL.createObjectURL(workerBlob))
        },
      }
    }
  }, [])

  // Este componente no renderiza nada, solo configura el entorno
  return null
}
