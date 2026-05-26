"use client"

import { useState } from "react"

export default function CriarUsuario() {

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    async function criarUsuario(e: React.FormEvent) {

        e.preventDefault()

        console.log("Enviando dados...")

        try {

            const response = await fetch("http://localhost:8080/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    email,
                    senha
                })
            })

            console.log("STATUS:", response.status)

            const data = await response.json()

            console.log("RESPOSTA API:", data)

            if (response.ok) {

                alert("Usuário criado com sucesso!")

                setNome("")
                setEmail("")
                setSenha("")

            } else {

                alert(data.msg || "Erro ao criar usuário")
            }

        } catch (error) {

            console.log("ERRO COMPLETO:", error)

            alert("Erro de conexão com a API")
        }
    }

    return (

        <form
            onSubmit={criarUsuario}
            className="w-[50vw] flex flex-col gap-4 rounded-xl max-h-fit bg-white text-black p-4"
        >

            <h2 className="text-lg font-semibold">
                Criar Novo Usuário
            </h2>

            <input
                type="text"
                placeholder="Nome Completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="p-4 rounded-lg outline-2 outline-red-500"
            />

            <input
                type="email"
                placeholder="email@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-4 rounded-lg outline-2 outline-red-500"
            />

            <input
                type="password"
                placeholder="Crie uma senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="p-4 rounded-lg outline-2 outline-red-500"
            />

            <button
                type="submit"
                className="py-2 px-4 text-white rounded-lg hover:bg-red-500 bg-red-400"
            >
                Enviar
            </button>

        </form>
    )
}