-- ============================================================
-- CALCULADORA DE ASILO — Seed de legal_rules
-- Valores legales vigentes al 28 de mayo de 2026
-- IMPORTANTE: Solo modificar aquí cuando cambie la ley.
-- Toda modificación debe tener source_citation y source_url.
-- ============================================================

-- ============================================================
-- AAF — Annual Asylum Fee
-- ============================================================

-- Monto vigente FY2026 ($102 desde 1-feb-2026)
INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'AAF_AMOUNT_USD',
  '{"amount": 102.00, "currency": "USD", "fiscal_year": "FY2026"}',
  '2026-02-01',
  'ACTIVE',
  2,
  'Fed. Reg. 2026-01012 (1 feb 2026); EOIR Forms & Fees (4 may 2026)',
  'Monto ajustado de $100 (FY2025) a $102 (FY2026)'
);

-- Monto histórico FY2025 ($100 — SUPERSEDED)
INSERT INTO legal_rules (rule_key, rule_value, effective_date, end_date, status, version, source_citation, notes)
VALUES (
  'AAF_AMOUNT_USD_FY2025',
  '{"amount": 100.00, "currency": "USD", "fiscal_year": "FY2025"}',
  '2025-07-04',
  '2026-01-31',
  'SUPERSEDED',
  1,
  'OBBBA § 100009(b)(1); Pub. L. 119-21',
  'Monto original del OBBBA. Supersedido por ajuste inflación FY2026'
);

-- Fecha de vigencia del AAF (inicio del OBBBA)
INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'AAF_EFFECTIVE_DATE',
  '{"date": "2025-07-04"}',
  '2025-07-04',
  'ACTIVE',
  1,
  'Pub. L. 119-21 (One Big Beautiful Budget Act)',
  'Fecha en que entró en vigor el AAF'
);

-- Frontera entre Régimen A y B (CORRECCIÓN-01 del 00-MASTER-INSTRUCTIONS)
-- REGIME_A: i589_received_date < 2024-10-01
-- REGIME_B: i589_received_date >= 2024-10-01
INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'AAF_REGIME_AB_BOUNDARY',
  '{"date": "2024-10-01", "regime_a_description": "Casos presentados antes del 1-oct-2024", "regime_b_description": "Casos presentados desde el 1-oct-2024"}',
  '2025-07-04',
  'ACTIVE',
  1,
  'EOIR PM 26-01 (Annual Asylum Fee)',
  'CORRECCIÓN-01: La frontera es 2024-10-01, no 2025-07-04'
);

-- Ciclo de facturación del AAF: año calendario (EC-01)
INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'AAF_BILLING_CYCLE',
  '{"type": "CALENDAR_YEAR", "deadline_month": 12, "deadline_day": 31}',
  '2025-07-04',
  'ACTIVE',
  1,
  'EOIR PM 26-01: "for each calendar year that an alien''s application for asylum remains pending"',
  'EC-01: El AAF es por año calendario, no por ciclo de 365 días desde el pago'
);

-- Suspensión judicial — inicio y fin
INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'AAF_SUSPENSION_START',
  '{"date": "2025-10-30"}',
  '2025-10-30',
  'ACTIVE',
  1,
  'ASAP v. USCIS — Court-ordered stay (oct 2025)',
  'Inicio del período de suspensión judicial del AAF'
);

INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'AAF_SUSPENSION_END',
  '{"date": "2026-02-01"}',
  '2026-02-01',
  'ACTIVE',
  1,
  'ASAP v. USCIS — Stay lifted; Fed. Reg. 2026-01012',
  'Fin del período de suspensión judicial. El AAF aplica normalmente desde esta fecha'
);

-- Exención PM 26-01 — corte de fecha para waiver
INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'AAF_PM2601_WAIVER_CUTOFF',
  '{"date": "2025-09-30", "lookback_date": "2025-04-05", "description": "Casos administrativamente finales al 30-sep-2025 con un año pendiente desde el 5-abr-2025"}',
  '2025-07-04',
  'ACTIVE',
  1,
  'EOIR PM 26-01 (Annual Asylum Fee) — Waiver provision',
  'EC-06: Casos exentos del AAF por PM 26-01'
);

-- Portales de pago
INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'AAF_PORTAL_USCIS_URL',
  '{"url": "https://my.uscis.gov/accounts/annual-asylum-fee", "label": "Portal USCIS"}',
  '2025-07-04',
  'ACTIVE',
  1,
  'USCIS — my.uscis.gov',
  'Portal de pago del AAF para casos USCIS (afirmativos)'
);

INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'AAF_PORTAL_EOIR_URL',
  '{"url": "https://epay.eoir.justice.gov", "label": "Portal EOIR"}',
  '2025-07-04',
  'ACTIVE',
  1,
  'EOIR Forms & Fees — epay.eoir.justice.gov',
  'Portal de pago del AAF para casos EOIR (defensivos)'
);

-- ============================================================
-- EAD — Employment Authorization Document
-- ============================================================

-- Umbral de días para presentar el I-765 (150 días)
INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'EAD_FILING_THRESHOLD_DAYS',
  '{"days": 150}',
  '1995-01-01',
  'ACTIVE',
  1,
  '8 C.F.R. § 208.7(a)(1)',
  'Días válidos de Asylum Clock para poder presentar el I-765 (c)(8)'
);

-- Umbral de días para recibir el EAD (180 días)
INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'EAD_RECEIVE_THRESHOLD_DAYS',
  '{"days": 180}',
  '1995-01-01',
  'ACTIVE',
  1,
  '8 C.F.R. § 208.7(a)(1)',
  'Días válidos de Asylum Clock para poder recibir el EAD (c)(8)'
);

-- Auto-extensión EAD — Regla temporal 540 días
-- Aplica a solicitudes presentadas entre 27-oct-2023 y 30-sep-2025 (CORRECCIÓN-06 / EC-04)
INSERT INTO legal_rules (rule_key, rule_value, effective_date, end_date, status, version, source_citation, notes)
VALUES (
  'EAD_AUTO_EXTENSION_DAYS_LEGACY',
  '{"days": 540, "applies_to_filing_from": "2023-10-27", "applies_to_filing_through": "2025-09-30"}',
  '2023-10-27',
  '2025-09-30',
  'ACTIVE',
  1,
  'USCIS Temporary Final Rule, 89 FR 24248 (April 8, 2024); 8 CFR 274a.13(d)',
  'CORRECCIÓN-06 / EC-04: 540 días de auto-extensión para renovaciones EAD presentadas entre 27-oct-2023 y 30-sep-2025'
);

-- Auto-extensión EAD — Regla base 180 días
-- Aplica a solicitudes presentadas después del 30-sep-2025 (CORRECCIÓN-06 / EC-04)
INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'EAD_AUTO_EXTENSION_DAYS_CURRENT',
  '{"days": 180, "applies_to_filing_from": "2025-10-01"}',
  '2025-10-01',
  'ACTIVE',
  1,
  '8 C.F.R. § 274a.2(b)(1)(vii)',
  'CORRECCIÓN-06 / EC-04: Regla base de 180 días para renovaciones EAD presentadas después del 30-sep-2025'
);

-- Fecha de inicio de la regla de 540 días (EC-04)
INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'EAD_540_DAY_RULE_START',
  '{"date": "2023-10-27"}',
  '2023-10-27',
  'ACTIVE',
  1,
  '89 FR 24248 (April 8, 2024)',
  'EC-04: Inicio del período de vigencia de la regla de 540 días (inclusive)'
);

-- Fecha de fin de la regla de 540 días (EC-04)
INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'EAD_540_DAY_RULE_END',
  '{"date": "2025-09-30"}',
  '2023-10-27',
  'ACTIVE',
  1,
  '89 FR 24248 — Temporary Final Rule expiration',
  'EC-04: Último día (inclusive) en que aplica la regla de 540 días'
);

-- Días de auto-extensión post-regla (EC-04)
INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'EAD_AUTO_EXTENSION_DAYS_POST_RULE',
  '{"days": 180}',
  '2025-10-01',
  'ACTIVE',
  1,
  '8 C.F.R. § 274a.2(b)(1)(vii)',
  'EC-04: Días de auto-extensión aplicables a solicitudes posteriores al 30-sep-2025'
);

-- Banner informativo — NPRM EAD (propuesta de regla pendiente)
INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'INFO_BANNER_EAD_NPRM',
  '{"active": false, "text": "Hay una propuesta de regla del gobierno (NPRM) que podría cambiar los plazos del EAD. Consulte con un abogado para información actualizada."}',
  '2024-01-01',
  'ACTIVE',
  1,
  'USCIS NPRM — EAD proposed rule',
  'Activar (active: true) si la NPRM del EAD se convierte en regla final. Modificar directamente en Supabase.'
);

-- ============================================================
-- ONE-YEAR BAR
-- ============================================================

-- Plazo del one-year bar
INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'ONE_YEAR_BAR_DAYS',
  '{"days": 365, "calculation_method": "addYears", "note": "Usar addYears(entry_date_last, 1) — no addDays(365)"}',
  '1996-01-01',
  'ACTIVE',
  1,
  '8 C.F.R. § 208.4(a)(2)(i)(A); INA § 208(a)(2)(B)',
  'CORRECCIÓN-09: Usar addYears para años bisiestos, no addDays(365)'
);

-- CNMI — Plazo especial (CORRECCIÓN-08)
INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'CNMI_SPECIAL_DEADLINE',
  '{"date": "2030-01-01"}',
  '2009-11-28',
  'ACTIVE',
  1,
  '8 C.F.R. § 208.4(a)(2)(i)(B); Consolidated Natural Resources Act',
  'Plazo especial del one-year bar para solicitantes de las Islas Marianas del Norte (CNMI)'
);

-- ============================================================
-- CONFIGURACIÓN DEL SISTEMA
-- ============================================================

-- EAD Freeze — arquitectura lista, funcionalidad desactivada para MVP
INSERT INTO legal_rules (rule_key, rule_value, effective_date, status, version, source_citation, notes)
VALUES (
  'EAD_FREEZE_ACTIVE',
  '{"active": false}',
  '2025-07-04',
  'ACTIVE',
  1,
  'Interno — arquitectura MVP',
  'Flag de congelamiento del EAD. Desactivado en MVP. Activar solo si USCIS emite instrucción de freeze.'
);
