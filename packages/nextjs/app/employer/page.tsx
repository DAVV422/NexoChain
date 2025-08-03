"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { formatEther, parseEther } from "viem"; // Usamos la utilidad de viem para formatear valores
import { addJobToLocalState, getEmployerJobs } from "../../services/jobService";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth"; 
import { useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";
import { JobData } from "~~/interfaces/jobData.interface";

const EmployerDashboard = () => {
    const { address } = useAccount();
    const [jobs, setJobs] = useState<JobData[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [skills, setSkills] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Hook para escribir en el contrato
    const { writeContractAsync: createVacancyTx } = useScaffoldWriteContract({
        contractName: "JobEscrow",
    });

    // Hook para escuchar el evento VacancyCreated
    useScaffoldWatchContractEvent({
        contractName: "JobEscrow",
        eventName: "VacancyCreated",
        onLogs: logs => {
            logs.forEach(log => {
                const { jobId, employer, amount: eventAmount } = log.args;
                
                if (employer === address) {
                    const newJobData: JobData = {
                        jobId: Number(jobId),
                        employer: employer!,
                        freelancer: "0x0000000000000000000000000000000000000000",
                        amount: eventAmount!.toString(),
                        title: title, // Aquí usamos el título del estado local
                        description: description,
                        skills: skills.split(',').map(s => s.trim()),
                        state: "Open",
                        commissionAmount: "0",
                    };
                    
                    addJobToLocalState(newJobData);
                    setJobs(getEmployerJobs(address!));
                    console.log("Evento 'VacancyCreated' capturado y estado local actualizado.");

                    // Limpiamos los campos del formulario después de una creación exitosa
                    setTitle("");
                    setDescription("");
                    setSkills("");
                    setAmount("");
                }
            });
        },
    });

    // Carga los trabajos del empleador al cargar el componente
    useEffect(() => {
        if (address) {
            setJobs(getEmployerJobs(address));
        }
    }, [address]);

    // Maneja el envío del formulario para crear una vacante
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!address) {
            setError("Por favor, conecta tu wallet.");
            return;
        }
        if (!amount) {
            setError("El monto no puede estar vacío.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await createVacancyTx({
                functionName: "createVacancy",
                args: [
                description, 
                skills.split(',').map(s => s.trim()), 
                "" // Argumento vacío si el contrato lo requiere
                ],
                value: parseEther(amount), // parseEther ya devuelve un bigint
            });
            alert("¡Transacción enviada! Esperando confirmación de la blockchain...");
        } catch (err: any) {
            setError(`Error al crear la vacante: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Mis Ofertas de Trabajo</h1>

            {/* Sección para crear una nueva oferta */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold mb-4">Crear Nueva Oferta</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Título del trabajo"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
                        required
                    />
                    <textarea
                        placeholder="Descripción del trabajo"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
                        rows={4}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Habilidades (separadas por coma, ej: 'React, Solidity')"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
                        required
                    />
                    <div className="flex items-center">
                        <input
                            type="number"
                            placeholder="Monto en ETH"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
                            step="any"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !address}
                        className={`w-full py-2 rounded font-bold transition-colors ${
                            loading || !address ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Creando..." : "Crear Vacante"}
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
            </div>

            {/* Sección para listar las ofertas del empleador */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Mis Ofertas Publicadas</h2>
                {jobs.length === 0 ? (
                    <p className="text-gray-400">Aún no has publicado ninguna oferta.</p>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job: JobData) => (
                            <div key={job.jobId} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold">{job.title}</h3>
                                    <p className="text-gray-400">ID: {job.jobId}</p>
                                    <p className="text-gray-400">Monto: {formatEther(BigInt(job.amount))} ETH</p>
                                    <p className="text-gray-400">Estado: <span className="font-semibold text-yellow-400">{job.state}</span></p>
                                </div>
                                {/* TODO: Aquí puedes agregar botones para "Ver Postulantes", "Contratar", etc. */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployerDashboard;