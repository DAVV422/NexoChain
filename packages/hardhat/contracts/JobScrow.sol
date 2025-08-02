
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title JobEscrow
 * @dev Este contrato gestiona un depósito en garantía (escrow) para trabajos entre
 * un empleador y un freelancer, con un árbitro y una comisión para la plataforma.
 */
contract JobEscrow {
    // PASO 1: Se añade el estado 'Open' para las vacantes sin freelancer asignado.
    enum JobState { Open, InProgress, Completed, Disputed, Resolved }

    // Estructura para almacenar los detalles de cada trabajo.
    struct Job {
        address employer;      // La dirección del empleador.
        address freelancer;    // La dirección del freelancer (es 0x0 hasta que se contrata a alguien).
        uint256 amount;        // El monto en garantía (bruto al inicio, neto después de la comisión).
        JobState state;        // El estado actual del trabajo.
    }

    // Mapeo de un ID de trabajo a su estructura de datos.
    mapping(uint256 => Job) public jobs;
    uint256 public nextJobId = 1;

    // --- ROLES DEL CONTRATO ---
    address public immutable arbiter; 
    address public immutable platformOwner;
    uint8 public immutable commissionPercentage;


    // --- EVENTOS (Actualizados para el nuevo flujo) ---
    event VacancyCreated(uint256 indexed jobId, address indexed employer, uint256 amount);
    event FreelancerHired(uint256 indexed jobId, address indexed freelancer, uint256 netAmount, uint256 commission);
    event FundsReleased(uint256 indexed jobId, address indexed freelancer, uint256 amount);
    event DisputeRaised(uint256 indexed jobId, address indexed raisedBy);
    event DisputeResolved(uint256 indexed jobId, uint256 freelancerAmount, uint256 employerAmount);

    /**
     * @dev El constructor no cambia. Define los roles al desplegar el contrato.
     */
    constructor(address _arbiter, address _platformOwner, uint8 _commissionPercentage) {
        require(_arbiter != address(0), "La direccion del arbitro no puede ser la direccion cero.");
        require(_platformOwner != address(0), "La direccion del dueno de la plataforma no puede ser la direccion cero.");
        require(_commissionPercentage < 100, "La comision debe ser menor al 100%.");
        
        arbiter = _arbiter;
        platformOwner = _platformOwner;
        commissionPercentage = _commissionPercentage;
    }

    /**
     * @dev PASO 2: Nueva función para crear una vacante (antes createJob).
     * El empleador deposita el monto bruto. No se asigna freelancer ni se cobra comisión aún.
     */
    function createVacancy() public payable {
        require(msg.value > 0, "El monto de la vacante debe ser mayor a cero.");

        jobs[nextJobId] = Job({
            employer: msg.sender,
            freelancer: address(0), // El freelancer se asignará después.
            amount: msg.value,      // Se guarda el monto bruto depositado.
            state: JobState.Open    // El trabajo está abierto para postulaciones.
        });

        emit VacancyCreated(nextJobId, msg.sender, msg.value);
        nextJobId++;
    }

    /**
     * @dev PASO 3: Nueva función para que el empleador contrate a un freelancer para una vacante abierta.
     * En este paso se cobra la comisión de la plataforma.
     * @param jobId El ID de la vacante a la que se asignará el freelancer.
     * @param freelancerAddress La dirección del freelancer que se va a contratar.
     */
    function hireFreelancer(uint256 jobId, address freelancerAddress) public {
        Job storage job = jobs[jobId];

        require(msg.sender == job.employer, "Solo el empleador puede contratar.");
        require(job.state == JobState.Open, "La vacante no esta abierta.");
        require(freelancerAddress != address(0), "La direccion del freelancer es invalida.");

        // --- LÓGICA DE LA COMISIÓN (se ejecuta aquí) ---
        uint256 grossAmount = job.amount;
        uint256 commissionAmount = (grossAmount * commissionPercentage) / 100;
        uint256 netAmount = grossAmount - commissionAmount;

        // Se transfiere la comisión a la plataforma.
        (bool success, ) = platformOwner.call{value: commissionAmount}("");
        require(success, "Fallo al transferir la comision a la plataforma.");

        // Se actualiza el trabajo con los nuevos datos.
        job.freelancer = freelancerAddress;
        job.amount = netAmount; // El monto en escrow ahora es el neto para el freelancer.
        job.state = JobState.InProgress;

        emit FreelancerHired(jobId, freelancerAddress, netAmount, commissionAmount);
    }

    /**
     * @dev Libera los fondos (netos) al freelancer. La lógica interna no cambia.
     */
    function releaseFunds(uint256 jobId) public {
        Job storage job = jobs[jobId];
        require(msg.sender == job.employer, "Solo el empleador puede liberar los fondos.");
        require(job.state == JobState.InProgress, "El trabajo no esta en progreso.");

        job.state = JobState.Completed;
        (bool success, ) = job.freelancer.call{value: job.amount}("");
        require(success, "Fallo al enviar el Ether al freelancer.");

        emit FundsReleased(jobId, job.freelancer, job.amount);
    }

    /**
     * @dev Inicia una disputa. Ahora se puede disputar también un trabajo en estado 'Open'.
     */
    function raiseDispute(uint256 jobId) public {
        Job storage job = jobs[jobId];
        require(msg.sender == job.employer || msg.sender == job.freelancer, "Solo las partes involucradas pueden disputar.");
        // Se puede disputar mientras el trabajo esté en progreso. Si está 'Open', el empleador puede querer cancelar.
        require(job.state == JobState.InProgress || job.state == JobState.Open, "El trabajo no esta en un estado disputable.");

        job.state = JobState.Disputed;
        emit DisputeRaised(jobId, msg.sender);
    }

    /**
     * @dev Resuelve una disputa. La lógica opera sobre el monto en escrow en ese momento.
     */
    function resolveDispute(uint256 jobId, uint8 freelancerPercentage) public {
        require(msg.sender == arbiter, "Solo el arbitro puede resolver disputas.");
        require(freelancerPercentage <= 100, "El porcentaje no puede ser mayor a 100.");

        Job storage job = jobs[jobId];
        require(job.state == JobState.Disputed, "El trabajo no esta en disputa.");

        job.state = JobState.Resolved;

        uint256 totalAmountInEscrow = job.amount;
        uint256 freelancerAmount = (totalAmountInEscrow * freelancerPercentage) / 100;
        uint256 employerAmount = totalAmountInEscrow - freelancerAmount;

        // Si el trabajo estaba en estado 'Open', no hay freelancer a quien pagar.
        // El árbitro decide si el 100% vuelve al empleador.
        if (freelancerAmount > 0 && job.freelancer != address(0)) {
            (bool success, ) = job.freelancer.call{value: freelancerAmount}("");
            require(success, "Fallo al enviar el Ether al freelancer.");
        }

        if (employerAmount > 0) {
            (bool success, ) = job.employer.call{value: employerAmount}("");
            require(success, "Fallo al enviar el Ether al empleador.");
        }

        emit DisputeResolved(jobId, freelancerAmount, employerAmount);
    }
}