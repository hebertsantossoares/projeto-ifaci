"use client"

import { useState, useEffect } from "react"

interface Usuario {
    id: number
    nome: string
    email: string
    senha: string
}

export default function ListarUsuario() {

    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [modalAberto, setModalAberto] = useState(false)

    const [usuarioEditando, setUsuarioEditando] =
        useState<Usuario | null>(null)

    const [novoNome, setNovoNome] = useState("")
    const [novoEmail, setNovoEmail] = useState("")
    const [novaSenha, setNovaSenha] = useState("")

    async function buscarUsuarios() {

        try {

            const response = await fetch(
                "http://localhost:8080/usuarios"
            )

            const data = await response.json()

            setUsuarios(data)

        } catch (error) {

            console.log(error)
        }
    }

    async function deletarUsuario(id: number) {

        try {

            await fetch(
                `http://localhost:8080/usuarios/${id}`,
                {
                    method: "DELETE"
                }
            )

            buscarUsuarios()

        } catch (error) {

            console.log(error)
        }
    }

    async function editarUsuario() {

        if (!usuarioEditando) return

        try {

            await fetch(
                `http://localhost:8080/usuarios/${usuarioEditando.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nome: novoNome,
                        email: novoEmail,
                        senha: novaSenha
                    })
                }
            )

            setModalAberto(false)

            buscarUsuarios()

        } catch (error) {

            console.log(error)
        }
    }

    function abrirModal(usuario: Usuario) {

        setUsuarioEditando(usuario)

        setNovoNome(usuario.nome)
        setNovoEmail(usuario.email)
        setNovaSenha(usuario.senha)

        setModalAberto(true)
    }

    useEffect(() => {

        buscarUsuarios()

    }, [])

    return (

        <div className="w-full lg:w-[50vw] max-h-[88vh] overflow-y-auto bg-white text-black rounded-xl flex flex-col gap-4 p-4">

            <h2 className="text-xl font-semibold">
                Lista de Usuários
            </h2>

            {usuarios.length === 0 && (
                <p>Nenhum usuário cadastrado.</p>
            )}

            {usuarios.map((usuario) => (

                <div
                    key={usuario.id}
                    className="bg-gray-300 border-2 border-gray-500 rounded-lg p-4 flex flex-col gap-3"
                >

                    <h2 className="text-lg font-semibold">
                        Usuário #{usuario.id}
                    </h2>

                    <div className="break-words">
                        <p className="font-semibold">
                            Nome:
                        </p>

                        <p>{usuario.nome}</p>
                    </div>

                    <div className="break-all">
                        <p className="font-semibold">
                            Email:
                        </p>

                        <p>{usuario.email}</p>
                    </div>

                    <div className="break-all">
                        <p className="font-semibold">
                            Senha:
                        </p>

                        <p>{usuario.senha}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full justify-end gap-4 mt-4">

                        <button
                            onClick={() => abrirModal(usuario)}
                            className="rounded-lg px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white cursor-pointer"
                        >
                            Editar
                        </button>

                        <button
                            onClick={() => {
                                deletarUsuario(usuario.id)
                            }}
                            className="rounded-lg px-4 py-2 bg-red-400 hover:bg-red-500 text-white cursor-pointer"
                        >
                            Deletar
                        </button>

                    </div>

                </div>
            ))}

            {modalAberto && (

                <div className="w-screen h-screen inset-0 fixed bg-gray-700/50 flex justify-center items-center p-4">

                    <div className="w-full max-w-[600px] rounded-2xl shadow-lg bg-white flex flex-col px-6 py-4 gap-8">

                        <h2 className="text-xl font-semibold">
                            Editar Usuário
                        </h2>

                        <div className="flex flex-col gap-4">

                            <input
                                type="text"
                                placeholder="Novo Nome"
                                value={novoNome}
                                onChange={(e) =>
                                    setNovoNome(e.target.value)
                                }
                                className="p-4 rounded-lg outline-2 outline-red-500"
                            />

                            <input
                                type="email"
                                placeholder="Novo email"
                                value={novoEmail}
                                onChange={(e) =>
                                    setNovoEmail(e.target.value)
                                }
                                className="p-4 rounded-lg outline-2 outline-red-500"
                            />

                            <input
                                type="password"
                                placeholder="Nova Senha"
                                value={novaSenha}
                                onChange={(e) =>
                                    setNovaSenha(e.target.value)
                                }
                                className="p-4 rounded-lg outline-2 outline-red-500"
                            />

                            <div className="flex flex-col sm:flex-row gap-4 justify-end w-full">

                                <button
                                    onClick={editarUsuario}
                                    className="rounded-lg px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white cursor-pointer"
                                >
                                    Confirmar
                                </button>

                                <button
                                    onClick={() => {
                                        setModalAberto(false)
                                    }}
                                    className="rounded-lg px-4 py-2 bg-red-400 hover:bg-red-500 text-white cursor-pointer"
                                >
                                    Cancelar
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    )
}