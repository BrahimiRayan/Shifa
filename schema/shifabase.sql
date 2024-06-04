-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 04 juin 2024 à 11:55
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `shifabase`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE `admin` (
  `idadmin` varchar(50) NOT NULL,
  `matricule` varchar(10) NOT NULL,
  `nom` varchar(45) NOT NULL,
  `prenom` varchar(45) NOT NULL,
  `pswd` varchar(400) NOT NULL,
  `email` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`idadmin`, `matricule`, `nom`, `prenom`, `pswd`, `email`) VALUES
('23072003', '30027232', 'Brahimi', 'Rayan', '$2b$10$FoIL.aN6ynpjetvi0c9utuhTS5E8VtOqSnXdYtudvhXj173M6QYXC', 'brahimiabdelazize2636@gmail.com');

-- --------------------------------------------------------

--
-- Structure de la table `docteurs`
--

CREATE TABLE `docteurs` (
  `iddoc` varchar(50) NOT NULL,
  `matricule` varchar(10) NOT NULL,
  `nom` varchar(45) NOT NULL,
  `prenom` varchar(45) NOT NULL,
  `birthdate` date NOT NULL,
  `phone` varchar(18) NOT NULL,
  `address` varchar(100) DEFAULT NULL,
  `ncin` varchar(12) NOT NULL,
  `pswd` varchar(400) NOT NULL,
  `email` varchar(60) NOT NULL,
  `idserv` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `docteurs`
--

INSERT INTO `docteurs` (`iddoc`, `matricule`, `nom`, `prenom`, `birthdate`, `phone`, `address`, `ncin`, `pswd`, `email`, `idserv`) VALUES
('08ce12', '69822542', 'Mechekour', 'Billal', '2003-02-11', '06677782829', 'Bejaia', '122273723676', '$2b$10$wo.Gyw1vT6EycCNaoG/Q9ODPVqstsFLyAKe93Qv4YlZMZRRwP/5Jq', 'Mechkour23@gmail.com', '10'),
('26c9ea', '80184367', 'quelqun', 'perssone', '1997-12-12', '0669966772', NULL, '883273282332', '$2b$10$KExRkeoRppqMmclou.URzOnSaTNAW.1dSHlk//3pihOTzyNkrC4Uq', 'brahimiabdelaziz2636@gmail.com', '2'),
('3f5d78', '09649504', 'doc5', 'doc5', '1988-12-12', '0558893244', NULL, '304834729238', '$2b$10$E6NaMCkV0xo1W7piHpjEH.es/f5sB4aa8DCwpzngwVhcSd4Jzk.YO', 'doc5@gmail.com', '7'),
('4cabd4', '36582041', 'doc3', 'doc3', '2002-03-12', '06778893421', 'Bejaia', '389895638958', '$2b$10$OrmKl8np5fAKfuRuAO68Nei4KY0tBxcNVjCJKyOk35rWkvL.BKWMC', 'doc3@gmail.com', '4'),
('4daa38', '78192323', 'doc7', 'doc7', '2000-02-22', '0636363682', NULL, '892384374893', '$2b$10$mr1S0HvUkLgDy5piF9NPRO0n8ThB0F7yiMDQwpd/a8by8LtWNEntC', 'doc7@gmail.com', '9'),
('77e56b', '95463514', 'Brahimi', 'Rayan', '2003-07-23', '0558892122', '--', '788367327637', '$2b$10$7cYTwhSYEBYFvp5tU7BlcubYoDvr9OLeuRxcJ6tFO6faMNkihQRiS', 'zzaza7291@gmail.com', '10'),
('a5529b', '82985575', 'doc6', 'doc6', '1975-04-15', '06783992238', NULL, '923043049374', '$2b$10$..dt2cOG7n/SSWKCSdGdu.6tTd0Y0oPeQVcZSsZYgUI0ScACAW8n.', 'doc6@gmail.com', '8'),
('a7f239', '27128725', 'Brahimi', 'Amir', '1999-06-09', '0558892122', NULL, '664828429383', '$2b$10$lEmDuqlBRauCg9knxXxBMecfoNn/ZOqFQbHeZV5k/PaQbeIOi.BTC', 'amirbrahimi@gmail.com', '5'),
('b030d0', '27224513', 'doc4', 'doc4', '1998-12-12', '0667733442', NULL, '232813792193', '$2b$10$hW5fj14uYqbIHHqeRoNF0us02/GUc42MZNahl0ZL7n/P9eG7bsCJO', 'doc4@gmail.com', '6'),
('c6206c', '10667107', 'Mechekour', 'Billal', '2003-04-05', '0754553538', NULL, '778674745345', '$2b$10$2rREIrJR6gX./ZdY3TgMM.cM5CwKO4fuYtQTQdgqHLSK2h78qlt1a', 'wwwww@gmail.com', '3'),
('f162a3', '45938668', 'Brahimi', 'Ahmad', '1998-07-22', '0558892122', NULL, '873646653478', '$2b$10$/1rZ07xQ5VA4tESdY2t1veF3XzM/Zd07dLJMAjJFprJaxk09z5gZO', 'zzaza7291@gmail.com', '1');

-- --------------------------------------------------------

--
-- Structure de la table `enfants`
--

CREATE TABLE `enfants` (
  `idenf` int(11) NOT NULL,
  `idp` varchar(50) DEFAULT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `bdate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `enfants`
--

INSERT INTO `enfants` (`idenf`, `idp`, `nom`, `prenom`, `bdate`) VALUES
(1, '88233dee-1', 'Brahimi', 'rayan', '2013-10-17'),
(2, '88233dee-1', 'Brahimi', 'Abedelkadar', '2013-10-10'),
(4, '88233dee-1', 'Brahimi', 'Amir', '2013-10-17'),
(6, '88233dee-1', 'Brahimi', 'Chaima', '2009-06-25');

-- --------------------------------------------------------

--
-- Structure de la table `patients`
--

CREATE TABLE `patients` (
  `idp` varchar(50) NOT NULL,
  `nom` varchar(45) NOT NULL,
  `prenom` varchar(45) NOT NULL,
  `birthdate` date NOT NULL,
  `phone` varchar(18) NOT NULL,
  `address` varchar(100) DEFAULT NULL,
  `ncin` varchar(12) NOT NULL,
  `pswd` varchar(400) NOT NULL,
  `email` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `patients`
--

INSERT INTO `patients` (`idp`, `nom`, `prenom`, `birthdate`, `phone`, `address`, `ncin`, `pswd`, `email`) VALUES
('88233dee-1', 'Brahimi', 'Abdelaziz', '1963-01-26', '0765433456', 'Mellala', '019128377650', '$2b$10$nsW4nmNRTT2D43X4Dqkg1O.B08L6JONjjqip23NkUsVygOtej.cY6', 'brahimirayan97@gmail.com'),
('cafba653-f', 'Messaoudene', 'Said', '2003-03-08', '0672880965', NULL, '232434336637', '$2b$10$KoW0WsJZaHGfrEOIP5XoguHpfQuxldmFvx9DyjDOxraFow1nw7Iy2', 'saidmessaoudene2021@gmail.com');

-- --------------------------------------------------------

--
-- Structure de la table `patients_temp`
--

CREATE TABLE `patients_temp` (
  `idtemp` varchar(65) NOT NULL,
  `nom` varchar(45) NOT NULL,
  `prenom` varchar(45) NOT NULL,
  `birthdate` date NOT NULL,
  `ncin` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `patients_temp`
--

INSERT INTO `patients_temp` (`idtemp`, `nom`, `prenom`, `birthdate`, `ncin`) VALUES
('05d56ea3-7', 'hello', 'world', '1999-07-21', '923469237463'),
('071c595c-e', 'Brahimi', 'yoyo', '1997-06-25', '893569398328'),
('12224c81-2', 'AHMADE', 'ALI', '1998-06-18', '827763663772'),
('9d731e4e-7', 'MASSOUDEN ', 'Said', '2003-06-13', '656873487583'),
('bec9557e-3', 'YAHIAOUI', 'NORIA', '1976-06-25', '845893759345'),
('ea843f56-3', 'jackie', 'chan', '1996-07-19', '736864832648'),
('fac2592c-1', 'Machkour', 'Billal', '1996-06-12', '832492348923');

-- --------------------------------------------------------

--
-- Structure de la table `planing`
--

CREATE TABLE `planing` (
  `iddoc` varchar(50) NOT NULL,
  `idserv` varchar(50) NOT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `heur_debut` time DEFAULT NULL,
  `heur_fin` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `rdv`
--

CREATE TABLE `rdv` (
  `idrdv` varchar(50) NOT NULL,
  `idp` varchar(50) DEFAULT NULL,
  `iddoc` varchar(50) DEFAULT NULL,
  `idtemp` varchar(30) DEFAULT NULL,
  `date_rdv` date DEFAULT NULL,
  `heur_debut_rdv` time DEFAULT NULL,
  `type` int(11) DEFAULT 0,
  `idenf` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `rdv`
--

INSERT INTO `rdv` (`idrdv`, `idp`, `iddoc`, `idtemp`, `date_rdv`, `heur_debut_rdv`, `type`, `idenf`) VALUES
('0fca5', '88233dee-1', '77e56b', NULL, '2024-05-28', '12:00:00', 1, NULL),
('217c8', '88233dee-1', 'a7f239', NULL, '2024-06-07', '08:00:00', 1, NULL),
('21e5f', NULL, 'f162a3', '12224c81-2', '2024-05-29', '07:00:00', 1, NULL),
('5077a', '88233dee-1', 'a7f239', NULL, '2024-04-27', '06:00:00', 0, NULL),
('7650b', '88233dee-1', '4cabd4', NULL, '2024-04-26', '07:00:00', 0, NULL),
('79327', '88233dee-1', 'a7f239', NULL, '2024-04-25', '10:00:00', 1, NULL),
('80f62', '88233dee-1', 'c6206c', NULL, '2024-05-11', '07:00:00', 0, 1),
('88971', NULL, '4cabd4', '05d56ea3-7', '2024-05-18', '08:00:00', 2, NULL),
('93d76', '88233dee-1', 'a7f239', NULL, '2024-04-26', '21:00:00', 1, NULL),
('9e989', '88233dee-1', 'a7f239', NULL, '2024-06-14', '11:00:00', 1, NULL),
('a06d6', '88233dee-1', 'c6206c', NULL, '2024-04-21', '13:00:00', 0, 4),
('a0f56', NULL, 'a7f239', 'bec9557e-3', '2024-04-29', '07:00:00', 2, NULL),
('b471f', NULL, 'f162a3', '12224c81-2', '2024-05-28', '07:00:00', 2, NULL),
('ba724', '88233dee-1', 'f162a3', NULL, '2024-05-16', '09:00:00', 0, 2),
('bc76b', '88233dee-1', 'f162a3', NULL, '2024-05-17', '08:00:00', 1, NULL),
('bde5f', '88233dee-1', '3f5d78', NULL, '2024-04-16', '06:00:00', 0, 2),
('c70ce', '88233dee-1', '3f5d78', NULL, '2024-04-18', '13:00:00', 0, 4),
('d4006', NULL, 'c6206c', 'ea843f56-3', '2024-05-18', '07:00:00', 2, NULL),
('d401b', 'cafba653-f', 'b030d0', NULL, '2024-04-21', '01:00:00', 0, NULL),
('e12a6', '88233dee-1', '4daa38', NULL, '2024-04-08', '02:00:00', 0, 1),
('e12ah', 'cafba653-f', '4daa38', NULL, '2024-04-07', '02:00:00', 0, 1),
('ef63c', '88233dee-1', '77e56b', NULL, '2024-05-22', '09:00:00', 0, NULL),
('f0aa9', NULL, 'a7f239', '9d731e4e-7', '2024-06-06', '13:00:00', 2, NULL),
('f1fb4', '88233dee-1', 'c6206c', NULL, '2024-06-11', '09:00:00', 0, 2);

-- --------------------------------------------------------

--
-- Structure de la table `secritaires`
--

CREATE TABLE `secritaires` (
  `idsec` varchar(50) NOT NULL,
  `matricule` varchar(8) NOT NULL,
  `nom` varchar(45) NOT NULL,
  `prenom` varchar(45) NOT NULL,
  `birthdate` date NOT NULL,
  `phone` varchar(18) NOT NULL,
  `email` varchar(60) NOT NULL,
  `address` varchar(100) DEFAULT NULL,
  `ncin` varchar(12) NOT NULL,
  `pswd` varchar(400) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `secritaires`
--

INSERT INTO `secritaires` (`idsec`, `matricule`, `nom`, `prenom`, `birthdate`, `phone`, `email`, `address`, `ncin`, `pswd`) VALUES
('0b8882', '54883871', 'Masouden', 'Billoo', '2003-07-13', '0558892122', 'Zzaza7291@gmail.com', 'Mellala', '873400928332', '$2b$10$J3uEd50XC43yUSHV9IZWDe2P9PrRVInULU8zmKp4CP6xwfLo0l68C'),
('a172ee', '81460978', 'Masouden', 'Said', '1980-07-23', '0558892122', 'zzaza78@gmail.com', '--', '738847902838', '$2b$10$Isgqtl3c.PR38qtXmEdg2usHFCKv.zuXUIc3ZaBmJ15AXd6F2WLA.');

-- --------------------------------------------------------

--
-- Structure de la table `services`
--

CREATE TABLE `services` (
  `idserv` varchar(50) NOT NULL,
  `nomserv` varchar(50) NOT NULL,
  `patient_in_hour` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `services`
--

INSERT INTO `services` (`idserv`, `nomserv`, `patient_in_hour`) VALUES
('1', 'Dermatologie', 12),
('10', 'Psychiatrie', 4),
('2', 'Cardiologie', 8),
('3', 'Orthopédie', 7),
('4', 'Pédiatrie', 6),
('5', 'Consultation générale', 9),
('6', 'Odontologie', 8),
('7', 'Radiologie', 12),
('8', 'Neurologie', 8),
('9', 'Ophtalmologie', 5);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`idadmin`);

--
-- Index pour la table `docteurs`
--
ALTER TABLE `docteurs`
  ADD PRIMARY KEY (`iddoc`),
  ADD KEY `idserv` (`idserv`);

--
-- Index pour la table `enfants`
--
ALTER TABLE `enfants`
  ADD PRIMARY KEY (`idenf`),
  ADD KEY `idp` (`idp`);

--
-- Index pour la table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`idp`);

--
-- Index pour la table `patients_temp`
--
ALTER TABLE `patients_temp`
  ADD PRIMARY KEY (`idtemp`);

--
-- Index pour la table `planing`
--
ALTER TABLE `planing`
  ADD PRIMARY KEY (`iddoc`,`idserv`),
  ADD KEY `idserv` (`idserv`);

--
-- Index pour la table `rdv`
--
ALTER TABLE `rdv`
  ADD PRIMARY KEY (`idrdv`),
  ADD KEY `idp` (`idp`),
  ADD KEY `iddoc` (`iddoc`),
  ADD KEY `FK_rdv_enfants_idenf` (`idenf`),
  ADD KEY `fk_idtemp` (`idtemp`);

--
-- Index pour la table `secritaires`
--
ALTER TABLE `secritaires`
  ADD PRIMARY KEY (`idsec`);

--
-- Index pour la table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`idserv`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `enfants`
--
ALTER TABLE `enfants`
  MODIFY `idenf` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `docteurs`
--
ALTER TABLE `docteurs`
  ADD CONSTRAINT `docteurs_ibfk_1` FOREIGN KEY (`idserv`) REFERENCES `services` (`idserv`) ON DELETE CASCADE;

--
-- Contraintes pour la table `enfants`
--
ALTER TABLE `enfants`
  ADD CONSTRAINT `enfants_ibfk_1` FOREIGN KEY (`idp`) REFERENCES `patients` (`idp`) ON DELETE CASCADE;

--
-- Contraintes pour la table `planing`
--
ALTER TABLE `planing`
  ADD CONSTRAINT `planing_ibfk_1` FOREIGN KEY (`idserv`) REFERENCES `services` (`idserv`) ON DELETE CASCADE,
  ADD CONSTRAINT `planing_ibfk_2` FOREIGN KEY (`iddoc`) REFERENCES `docteurs` (`iddoc`) ON DELETE CASCADE;

--
-- Contraintes pour la table `rdv`
--
ALTER TABLE `rdv`
  ADD CONSTRAINT `FK_rdv_enfants_idenf` FOREIGN KEY (`idenf`) REFERENCES `enfants` (`idenf`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_idtemp` FOREIGN KEY (`idtemp`) REFERENCES `patients_temp` (`idtemp`) ON DELETE CASCADE,
  ADD CONSTRAINT `rdv_ibfk_1` FOREIGN KEY (`idp`) REFERENCES `patients` (`idp`) ON DELETE CASCADE,
  ADD CONSTRAINT `rdv_ibfk_2` FOREIGN KEY (`iddoc`) REFERENCES `docteurs` (`iddoc`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
