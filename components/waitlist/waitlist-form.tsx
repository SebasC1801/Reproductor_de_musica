"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Loader2 } from "lucide-react"

export default function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Cuando conectes Supabase, descomenta esto y agrega la lógica real
      /*
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      })

      if (!response.ok) {
        throw new Error("Error al registrarse")
      }
      */

      // Simulación temporal
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSuccess(true)
      setEmail("")
      setName("")
    } catch (err) {
      setError("Hubo un error al registrarte. Por favor, intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto bg-card border border-border rounded-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">¡Bienvenido a la lista!</h3>
        <p className="text-muted-foreground mb-6">
          Te hemos enviado un email de confirmación. Te notificaremos cuando estemos listos para lanzar.
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline" className="w-full">
          Registrar otro email
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-card border border-border rounded-xl p-8 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSubmitting}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
            className="h-12"
          />
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            {error}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base font-semibold">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Registrando...
            </>
          ) : (
            "Unirme a la lista de espera"
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Al registrarte, aceptas recibir actualizaciones por email. Puedes darte de baja en cualquier momento.
        </p>
      </form>
    </div>
  )
}
