// Estructura de datos para un trabajo, tal como lo guardaremos en el JSON
export interface JobData {
    jobId: number;
    employer: string;
    freelancer: string;
    amount: string;
    title: string;
    description: string;
    skills: string[];
    state: string;
    commissionAmount: string;
}