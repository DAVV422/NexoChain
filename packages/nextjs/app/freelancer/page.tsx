// src/app/freelancer/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { getJobs } from "~~/services/jobService";
import { JobData } from "~~/interfaces/jobData.interface";

const FreelancerMarketplace = () => {
    const { address } = useAccount();
    const [allJobs, setAllJobs] = useState<JobData[]>([]);

    useEffect(() => {
        // Carga todas las vacantes disponibles cuando el componente se monta
        const jobs: JobData[] = getJobs();
        setAllJobs(jobs);
    }, []);

    // Filtra los trabajos que están en estado "Open"
    let openJobs: JobData[] = []
    if(allJobs.length > 0){
        openJobs = allJobs.filter(job => job.state === "Open");
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Mercado de Vacantes</h1>

            {/* Listado de todas las vacantes disponibles */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Vacantes Abiertas</h2>
                {openJobs.length === 0 ? (
                    <p className="text-gray-400">No hay vacantes disponibles en este momento.</p>
                ) : (
                    <div className="space-y-4">
                        {openJobs.map(job => (
                            <div key={job.jobId} className="bg-gray-700 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-blue-400">{job.title}</h3>
                                    <p className="text-gray-300 mt-1">{job.description}</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {job.skills.map(skill => (
                                            <span key={skill} className="bg-gray-600 text-sm px-2 py-1 rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-gray-400 mt-2">
                                        Monto: <span className="font-semibold">{formatEther(BigInt(job.amount))} ETH</span>
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    {/* Aquí puedes agregar un botón para "Postularse" o "Ver Detalles" */}
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                                        disabled={!address}
                                    >
                                        Postularse
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FreelancerMarketplace;