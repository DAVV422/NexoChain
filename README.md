# Solwage: Una plataforma de freelance descentralizada

## Descripción del Proyecto

**Solwage** es una plataforma de freelance descentralizada construida sobre la blockchain. Su objetivo es conectar a empleadores y freelancers de manera segura y transparente, eliminando la necesidad de intermediarios.  
El corazón del sistema es un contrato inteligente de **escrow** que gestiona los pagos, garantizando que los fondos del empleador se retengan hasta que el freelancer complete el trabajo, y que el freelancer reciba su pago de forma automática.

El proyecto también incluye un **NFT (Non-Fungible Token)** de Freelancer que actúa como un perfil digital en la blockchain. Este NFT almacena datos importantes como la reputación, los trabajos completados y las habilidades del freelancer, proporcionando un historial verificable y a prueba de manipulaciones.

La plataforma aborda el problema de la confianza en el mercado freelance tradicional, donde a menudo surgen disputas de pago o preocupaciones sobre la calidad del trabajo. Con **JobEscrow**, el proceso está mediado por un árbitro neutral, y las reglas del acuerdo se aplican de forma automática a través del contrato inteligente.

---

## Funcionalidades Principales

El proyecto se compone de dos **contratos inteligentes principales** y una **interfaz de usuario (DApp)** que interactúa con ellos.

### Contratos Inteligentes

#### JobEscrow

- **Creación de Vacantes**: Los empleadores pueden publicar nuevas ofertas de trabajo, especificando una descripción, las habilidades requeridas y el monto del pago. Los fondos se depositan en un escrow en el momento de la publicación.
- **Contratación de Freelancers**: Un empleador puede contratar a un freelancer para una vacante abierta.
- **Liberación de Fondos**: El empleador puede liberar el pago al freelancer una vez que el trabajo se ha completado satisfactoriamente.
- **Manejo de Disputas**: Tanto el empleador como el freelancer pueden iniciar una disputa si no llegan a un acuerdo. Un árbitro predefinido es el responsable de resolver la disputa, decidiendo cómo se distribuyen los fondos.
- **Comisión de Plataforma**: Se cobra una pequeña comisión por cada trabajo completado, que se destina al propietario de la plataforma.

#### FreelancerNFT

- **Creación de Perfiles NFT**: Los freelancers pueden acuñar un NFT que representa su perfil profesional en la plataforma.
- **Actualización de Perfil**: El NFT almacena metadatos (como el URI de la imagen y las habilidades) que pueden ser actualizados por el propietario del token.
- **Estadísticas Verificables**: El NFT registra automáticamente el número de trabajos completados y las ganancias totales, creando un historial de trabajo confiable.

---

### Interfaz de Usuario (DApp)

La interfaz de usuario está construida con **React y Hardhat Scaffold**, y se divide en dos paneles principales para una mejor experiencia:

- **Dashboard de Empleador**: Permite a los empleadores crear nuevas vacantes de trabajo, ver el estado de sus ofertas y gestionar los pagos o disputas de los proyectos en curso.
- **Mercado de Freelancers**: Una sección donde los freelancers pueden explorar todas las vacantes de trabajo disponibles, ver los detalles y postularse.

---

## Contratos Desplegados

Una vez que los contratos han sido desplegados y verificados en una red de prueba (testnet) o en la red principal (mainnet), sus hashes de transacción y direcciones son los siguientes:

| Nombre del Contrato | Dirección del Contrato                                                         | Hash de la Transacción de Despliegue       |
|---------------------|--------------------------------------------------------------------------------|--------------------------------------------|
| JobEscrow           | https://sepolia.arbiscan.io/address/0x2ebBC9D15FDBfD09A308A7A9231c202659a99ab3 | 0x2ebBC9D15FDBfD09A308A7A9231c202659a99ab3 |
| FreelancerNFT       | https://sepolia.arbiscan.io/address/0xf951009DFB9797d63FFD950D78566C0CcF15974f | 0xf951009DFB9797d63FFD950D78566C0CcF15974f |

---

## Exportar a Hojas de Cálculo

---

## Configuración y Despliegue (Hardhat)

### Requisitos

Asegúrate de tener instalados **Node.js**, **npm** y **Hardhat**.

### Pasos

#### Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/nombre-del-repo.git
cd nombre-del-repo
```

#### Instalar dependencias:

```bash
npm install
```

#### Compilar los contratos:

```bash
npm run compile
```

#### Desplegar en una red local:

Puedes usar un nodo local de Hardhat.

```bash
npm run chain
```

En una nueva terminal:

```bash
npm run deploy
```

Los contratos se desplegarán en la red local y sus direcciones se guardarán automáticamente.

#### Ejecutar la DApp:

```bash
npm start
```

Tu aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

### Desplegar en una red de prueba (testnet)

Para desplegar en una testnet como **Sepolia**, configura las variables de entorno con tu clave privada y un endpoint de Alchemy o Infura. Luego, ejecuta:

```bash
npm run deploy -- --network sepolia
```

---

### Verificación de Contratos

Para verificar tus contratos en **Etherscan**, usa el comando:

```bash
npm run verify -- --network sepolia
```


---

## Tecnologías Utilizadas

El proyecto Solwage integra múltiples tecnologías modernas del ecosistema Web3 y de desarrollo frontend:

- **Arbitrum**: Red de capa 2 (Layer 2) basada en Ethereum que permite transacciones más rápidas y económicas. Los contratos inteligentes están desplegados en esta red para optimizar costos de gas.

- **Scaffold-ETH**: Kit de desarrollo que proporciona una plantilla rápida y flexible para construir DApps, incluyendo componentes React preconfigurados, hooks de Ethereum y soporte para pruebas y despliegue con Hardhat.

- **Hardhat**: Framework para desarrollo, compilación, pruebas y despliegue de contratos inteligentes en Solidity. Se utiliza tanto en entornos locales como en testnets/mainnet.

- **React**: Biblioteca JavaScript para construir interfaces de usuario reactivas. Es la base del frontend de la plataforma Solwage.

- **Solidity**: Lenguaje de programación utilizado para escribir los contratos inteligentes que gobiernan el comportamiento de la plataforma.

- **Ethers.js**: Librería de JavaScript utilizada para interactuar con la blockchain desde el frontend.

- **IPFS o servicios similares (opcional)**: Posibles soluciones para almacenar metadatos de los NFTs como imágenes y descripciones, garantizando descentralización.

- **Etherscan & Sourcify**: Herramientas para la verificación y auditoría pública de contratos inteligentes.

---

