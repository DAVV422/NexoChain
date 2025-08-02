
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title JobEscrow
 * @dev Este contrato gestiona un depósito en garantía (escrow) para trabajos entre
 * un empleador y un freelancer, con un árbitro y una comisión para la plataforma.
 */
contract JobEscrow {
    // Define los posibles estados de un trabajo.
    enum JobState { InProgress, Completed, Disputed, Resolved }

    // Estructura para almacenar los detalles de cada trabajo.
    struct Job {
        address employer;      // La dirección del empleador.
        address freelancer;    // La dirección del freelancer.
        uint256 amount;        // El monto en escrow para el freelancer.
        JobState state;        // El estado actual del trabajo.
    }

    // Mapeo de un ID de trabajo a su estructura de datos.
    mapping(uint256 => Job) public jobs;
    uint256 public nextJobId = 1;

    // --- ROLES DEL CONTRATO ---
    address public immutable arbiter; // El árbitro que resuelve disputas.
    address public immutable platformOwner; // La dirección que recibe las comisiones.
    uint8 public immutable commissionPercentage; // El porcentaje de la comisión (ej. 3 para 3%).


    // --- EVENTOS ---
    event JobCreated(uint256 indexed jobId, address indexed employer, address indexed freelancer, uint256 amount);
    event FundsReleased(uint256 indexed jobId, address indexed freelancer, uint256 amount);
    event DisputeRaised(uint256 indexed jobId, address indexed raisedBy);
    event DisputeResolved(uint256 indexed jobId, uint256 freelancerAmount, uint256 employerAmount);

    /**
     * @dev El constructor ahora define al árbitro, al dueño de la plataforma y el porcentaje de comisión.
     * Estos valores son `immutable`, lo que significa que no pueden cambiar después del despliegue.
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
     * @dev Permite a un empleador crear un trabajo. Debe enviar el monto para el freelancer MÁS la comisión.
     * @param freelancer La dirección del freelancer contratado.
     * @param freelancerAmount El monto que el freelancer debe recibir (el valor de la oferta).
     */
    function createJob(address freelancer, uint256 freelancerAmount) public payable {
        require(freelancer != address(0), "La direccion del freelancer es invalida.");
        require(freelancerAmount > 0, "El monto para el freelancer debe ser mayor a cero.");

        // --- LÓGICA DE LA COMISIÓN ---
        // 1. Se calcula la comisión basada en el monto para el freelancer.
        uint256 commissionAmount = (freelancerAmount * commissionPercentage) / 100;
        // 2. Se calcula el pago total requerido que el empleador debe enviar.
        uint256 totalPayment = freelancerAmount + commissionAmount;

        // 3. Se verifica que el empleador envió la cantidad exacta.
        require(msg.value == totalPayment, "El valor enviado no coincide con el monto del trabajo mas la comision.");

        // 4. Se transfiere la comisión a la cuenta del dueño de la plataforma INMEDIATAMENTE.
        (bool success, ) = platformOwner.call{value: commissionAmount}("");
        require(success, "Fallo al transferir la comision a la plataforma.");

        // 5. Se crea el trabajo guardando solo el monto para el freelancer en el escrow.
        jobs[nextJobId] = Job({
            employer: msg.sender,
            freelancer: freelancer,
            amount: freelancerAmount, // ¡Importante! Solo el monto del freelancer queda en garantía.
            state: JobState.InProgress
        });

        emit JobCreated(nextJobId, msg.sender, freelancer, freelancerAmount);
        nextJobId++;
    }

    /**
     * @dev Libera los fondos en garantía al freelancer. No necesita cambios.
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
     * @dev Inicia una disputa. No necesita cambios.
     */
    function raiseDispute(uint256 jobId) public {
        Job storage job = jobs[jobId];
        require(msg.sender == job.employer || msg.sender == job.freelancer, "Solo las partes involucradas pueden disputar.");
        require(job.state == JobState.InProgress, "El trabajo no esta en progreso.");

        job.state = JobState.Disputed;
        emit DisputeRaised(jobId, msg.sender);
    }

    /**
     * @dev Resuelve una disputa dividiendo los fondos en garantía. No necesita cambios.
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

        if (freelancerAmount > 0) {
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
   