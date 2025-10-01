import WaitlistForm from "@/components/waitlist/waitlist-form"
import { Sparkles, Zap, Shield } from "lucide-react"

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Próximamente</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Únete a la lista de espera</h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Sé de los primeros en experimentar la próxima generación de nuestro reproductor de música
            </p>
          </div>

          {/* Waitlist Form */}
          <div className="mb-16">
            <WaitlistForm />
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Acceso anticipado</h3>
              <p className="text-sm text-muted-foreground">Obtén acceso exclusivo antes del lanzamiento oficial</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Funciones premium</h3>
              <p className="text-sm text-muted-foreground">
                Disfruta de características exclusivas para miembros fundadores
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Prioridad de soporte</h3>
              <p className="text-sm text-muted-foreground">Recibe ayuda prioritaria de nuestro equipo de soporte</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
