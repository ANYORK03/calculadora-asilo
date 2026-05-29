-- ============================================================
-- CALCULADORA DE ASILO — Row-Level Security Policies
-- Migración: 002_rls_policies.sql
-- Principio: Una preparadora solo puede ver y modificar sus propios datos.
-- ============================================================

-- Habilitar RLS en todas las tablas con datos de usuarios
ALTER TABLE preparers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE applicants         ENABLE ROW LEVEL SECURITY;
ALTER TABLE derivative_applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases              ENABLE ROW LEVEL SECURITY;
ALTER TABLE i589_data          ENABLE ROW LEVEL SECURITY;
ALTER TABLE aaf_payments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE clock_events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE ead_applications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE hearing_events     ENABLE ROW LEVEL SECURITY;
ALTER TABLE appeals            ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE human_review_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_reports        ENABLE ROW LEVEL SECURITY;

-- legal_rules es de solo lectura para usuarios autenticados
-- Solo un admin (rol especial o service_role) puede modificarlas
ALTER TABLE legal_rules        ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_rules_audit  ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Función helper: obtener el preparer_id del usuario actual
-- ============================================================
CREATE OR REPLACE FUNCTION get_current_preparer_id()
RETURNS UUID AS $$
  SELECT id FROM preparers WHERE email = auth.email()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- POLICIES: preparers
-- Cada preparadora solo ve y edita su propio perfil.
-- ============================================================
CREATE POLICY "preparers: ver propio perfil"
  ON preparers FOR SELECT
  USING (email = auth.email());

CREATE POLICY "preparers: editar propio perfil"
  ON preparers FOR UPDATE
  USING (email = auth.email());

-- El INSERT lo hace el sistema al crear la cuenta (service_role)
-- El DELETE no está permitido desde el cliente

-- ============================================================
-- POLICIES: applicants
-- ============================================================
CREATE POLICY "applicants: ver los propios"
  ON applicants FOR SELECT
  USING (preparer_id = get_current_preparer_id());

CREATE POLICY "applicants: crear"
  ON applicants FOR INSERT
  WITH CHECK (preparer_id = get_current_preparer_id());

CREATE POLICY "applicants: editar los propios"
  ON applicants FOR UPDATE
  USING (preparer_id = get_current_preparer_id());

CREATE POLICY "applicants: eliminar los propios"
  ON applicants FOR DELETE
  USING (preparer_id = get_current_preparer_id());

-- ============================================================
-- POLICIES: derivative_applicants
-- Acceso vía applicant → preparer_id
-- ============================================================
CREATE POLICY "derivative_applicants: ver los propios"
  ON derivative_applicants FOR SELECT
  USING (
    applicant_id IN (
      SELECT id FROM applicants WHERE preparer_id = get_current_preparer_id()
    )
  );

CREATE POLICY "derivative_applicants: crear"
  ON derivative_applicants FOR INSERT
  WITH CHECK (
    applicant_id IN (
      SELECT id FROM applicants WHERE preparer_id = get_current_preparer_id()
    )
  );

CREATE POLICY "derivative_applicants: editar los propios"
  ON derivative_applicants FOR UPDATE
  USING (
    applicant_id IN (
      SELECT id FROM applicants WHERE preparer_id = get_current_preparer_id()
    )
  );

CREATE POLICY "derivative_applicants: eliminar los propios"
  ON derivative_applicants FOR DELETE
  USING (
    applicant_id IN (
      SELECT id FROM applicants WHERE preparer_id = get_current_preparer_id()
    )
  );

-- ============================================================
-- POLICIES: cases
-- ============================================================
CREATE POLICY "cases: ver los propios"
  ON cases FOR SELECT
  USING (preparer_id = get_current_preparer_id());

CREATE POLICY "cases: crear"
  ON cases FOR INSERT
  WITH CHECK (preparer_id = get_current_preparer_id());

CREATE POLICY "cases: editar los propios"
  ON cases FOR UPDATE
  USING (preparer_id = get_current_preparer_id());

CREATE POLICY "cases: eliminar los propios"
  ON cases FOR DELETE
  USING (preparer_id = get_current_preparer_id());

-- ============================================================
-- POLICIES: i589_data
-- Acceso vía case → preparer_id
-- ============================================================
CREATE POLICY "i589_data: ver los propios"
  ON i589_data FOR SELECT
  USING (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

CREATE POLICY "i589_data: crear"
  ON i589_data FOR INSERT
  WITH CHECK (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

CREATE POLICY "i589_data: editar los propios"
  ON i589_data FOR UPDATE
  USING (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

-- ============================================================
-- POLICIES: aaf_payments
-- ============================================================
CREATE POLICY "aaf_payments: ver los propios"
  ON aaf_payments FOR SELECT
  USING (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

CREATE POLICY "aaf_payments: crear"
  ON aaf_payments FOR INSERT
  WITH CHECK (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

CREATE POLICY "aaf_payments: editar los propios"
  ON aaf_payments FOR UPDATE
  USING (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

-- ============================================================
-- POLICIES: clock_events
-- ============================================================
CREATE POLICY "clock_events: ver los propios"
  ON clock_events FOR SELECT
  USING (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

CREATE POLICY "clock_events: crear"
  ON clock_events FOR INSERT
  WITH CHECK (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

CREATE POLICY "clock_events: editar los propios"
  ON clock_events FOR UPDATE
  USING (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

-- ============================================================
-- POLICIES: ead_applications
-- ============================================================
CREATE POLICY "ead_applications: ver los propios"
  ON ead_applications FOR SELECT
  USING (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

CREATE POLICY "ead_applications: crear"
  ON ead_applications FOR INSERT
  WITH CHECK (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

CREATE POLICY "ead_applications: editar los propios"
  ON ead_applications FOR UPDATE
  USING (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

-- ============================================================
-- POLICIES: hearing_events
-- ============================================================
CREATE POLICY "hearing_events: ver los propios"
  ON hearing_events FOR SELECT
  USING (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

CREATE POLICY "hearing_events: crear"
  ON hearing_events FOR INSERT
  WITH CHECK (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

CREATE POLICY "hearing_events: editar los propios"
  ON hearing_events FOR UPDATE
  USING (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

-- ============================================================
-- POLICIES: appeals
-- ============================================================
CREATE POLICY "appeals: ver los propios"
  ON appeals FOR SELECT
  USING (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

CREATE POLICY "appeals: crear"
  ON appeals FOR INSERT
  WITH CHECK (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

CREATE POLICY "appeals: editar los propios"
  ON appeals FOR UPDATE
  USING (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

-- ============================================================
-- POLICIES: calculation_results
-- ============================================================
CREATE POLICY "calculation_results: ver los propios"
  ON calculation_results FOR SELECT
  USING (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

-- El INSERT lo hace la API Route con service_role
-- No se permite INSERT/UPDATE/DELETE desde el cliente

-- ============================================================
-- POLICIES: human_review_flags
-- ============================================================
CREATE POLICY "human_review_flags: ver los propios"
  ON human_review_flags FOR SELECT
  USING (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

CREATE POLICY "human_review_flags: actualizar estado de revisión"
  ON human_review_flags FOR UPDATE
  USING (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

-- ============================================================
-- POLICIES: pdf_reports
-- ============================================================
CREATE POLICY "pdf_reports: ver los propios"
  ON pdf_reports FOR SELECT
  USING (
    case_id IN (
      SELECT id FROM cases WHERE preparer_id = get_current_preparer_id()
    )
  );

-- ============================================================
-- POLICIES: legal_rules
-- Todos los usuarios autenticados pueden leer.
-- Solo service_role puede escribir (actualización directa en Supabase).
-- ============================================================
CREATE POLICY "legal_rules: lectura pública autenticada"
  ON legal_rules FOR SELECT
  TO authenticated
  USING (status = 'ACTIVE');

-- ============================================================
-- POLICIES: legal_rules_audit
-- Solo lectura para usuarios autenticados
-- ============================================================
CREATE POLICY "legal_rules_audit: lectura para autenticados"
  ON legal_rules_audit FOR SELECT
  TO authenticated
  USING (TRUE);
