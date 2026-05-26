"use client"

import { useState, useEffect } from "react"

interface Device {
    id: number
    nome: string
    tipo: string
    online: boolean
}

interface SensorData {
    temperatura: number
    pressao: number
    umidade: number
    sensor_presenca: boolean
    trava_seguranca: boolean
}

export default function ListarDispositivos() {

    const [devices, setDevices] =
        useState<Device[]>([])

    const [sensores, setSensores] =
        useState<Record<number, SensorData>>({})

    const [modalAberto, setModalAberto] =
        useState(false)

    const [deviceEditando, setDeviceEditando] =
        useState<Device | null>(null)

    const [novoNome, setNovoNome] =
        useState("")

    const [novoTipo, setNovoTipo] =
        useState("")

    async function buscarDevices() {

        try {

            const response = await fetch(
                "http://localhost:8080/devices"
            )

            const data = await response.json()

            const devicesComStatus =
                data.map((device: Device) => ({
                    ...device,
                    online: true
                }))

            setDevices(devicesComStatus)

        } catch (error) {

            console.log(error)
        }
    }

    function gerarSensoresAleatorios(
        online: boolean
    ): SensorData {

        if (!online) {

            return {
                temperatura: 0,
                pressao: 0,
                umidade: 0,
                sensor_presenca: false,
                trava_seguranca: false
            }
        }

        return {

            temperatura:
                Number(
                    (
                        Math.random() * 15 + 20
                    ).toFixed(1)
                ),

            pressao:
                Number(
                    (
                        Math.random() * 3 + 1
                    ).toFixed(2)
                ),

            umidade:
                Number(
                    (
                        Math.random() * 50 + 30
                    ).toFixed(1)
                ),

            sensor_presenca:
                Math.random() > 0.5,

            trava_seguranca:
                Math.random() > 0.5
        }
    }

    async function deletarDevice(id: number) {

        try {

            await fetch(
                `http://localhost:8080/devices/${id}`,
                {
                    method: "DELETE"
                }
            )

            buscarDevices()

        } catch (error) {

            console.log(error)
        }
    }

    async function editarDevice() {

        if (!deviceEditando) return

        try {

            await fetch(
                `http://localhost:8080/devices/${deviceEditando.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nome: novoNome,
                        tipo: novoTipo
                    })
                }
            )

            setModalAberto(false)

            buscarDevices()

        } catch (error) {

            console.log(error)
        }
    }

    function abrirModal(device: Device) {

        setDeviceEditando(device)

        setNovoNome(device.nome)

        setNovoTipo(device.tipo)

        setModalAberto(true)
    }

    function alternarStatus(id: number) {

        setDevices((prev) =>
            prev.map((device) => {

                if (device.id === id) {

                    const novoStatus =
                        !device.online

                    setSensores((prevSensores) => ({
                        ...prevSensores,
                        [id]:
                            gerarSensoresAleatorios(
                                novoStatus
                            )
                    }))

                    return {
                        ...device,
                        online: novoStatus
                    }
                }

                return device
            })
        )
    }

    useEffect(() => {

        buscarDevices()

    }, [])

    useEffect(() => {

        const interval = setInterval(() => {

            setSensores(() => {

                const novosSensores:
                    Record<number, SensorData> = {}

                devices.forEach((device) => {

                    novosSensores[device.id] =
                        gerarSensoresAleatorios(
                            device.online
                        )
                })

                return novosSensores
            })

        }, 2000)

        return () =>
            clearInterval(interval)

    }, [devices])

    return (

        <div className="w-full lg:w-[50vw] max-h-[88vh] overflow-y-auto bg-white text-black rounded-xl flex flex-col gap-4 p-4">

            <h2 className="text-xl font-semibold">
                Lista de Dispositivos
            </h2>

            {devices.map((device) => (

                <div
                    key={device.id}
                    className="bg-gray-300 border-2 border-gray-500 rounded-lg p-4 flex flex-col gap-4"
                >

                    <div className="flex items-center justify-between">

                        <h2 className="text-lg font-semibold">
                            {device.nome}
                        </h2>

                        <span
                            className={`px-3 py-1 rounded-full text-white text-sm font-semibold
                            ${device.online
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                        >
                            {device.online
                                ? "ONLINE"
                                : "OFFLINE"}
                        </span>

                    </div>

                    <div className="break-all">

                        <p>
                            <strong>ID:</strong>
                            {" "}
                            {device.id}
                        </p>

                        <p>
                            <strong>Tipo:</strong>
                            {" "}
                            {device.tipo}
                        </p>

                    </div>

                    <div>

                        <h3 className="font-semibold">
                            Sensores
                        </h3>

                        <div className="flex flex-col gap-2 mt-2">

                            <div className="bg-white rounded-lg p-3 shadow">

                                🌡️ Temperatura:
                                {" "}

                                <strong>
                                    {
                                        sensores[
                                            device.id
                                        ]?.temperatura
                                    }°C
                                </strong>

                            </div>

                            <div className="bg-white rounded-lg p-3 shadow">

                                ⚙️ Pressão:
                                {" "}

                                <strong>
                                    {
                                        sensores[
                                            device.id
                                        ]?.pressao
                                    } bar
                                </strong>

                            </div>

                            <div className="bg-white rounded-lg p-3 shadow">

                                💧 Umidade:
                                {" "}

                                <strong>
                                    {
                                        sensores[
                                            device.id
                                        ]?.umidade
                                    }%
                                </strong>

                            </div>

                            <div className="bg-white rounded-lg p-3 shadow">

                                🚶 Sensor Presença:
                                {" "}

                                <strong>
                                    {
                                        sensores[
                                            device.id
                                        ]?.sensor_presenca
                                            ? "Acionado"
                                            : "Desacionado"
                                    }
                                </strong>

                            </div>

                            <div className="bg-white rounded-lg p-3 shadow">

                                🔒 Trava Segurança:
                                {" "}

                                <strong>
                                    {
                                        sensores[
                                            device.id
                                        ]?.trava_seguranca
                                            ? "Ligada"
                                            : "Desligada"
                                    }
                                </strong>

                            </div>

                        </div>

                    </div>

                    <div className="flex flex-col sm:flex-row w-full justify-end gap-4">

                        <button
                            onClick={() =>
                                alternarStatus(
                                    device.id
                                )
                            }
                            className={`rounded-lg px-4 py-2 text-white cursor-pointer
                            ${device.online
                                    ? "bg-orange-400 hover:bg-orange-500"
                                    : "bg-green-500 hover:bg-green-600"
                                }`}
                        >
                            {device.online
                                ? "Ficar Offline"
                                : "Ficar Online"}
                        </button>

                        <button
                            onClick={() =>
                                abrirModal(device)
                            }
                            className="rounded-lg px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white cursor-pointer"
                        >
                            Editar
                        </button>

                        <button
                            onClick={() =>
                                deletarDevice(device.id)
                            }
                            className="rounded-lg px-4 py-2 bg-red-400 hover:bg-red-500 text-white cursor-pointer"
                        >
                            Deletar
                        </button>

                    </div>

                </div>
            ))}

            {modalAberto && (

                <div className="w-screen h-screen inset-0 fixed bg-gray-700/50 flex justify-center items-center p-4 z-50">

                    <div className="w-full max-w-[600px] h-fit rounded-2xl shadow-lg bg-white flex flex-col px-6 py-4 gap-8">

                        <h2 className="text-xl font-semibold">
                            Editar Dispositivo
                        </h2>

                        <div className="flex flex-col gap-4">

                            <input
                                type="text"
                                placeholder="Novo Nome"
                                value={novoNome}
                                onChange={(e) =>
                                    setNovoNome(
                                        e.target.value
                                    )
                                }
                                className="p-4 rounded-lg border border-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Novo Tipo"
                                value={novoTipo}
                                onChange={(e) =>
                                    setNovoTipo(
                                        e.target.value
                                    )
                                }
                                className="p-4 rounded-lg border border-gray-400"
                            />

                            <div className="flex flex-col sm:flex-row gap-4 justify-end w-full">

                                <button
                                    onClick={editarDevice}
                                    className="rounded-lg px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white cursor-pointer"
                                >
                                    Confirmar
                                </button>

                                <button
                                    onClick={() =>
                                        setModalAberto(false)
                                    }
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