// src/services/jobService.ts

import jobsData from "../data/jobs.json";

// Estructura de datos para un trabajo
interface JobData {
    jobId: number;
    employer: string;
    freelancer: string;
    amount: string; // Usamos string para manejar los big numbers
    title: string;
    description: string;
    skills: string[];
    state: string;
    commissionAmount: string;
}

// Simula la base de datos de trabajos local
let allJobs: JobData[] = jobsData as JobData[];

/**
 * @dev Simula el guardado asincrónico en el archivo JSON.
 * En un entorno real, esto sería una llamada a una API, pero para el desarrollo es suficiente.
 * @param jobs El array de trabajos a guardar.
 */
async function saveJobsToJson(jobs: JobData[]) {
    allJobs = jobs;
    console.log("Datos guardados en el 'JSON' local:", jobs);
}

// --- Funciones para manejar los datos locales ---

/**
 * @dev Adiciona un nuevo trabajo al JSON local.
 * Esta función es llamada por el event listener después de que la transacción es confirmada.
 * @param newJobData Objeto con los datos del nuevo trabajo.
 */
export const addJobToLocalState = async (newJobData: JobData) => {
    allJobs.push(newJobData);
    await saveJobsToJson(allJobs);
    console.log("Nueva vacante adicionada al JSON local.");
};

/**
 * @dev Obtiene todos los trabajos del "JSON" local.
 * @returns Array de objetos JobData.
 */
export const getJobs = (): JobData[] => {
    return allJobs;
};

/**
 * @dev Obtiene los trabajos de un empleador específico del "JSON" local.
 * @param employerAddress Dirección del empleador.
 * @returns Array de objetos JobData.
 */
export const getEmployerJobs = (employerAddress: string): JobData[] => {
    if(allJobs.length > 0) {
        return allJobs.filter(job => job.employer.toLowerCase() === employerAddress.toLowerCase());
    }
    return []
};

/**
 * @dev Actualiza el estado de un trabajo después de que un evento de la blockchain lo confirma.
 * @param jobId ID del trabajo.
 * @param updates Objeto con las propiedades a actualizar (e.g., { state: "InProgress", freelancer: "0x..." }).
 */
export const updateJobInLocalState = async (jobId: number, updates: Partial<JobData>) => {
    const jobIndex = allJobs.findIndex(job => job.jobId === jobId);
    if (jobIndex !== -1) {
        allJobs[jobIndex] = { ...allJobs[jobIndex], ...updates };
        await saveJobsToJson(allJobs);
        console.log(`Trabajo ${jobId} actualizado en el estado local.`);
    }
};

/**
 * @dev Obtiene un trabajo por su ID.
 * @param jobId ID del trabajo.
 * @returns Objeto JobData o undefined.
 */
export const getJobById = (jobId: number): JobData | undefined => {
    return allJobs.find(job => job.jobId === jobId);
};