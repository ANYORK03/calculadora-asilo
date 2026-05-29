-- ============================================================
-- CALCULADORA DE ASILO — Schema inicial
-- Migración: 001_initial_schema.sql
-- ============================================================

-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMs
-- ============================================================

CREATE TYPE plan_type AS ENUM ('MVP', 'PRO', 'ENTERPRISE');

CREATE TYPE case_type AS ENUM (
  'USCIS_AFFIRMATIVE',
  'EOIR_DEFENSIVE',
  'TRANSFERRED',
  'APPEALED_BIA',
  'APPEALED_CIRCUIT'
);

CREATE TYPE case_status AS ENUM (
  'PENDING',
  'APPROVED',
  'DENIED_IJ',
  'DENIED_FINAL',
  'CLOSED_ADMIN',
  'REOPENED',
  'WITHDRAWN',
  'APPEALED_BIA',
  'APPEALED_CIRCUIT'
);

CREATE TYPE transfer_agency AS ENUM ('USCIS', 'EOIR');

CREATE TYPE one_year_bar_exception_type AS ENUM (
  'CHANGED_CIRCUMSTANCES',
  'EXTRAORDINARY_CIRCUMSTANCES',
  'MINOR',
  'CNMI',
  'UNACCOMPANIED_MINOR'
);

-- Causa de pausas del clock — EC-05
-- Applicant-caused pausan AMBOS clocks; Gov/Court solo pausan AAF clock
CREATE TYPE clock_pause_cause AS ENUM (
  'CONTINUANCE_BY_APPLICANT',
  'FTA_FAILURE_TO_APPEAR',
  'DOCUMENT_REQUEST_NOT_MET',
  'CONTINUANCE_BY_GOVERNMENT',
  'CONTINUANCE_BY_COURT',
  'ADMINISTRATIVE_DELAY',
  'UNKNOWN'
);

CREATE TYPE clock_event_type AS ENUM ('PAUSE', 'RESET');

CREATE TYPE payment_portal AS ENUM ('USCIS', 'EOIR', 'UNKNOWN');

CREATE TYPE ead_application_type AS ENUM ('INITIAL', 'RENEWAL');

CREATE TYPE ead_status AS ENUM (
  'PENDING',
  'ACTIVE',
  'EXPIRED',
  'AUTO_EXTENDED',
  'DENIED'
);

-- AAF status — incluye estados de EC-06
CREATE TYPE aaf_status AS ENUM (
  'NOT_YET_DUE',
  'DUE_SOON',
  'OVERDUE',
  'NOT_APPLICABLE',
  'SUSPENDED_PERIOD',
  'WAIVED_PM2601',
  'REQUIRES_HUMAN_REVIEW'
);

CREATE TYPE aaf_regime AS ENUM ('REGIME_A', 'REGIME_B', 'REGIME_C', 'REGIME_WAIVER');

CREATE TYPE legal_rule_status AS ENUM ('ACTIVE', 'SUSPENDED', 'SUPERSEDED', 'PENDING');

CREATE TYPE legal_rule_audit_action AS ENUM ('CREATED', 'UPDATED', 'SUSPENDED', 'SUPERSEDED');

CREATE TYPE derivative_relationship AS ENUM ('SPOUSE', 'CHILD');

CREATE TYPE appeal_type AS ENUM (
  'BIA',
  'CIRCUIT_COURT',
  'MOTION_TO_REOPEN',
  'MOTION_TO_RECONSIDER'
);

CREATE TYPE appeal_status AS ENUM ('PENDING', 'GRANTED', 'DENIED', 'WITHDRAWN');

CREATE TYPE hearing_type AS ENUM ('MASTER', 'MERITS', 'OTHER');

CREATE TYPE hearing_status AS ENUM ('SCHEDULED', 'COMPLETED', 'CONTINUED', 'CANCELLED');

CREATE TYPE human_review_status AS ENUM ('PENDING', 'REVIEWED', 'ESCALATED');

-- ============================================================
-- TABLA: preparers
-- ============================================================
CREATE TABLE preparers (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email          VARCHAR(255) NOT NULL UNIQUE,
  full_name      VARCHAR(200) NOT NULL,
  organization   VARCHAR(200),
  phone_whatsapp VARCHAR(20),
  plan           plan_type NOT NULL DEFAULT 'MVP',
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_preparers_email ON preparers(email);

-- ============================================================
-- TABLA: applicants
-- ============================================================
CREATE TABLE applicants (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  preparer_id          UUID NOT NULL REFERENCES preparers(id) ON DELETE CASCADE,
  full_name            VARCHAR(200) NOT NULL,
  date_of_birth        DATE,
  country_of_origin    VARCHAR(100),
  a_number             VARCHAR(9),
  entry_date_last      DATE NOT NULL,
  entry_was_inspected  BOOLEAN,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_applicants_preparer_id ON applicants(preparer_id);
CREATE INDEX idx_applicants_a_number    ON applicants(a_number);

-- ============================================================
-- TABLA: derivative_applicants
-- ============================================================
CREATE TABLE derivative_applicants (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_id   UUID NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  full_name      VARCHAR(200) NOT NULL,
  date_of_birth  DATE NOT NULL,
  relationship   derivative_relationship NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_derivative_applicant_id ON derivative_applicants(applicant_id);

-- ============================================================
-- TABLA: cases
-- ============================================================
CREATE TABLE cases (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_id        UUID NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  preparer_id         UUID NOT NULL REFERENCES preparers(id) ON DELETE CASCADE,
  case_type           case_type NOT NULL,
  case_status         case_status NOT NULL DEFAULT 'PENDING',
  court_location      VARCHAR(100),
  -- CORRECCIÓN-08: campo booleano estructurado para CNMI
  is_cnmi_case        BOOLEAN NOT NULL DEFAULT FALSE,
  was_transferred     BOOLEAN NOT NULL DEFAULT FALSE,
  transfer_from       transfer_agency,
  transfer_to         transfer_agency,
  transfer_date       DATE,
  case_denial_date    DATE,
  case_approval_date  DATE,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cases_preparer_id  ON cases(preparer_id);
CREATE INDEX idx_cases_applicant_id ON cases(applicant_id);
CREATE INDEX idx_cases_case_status  ON cases(case_status);
CREATE INDEX idx_cases_case_type    ON cases(case_type);

-- ============================================================
-- TABLA: i589_data
-- ============================================================
CREATE TABLE i589_data (
  id                              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id                         UUID NOT NULL UNIQUE REFERENCES cases(id) ON DELETE CASCADE,
  filing_date                     DATE,
  was_returned                    BOOLEAN NOT NULL DEFAULT FALSE,
  return_date                     DATE,
  received_date                   DATE NOT NULL,
  initial_fee_paid                BOOLEAN,
  initial_fee_date                DATE,
  one_year_bar_exceeded           BOOLEAN NOT NULL DEFAULT FALSE,
  one_year_bar_exception_type     one_year_bar_exception_type,
  created_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_i589_case_id ON i589_data(case_id);

-- ============================================================
-- TABLA: aaf_payments
-- ============================================================
CREATE TABLE aaf_payments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id           UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  payment_date      DATE NOT NULL,
  amount_paid       DECIMAL(10,2) NOT NULL,
  payment_portal    payment_portal NOT NULL,
  tracking_id       VARCHAR(100),
  is_valid          BOOLEAN NOT NULL DEFAULT TRUE,
  validation_notes  TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_aaf_payments_case_id      ON aaf_payments(case_id);
CREATE INDEX idx_aaf_payments_payment_date ON aaf_payments(payment_date);

-- ============================================================
-- TABLA: clock_events
-- ============================================================
CREATE TABLE clock_events (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id        UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  event_type     clock_event_type NOT NULL,
  cause          clock_pause_cause NOT NULL DEFAULT 'UNKNOWN',
  event_start    DATE NOT NULL,
  event_end      DATE,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  duration_days  INTEGER,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clock_events_case_id    ON clock_events(case_id);
CREATE INDEX idx_clock_events_event_type ON clock_events(event_type);
CREATE INDEX idx_clock_events_is_active  ON clock_events(is_active);

-- ============================================================
-- TABLA: ead_applications
-- ============================================================
CREATE TABLE ead_applications (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id                 UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  application_type        ead_application_type NOT NULL,
  category                VARCHAR(10) NOT NULL DEFAULT 'c8',
  filing_date             DATE,
  approval_date           DATE,
  expiration_date         DATE,
  ead_status              ead_status NOT NULL DEFAULT 'PENDING',
  auto_extension_days     INTEGER,
  auto_extension_expires  DATE,
  biometrics_completed    BOOLEAN,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ead_applications_case_id ON ead_applications(case_id);

-- ============================================================
-- TABLA: hearing_events
-- ============================================================
CREATE TABLE hearing_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id         UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  hearing_type    hearing_type NOT NULL,
  hearing_date    DATE NOT NULL,
  hearing_status  hearing_status NOT NULL DEFAULT 'SCHEDULED',
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hearing_events_case_id      ON hearing_events(case_id);
CREATE INDEX idx_hearing_events_hearing_date ON hearing_events(hearing_date);

-- ============================================================
-- TABLA: appeals
-- ============================================================
CREATE TABLE appeals (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id        UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  appeal_type    appeal_type NOT NULL,
  appeal_status  appeal_status NOT NULL DEFAULT 'PENDING',
  filed_date     DATE,
  decision_date  DATE,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appeals_case_id ON appeals(case_id);

-- ============================================================
-- TABLA: legal_rules
-- ============================================================
CREATE TABLE legal_rules (
  rule_key        VARCHAR(100) PRIMARY KEY,
  rule_value      JSONB NOT NULL,
  effective_date  DATE NOT NULL,
  end_date        DATE,
  status          legal_rule_status NOT NULL DEFAULT 'ACTIVE',
  version         INTEGER NOT NULL DEFAULT 1,
  source_url      TEXT,
  source_citation TEXT,
  notes           TEXT,
  created_by      UUID REFERENCES preparers(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_legal_rules_status         ON legal_rules(status);
CREATE INDEX idx_legal_rules_effective_date ON legal_rules(effective_date);

-- ============================================================
-- TABLA: legal_rules_audit
-- ============================================================
CREATE TABLE legal_rules_audit (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_key    VARCHAR(100) NOT NULL,
  action      legal_rule_audit_action NOT NULL,
  old_value   JSONB,
  new_value   JSONB,
  changed_by  UUID REFERENCES preparers(id),
  changed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reason      TEXT,
  source_url  TEXT
);

CREATE INDEX idx_legal_rules_audit_rule_key ON legal_rules_audit(rule_key);

-- ============================================================
-- TABLA: calculation_results
-- ============================================================
CREATE TABLE calculation_results (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id                 UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  evaluation_date         DATE NOT NULL,
  rules_version           VARCHAR(50) NOT NULL,
  result_json             JSONB NOT NULL,
  human_review_required   BOOLEAN NOT NULL DEFAULT FALSE,
  aaf_status              aaf_status,
  ead_status              ead_status,
  clock_valid_days        INTEGER,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_calc_results_case_id               ON calculation_results(case_id);
CREATE INDEX idx_calc_results_human_review_required ON calculation_results(human_review_required);
CREATE INDEX idx_calc_results_aaf_status            ON calculation_results(aaf_status);
CREATE INDEX idx_calc_results_created_at            ON calculation_results(created_at DESC);

-- ============================================================
-- TABLA: human_review_flags
-- ============================================================
CREATE TABLE human_review_flags (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  calculation_result_id   UUID NOT NULL REFERENCES calculation_results(id) ON DELETE CASCADE,
  case_id                 UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  reason_code             VARCHAR(100) NOT NULL,
  reason_description      TEXT NOT NULL,
  is_blocking             BOOLEAN NOT NULL DEFAULT FALSE,
  review_status           human_review_status NOT NULL DEFAULT 'PENDING',
  reviewed_by             UUID REFERENCES preparers(id),
  reviewed_at             TIMESTAMPTZ,
  review_notes            TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_human_review_flags_calc_result_id ON human_review_flags(calculation_result_id);
CREATE INDEX idx_human_review_flags_case_id        ON human_review_flags(case_id);
CREATE INDEX idx_human_review_flags_review_status  ON human_review_flags(review_status);

-- ============================================================
-- TABLA: pdf_reports
-- ============================================================
CREATE TABLE pdf_reports (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  calculation_result_id   UUID NOT NULL REFERENCES calculation_results(id) ON DELETE CASCADE,
  case_id                 UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  storage_path            TEXT NOT NULL,
  signed_url              TEXT,
  url_expires_at          TIMESTAMPTZ,
  generated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pdf_reports_case_id               ON pdf_reports(case_id);
CREATE INDEX idx_pdf_reports_calculation_result_id ON pdf_reports(calculation_result_id);

-- ============================================================
-- Trigger: updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_preparers_updated_at
  BEFORE UPDATE ON preparers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_applicants_updated_at
  BEFORE UPDATE ON applicants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
