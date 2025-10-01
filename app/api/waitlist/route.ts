import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    // Validación básica
    if (!email || !name) {
      return NextResponse.json({ error: "Email y nombre son requeridos" }, { status: 400 })
    }

    // Cuando conectes Supabase, agrega aquí la lógica para guardar en la base de datos
    /*
    const supabase = createServerClient(...)
    
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email, name, created_at: new Date().toISOString() }])
    
    if (error) {
      throw error
    }
    */

    // Por ahora, solo retornamos éxito
    console.log("[v0] Nuevo registro en lista de espera:", { email, name })

    return NextResponse.json({ message: "Registrado exitosamente" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Error en registro de lista de espera:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
