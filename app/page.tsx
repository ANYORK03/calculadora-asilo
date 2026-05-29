"use client";

import { useState } from "react";

// ─── Helpers ────────────────────────────────────────────────────────────────

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function daysSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "aaf" | "permiso" | "erequest";
type CaseType = "uscis" | "corte" | "nose";

// ─── Shared UI ───────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-[#1e3a5f] mb-1">{children}</h2>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {children}
    </label>
  );
}

function DateInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  return (
    <input
      type="date"
      value={value}
      max={today}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function ToggleButtons({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex gap-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
            value === opt.value
              ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ResultBox({
  color,
  children,
}: {
  color: "green" | "yellow" | "blue" | "red" | "gray";
  children: React.ReactNode;
}) {
  const colors: Record<string, string> = {
    green: "bg-green-50 border-green-400 text-green-800",
    yellow: "bg-yellow-50 border-yellow-400 text-yellow-800",
    blue: "bg-blue-50 border-blue-400 text-blue-800",
    red: "bg-red-50 border-red-400 text-red-800",
    gray: "bg-gray-50 border-gray-300 text-gray-700",
  };
  return (
    <div className={`border-l-4 rounded-r-lg p-4 mt-4 ${colors[color]}`}>
      {children}
    </div>
  );
}

// ─── Calculadora AAF ──────────────────────────────────────────────────────────

function CalculadoraAAF() {
  const [fecha, setFecha] = useState("");
  const [tipoCase, setTipoCase] = useState<CaseType>("nose");
  const [pagado, setPagado] = useState("");

  const fechaDate = fecha ? new Date(fecha + "T12:00:00") : null;
  const dias = fechaDate ? daysSince(fechaDate) : null;

  let result: React.ReactNode = null;

  if (fecha && pagado !== "") {
    if (pagado === "si") {
      result = (
        <ResultBox color="green">
          <p className="font-bold text-lg">✅ Ya pagaste la tarifa AAF</p>
          <p className="text-sm mt-1">
            No debes ningún pago adicional por este concepto en este momento.
          </p>
        </ResultBox>
      );
    } else {
      let contexto = "";
      let colorResult: "yellow" | "red" = "yellow";

      if (tipoCase === "uscis") {
        contexto =
          "Para casos USCIS, consulta con un representante autorizado para confirmar tu fecha límite exacta.";
      } else if (tipoCase === "corte") {
        contexto =
          "Para casos ante la Corte de Inmigración, confirma con tu abogado si la tarifa AAF aplica a tu situación.";
        colorResult = "red";
      } else {
        contexto =
          "Si no sabes qué tipo de caso tienes, contacta a un representante antes de hacer cualquier pago.";
        colorResult = "yellow";
      }

      const fechaEstimada = fechaDate ? addDays(fechaDate, 30) : null;

      result = (
        <ResultBox color={colorResult}>
          <p className="font-bold text-2xl">💰 Monto estimado: $102</p>
          {fechaEstimada && (
            <p className="text-sm mt-2">
              Fecha de referencia:{" "}
              <span className="font-semibold">{formatDate(fechaEstimada)}</span>
            </p>
          )}
          {dias !== null && (
            <p className="text-sm mt-1">
              Han pasado{" "}
              <span className="font-semibold">{dias} días</span> desde tu
              I-589.
            </p>
          )}
          <p className="text-sm mt-3 opacity-80">{contexto}</p>
        </ResultBox>
      );
    }
  }

  return (
    <div className="space-y-4">
      <SectionTitle>Calculadora de Tarifa AAF</SectionTitle>
      <p className="text-sm text-gray-600">
        La tarifa AAF ($102) aplica a ciertos solicitantes de asilo. Ingresa tu
        información para ver tu situación.
      </p>

      <div>
        <Label>¿Cuándo presentaste tu I-589?</Label>
        <DateInput value={fecha} onChange={setFecha} />
      </div>

      <div>
        <Label>Tipo de caso</Label>
        <Select
          value={tipoCase}
          onChange={(v) => setTipoCase(v as CaseType)}
          options={[
            { value: "nose", label: "No sé / No estoy seguro" },
            { value: "uscis", label: "USCIS (Caso afirmativo)" },
            { value: "corte", label: "Corte de Inmigración (Caso defensivo)" },
          ]}
        />
      </div>

      <div>
        <Label>¿Ya pagaste la tarifa AAF?</Label>
        <ToggleButtons
          value={pagado}
          onChange={setPagado}
          options={[
            { value: "si", label: "Sí, ya pagué" },
            { value: "no", label: "No he pagado" },
          ]}
        />
      </div>

      {result}
    </div>
  );
}

// ─── Calculadora Permiso de Trabajo ──────────────────────────────────────────

function CalculadoraPermiso() {
  const [fecha, setFecha] = useState("");
  const [relojDetenido, setRelojDetenido] = useState("");

  const fechaDate = fecha ? new Date(fecha + "T12:00:00") : null;
  const dias = fechaDate ? daysSince(fechaDate) : null;

  const DIA_PRESENTAR = 150;
  const DIA_RECIBIR = 180;

  let result: React.ReactNode = null;

  if (fecha && relojDetenido !== "") {
    if (relojDetenido === "si") {
      result = (
        <ResultBox color="red">
          <p className="font-bold text-lg">⏸️ Tu reloj está detenido</p>
          <p className="text-sm mt-2">
            Si tu reloj de asilo está detenido, los días no cuentan hacia el
            período de espera de 180 días. Necesitas resolver esta situación
            antes de continuar.
          </p>
          <p className="text-sm mt-2 font-medium">
            Contacta a un representante autorizado para saber cómo reactivar tu
            caso.
          </p>
        </ResultBox>
      );
    } else if (fechaDate && dias !== null) {
      const fechaPresentar = addDays(fechaDate, DIA_PRESENTAR);
      const fechaRecibir = addDays(fechaDate, DIA_RECIBIR);
      const puedePresent = dias >= DIA_PRESENTAR;
      const puedeRecibir = dias >= DIA_RECIBIR;

      result = (
        <ResultBox color={puedePresent ? "green" : "blue"}>
          <p className="font-bold text-lg mb-3">📋 Estado de tu Permiso de Trabajo</p>

          <div className="space-y-3">
            <div
              className={`p-3 rounded-lg ${
                puedePresent ? "bg-green-100" : "bg-white bg-opacity-60"
              }`}
            >
              <p className="font-semibold text-sm">
                {puedePresent ? "✅" : "⏳"} Presentar solicitud (Día 150)
              </p>
              <p className="text-sm mt-0.5">
                {puedePresent
                  ? `Ya puedes presentar — llevas ${dias} días`
                  : `Fecha estimada: ${formatDate(fechaPresentar)} (faltan ${
                      DIA_PRESENTAR - dias
                    } días)`}
              </p>
            </div>

            <div
              className={`p-3 rounded-lg ${
                puedeRecibir ? "bg-green-100" : "bg-white bg-opacity-60"
              }`}
            >
              <p className="font-semibold text-sm">
                {puedeRecibir ? "✅" : "⏳"} Recibir tu EAD (Día 180)
              </p>
              <p className="text-sm mt-0.5">
                {puedeRecibir
                  ? `Ya deberías haber recibido tu EAD — llevas ${dias} días`
                  : `Fecha estimada: ${formatDate(fechaRecibir)} (faltan ${
                      DIA_RECIBIR - dias
                    } días)`}
              </p>
            </div>
          </div>

          <p className="text-xs mt-3 opacity-75">
            Llevas <strong>{dias} días</strong> desde la fecha de recibo de tu
            I-589.
          </p>
        </ResultBox>
      );
    }
  }

  return (
    <div className="space-y-4">
      <SectionTitle>Calculadora de Permiso de Trabajo (EAD)</SectionTitle>
      <p className="text-sm text-gray-600">
        Después de presentar el I-589, tienes que esperar{" "}
        <strong>150 días</strong> para solicitar y{" "}
        <strong>180 días</strong> para recibir tu permiso de trabajo.
      </p>

      <div>
        <Label>Fecha del recibo de tu I-589</Label>
        <DateInput value={fecha} onChange={setFecha} />
      </div>

      <div>
        <Label>¿Tu reloj de asilo está detenido?</Label>
        <p className="text-xs text-gray-500 mb-2">
          El reloj se detiene si causaste retrasos en tu caso (solicitudes de
          continuance, por ejemplo).
        </p>
        <ToggleButtons
          value={relojDetenido}
          onChange={setRelojDetenido}
          options={[
            { value: "no", label: "No, está corriendo" },
            { value: "si", label: "Sí, está detenido" },
          ]}
        />
      </div>

      {result}
    </div>
  );
}

// ─── Calculadora E-Request ────────────────────────────────────────────────────

function CalculadoraERequest() {
  const [fecha, setFecha] = useState("");

  const fechaDate = fecha ? new Date(fecha + "T12:00:00") : null;
  const dias = fechaDate ? daysSince(fechaDate) : null;

  let result: React.ReactNode = null;

  if (fecha && dias !== null) {
    if (dias < 60) {
      result = (
        <ResultBox color="gray">
          <p className="font-bold text-lg">⏳ Aún no es tiempo</p>
          <p className="text-sm mt-1">
            Han pasado <strong>{dias} días</strong> desde tu I-765. Necesitas
            esperar al menos <strong>60 días</strong> para enviar un E-Request.
          </p>
          <p className="text-sm mt-1">
            Faltan <strong>{60 - dias} días</strong> para el mínimo.
          </p>
        </ResultBox>
      );
    } else if (dias < 90) {
      result = (
        <ResultBox color="yellow">
          <p className="font-bold text-lg">📬 Puedes enviar E-Request</p>
          <p className="text-sm mt-1">
            Han pasado <strong>{dias} días</strong>. Ya puedes enviar un
            E-Request estándar a USCIS.
          </p>
          <p className="text-sm mt-2">
            Si llegas a <strong>90 días</strong>, puedes solicitar revisión
            expedita. Te faltan <strong>{90 - dias} días</strong>.
          </p>
        </ResultBox>
      );
    } else {
      result = (
        <ResultBox color="red">
          <p className="font-bold text-lg">🚨 E-Request Urgente (90+ días)</p>
          <p className="text-sm mt-1">
            Han pasado <strong>{dias} días</strong>. Llevas más de 90 días sin
            recibir tu EAD. Esto es una demora significativa.
          </p>
          <p className="text-sm mt-2 font-medium">
            Puedes enviar un E-Request urgente y considera escalar el caso con
            un representante autorizado.
          </p>
        </ResultBox>
      );
    }
  }

  return (
    <div className="space-y-4">
      <SectionTitle>Calculadora E-Request (I-765)</SectionTitle>
      <p className="text-sm text-gray-600">
        Si enviaste tu I-765 y no has recibido respuesta, el E-Request te
        permite consultar el estado. A los <strong>60 días</strong> puedes
        solicitarlo; a los <strong>90 días</strong> se considera urgente.
      </p>

      <div>
        <Label>¿Cuándo enviaste tu I-765?</Label>
        <DateInput value={fecha} onChange={setFecha} />
      </div>

      {result}

      {dias !== null && dias >= 60 && (
        <a
          href="https://egov.uscis.gov/e-request/Intro.do"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ir al portal E-Request de USCIS →
        </a>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "aaf", label: "Tarifa AAF", emoji: "💰" },
  { id: "permiso", label: "Permiso de Trabajo", emoji: "📋" },
  { id: "erequest", label: "E-Request", emoji: "📬" },
];

const WHATSAPP_NUMBER = "13123075331";
const WHATSAPP_MSG = encodeURIComponent(
  "Hola, usé la calculadora de asilo y tengo una pregunta sobre mi caso."
);

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("aaf");

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1e3a5f] to-[#2d5282]">
      {/* Hero */}
      <section className="text-white px-4 py-10 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block bg-white bg-opacity-15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Herramienta gratuita
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
            Calculadora de Fechas
            <br />
            <span className="text-yellow-300">para tu Caso de Asilo</span>
          </h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-lg mx-auto">
            Calcula tu tarifa AAF, cuándo puedes pedir tu permiso de trabajo y
            si calificas para un E-Request — en segundos, sin guardar tus datos.
          </p>
          <p className="text-blue-200 text-xs mt-3">
            🔒 No guardamos ningún dato. Todo se calcula en tu dispositivo.
          </p>
        </div>
      </section>

      {/* Card principal */}
      <section className="px-4 pb-10">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-2 text-xs sm:text-sm font-semibold transition-all flex flex-col items-center gap-0.5 sm:flex-row sm:justify-center sm:gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-[#1e3a5f] text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Contenido */}
          <div className="p-5 sm:p-6">
            {activeTab === "aaf" && <CalculadoraAAF />}
            {activeTab === "permiso" && <CalculadoraPermiso />}
            {activeTab === "erequest" && <CalculadoraERequest />}
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border-t border-amber-200 px-5 py-4">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>⚠️ Aviso importante:</strong> Esta herramienta es solo
              informativa y no constituye asesoría legal. Los cálculos son
              estimados y pueden no aplicar a tu caso específico. Siempre
              consulta con un abogado de inmigración o representante acreditado
              antes de tomar decisiones legales.
            </p>
          </div>
        </div>

        {/* CTA WhatsApp */}
        <div className="max-w-2xl mx-auto mt-6 text-center">
          <p className="text-blue-100 text-sm mb-3">
            ¿Tienes dudas sobre tu caso? Habla con un representante.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all text-sm"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.504 3.935 1.389 5.612L0 24l6.545-1.371A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.012-1.378l-.36-.214-3.732.98.998-3.648-.235-.374A9.787 9.787 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182c5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z" />
            </svg>
            Consultar por WhatsApp
          </a>
          <p className="text-blue-200 text-xs mt-3">
            Respuesta típica en menos de 24 horas
          </p>
        </div>

        {/* Footer */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <p className="text-blue-300 text-xs">
            Esta herramienta es proporcionada sin garantías. No somos abogados.
            Para asesoría legal, contacta a un profesional acreditado.
          </p>
        </div>
      </section>
    </main>
  );
}
