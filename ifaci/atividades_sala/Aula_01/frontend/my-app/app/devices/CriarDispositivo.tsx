"use client"

import { useState } from "react"

export default function CriarDispositivo() {

    const [nome, setNome] = useState("")
    const [tipo, setTipo] = useState("")

    async function criarDispositivo(
        e: React.FormEvent
    ) {

        e.preventDefault()

        try {

            const response = await fetch(
                "http://localhost:8080/devices",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nome,
                        tipo
                    })
                }
            )

            const data = await response.json()

            console.log(data)

            alert("Dispositivo criado!")

            setNome("")
            setTipo("")

        } catch (error) {

            console.log(error)

            alert("Erro ao criar dispositivo")
        }
    }

    return (

        <form
            onSubmit={criarDispositivo}
            className="w-full lg:w-[50vw] h-fit bg-white rounded-xl text-black p-4 flex flex-col gap-4"
        >

            <h2 className="text-lg font-semibold">
                Criar Novo Dispositivo
            </h2>

            <div className="flex flex-col gap-4">

                <input
                    type="text"
                    placeholder="Nome do dispositivo"
                    value={nome}
                    onChange={(e) =>
                        setNome(e.target.value)
                    }
                    className="p-4 rounded-lg outline-2 outline-red-500"
                />

                <input
                    type="text"
                    placeholder="Tipo"
                    value={tipo}
                    onChange={(e) =>
                        setTipo(e.target.value)
                    }
                    className="p-4 rounded-lg outline-2 outline-red-500"
                />

                <button
                    type="submit"
                    className="py-2 px-4 text-white rounded-lg hover:bg-red-500 bg-red-400"
                >
                    Criar
                </button>

            </div>

        </form>
    )
}