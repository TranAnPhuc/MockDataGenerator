-- =============================================
-- Mock Data Generator - SQL Server Schema
-- Created: 2026-03-12
-- =============================================

-- Create database (optional, run if needed)
-- CREATE DATABASE MockDataGeneratorDB;
-- GO
-- USE MockDataGeneratorDB;
-- GO

-- =============================================
-- Table: Templates
-- Purpose: Store user-defined data generation
--          configuration templates
-- =============================================
CREATE TABLE Templates (
    Id          INT             NOT NULL IDENTITY(1,1),
    TemplateName NVARCHAR(255)  NOT NULL,
    SchemaConfig NVARCHAR(MAX)  NOT NULL,   -- JSON: column definitions
    CreatedDate  DATETIME2      NOT NULL DEFAULT GETDATE(),

    CONSTRAINT PK_Templates PRIMARY KEY (Id)
);
GO

-- Index for quick lookup by name
CREATE INDEX IX_Templates_TemplateName ON Templates (TemplateName);
GO

-- =============================================
-- Example INSERT for reference
-- =============================================
/*
INSERT INTO Templates (TemplateName, SchemaConfig)
VALUES (
    N'User Profile Template',
    N'[
        {"columnName": "Id",        "dataType": "int",      "generator": "autoIncrement"},
        {"columnName": "FullName",  "dataType": "string",   "generator": "fullName"},
        {"columnName": "Email",     "dataType": "string",   "generator": "email"},
        {"columnName": "BirthDate", "dataType": "datetime", "generator": "dateOfBirth"},
        {"columnName": "IsActive",  "dataType": "boolean",  "generator": "boolean"}
    ]'
);
*/
