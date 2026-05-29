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
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8962e]"
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
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8962e] bg-white"
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
              : "bg-white text-gray-700 border-gray-300 hover:border-[#b8962e]"
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
  color: "green" | "yellow" | "blue" | "red" | "gray" | "gold";
  children: React.ReactNode;
}) {
  const colors: Record<string, string> = {
    green: "bg-green-50 border-green-400 text-green-800",
    yellow: "bg-yellow-50 border-yellow-400 text-yellow-800",
    blue: "bg-blue-50 border-blue-400 text-blue-800",
    red: "bg-red-50 border-red-400 text-red-800",
    gray: "bg-gray-50 border-gray-300 text-gray-700",
    gold: "bg-amber-50 border-[#b8962e] text-amber-900",
  };
  return (
    <div className={`border-l-4 rounded-r-lg p-4 mt-4 ${colors[color]}`}>
      {children}
    </div>
  );
}

function AlertCorte() {
  return (
    <div className="mt-3 bg-orange-50 border border-orange-300 rounded-lg px-4 py-3 text-sm text-orange-800">
      ⚠️ <strong>Caso ante la Corte:</strong> Confirma siempre con tu
      preparadora o abogado antes de realizar cualquier pago.
    </div>
  );
}

function NoteEstimacion() {
  return (
    <p className="text-xs mt-3 text-gray-500 italic">
      Esto no confirma obligación legal. Es una estimación para ayudarte a
      orientarte.
    </p>
  );
}

// ─── Calculadora AAF ──────────────────────────────────────────────────────────

function CalculadoraAAF() {
  const [fecha, setFecha] = useState("");
  const [tipoCase, setTipoCase] = useState<CaseType>("nose");
  const [pagado, setPagado] = useState("");
  const [fechaPago, setFechaPago] = useState("");

  const fechaDate = fecha ? new Date(fecha + "T12:00:00") : null;
  const dias = fechaDate ? daysSince(fechaDate) : null;

  let result: React.ReactNode = null;

  if (fecha && pagado !== "") {
    if (pagado === "si") {
      result = (
        <>
          <ResultBox color="green">
            <p className="font-bold text-lg">✅ Pago registrado por el usuario</p>
            <p className="text-sm mt-1">
              Indicaste que ya pagaste la tarifa AAF. Guarda tu comprobante de
              pago en un lugar seguro.
            </p>
            {fechaPago && (
              <p className="text-sm mt-2">
                Fecha de pago registrada:{" "}
                <span className="font-semibold">
                  {formatDate(new Date(fechaPago + "T12:00:00"))}
                </span>
              </p>
            )}
            <NoteEstimacion />
          </ResultBox>
        </>
      );
    } else {
      result = (
        <>
          <ResultBox color={tipoCase === "corte" ? "red" : "gold"}>
            <p className="font-bold text-lg">
              {tipoCase === "nose"
                ? "⚠️ Aún no parece necesario pagar la tarifa AAF"
                : "📋 Sí, probablemente debes pagar la tarifa AAF"}
            </p>

            <div className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monto actual:</span>
                <span className="font-bold text-lg text-[#b8962e]">$102</span>
              </div>
              {dias !== null && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Días desde tu I-589:</span>
                  <span className="font-semibold">{dias} días</span>
                </div>
              )}
              {fechaDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de tu I-589:</span>
                  <span className="font-semibold">{formatDate(fechaDate)}</span>
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-current border-opacity-20 text-sm">
              <p className="font-medium">Próximo paso recomendado:</p>
              <p className="mt-1 opacity-80">
                {tipoCase === "uscis"
                  ? "Consulta con tu preparadora para confirmar la fecha exacta de pago y el método correcto."
                  : tipoCase === "corte"
                  ? "Habla con tu preparadora o abogado antes de realizar cualquier pago."
                  : "Primero identifica tu tipo de caso (USCIS o Corte) antes de pagar."}
              </p>
            </div>

            <NoteEstimacion />
          </ResultBox>

          {tipoCase === "corte" && <AlertCorte />}
        </>
      );
    }
  }

  return (
    <div className="space-y-4">
      <SectionTitle>Tarifa de Asilo (AAF)</SectionTitle>
      <p className="text-xs text-[#b8962e] font-medium mb-1">
        Te ayuda a identificar si podrías estar sujeto al pago anual de la tarifa de asilo.
      </p>
      <p className="text-sm text-gray-600">
        La tarifa anual de asilo (AAF) es un pago de $102 que aplica a ciertos
        solicitantes. Ingresa tu información para ver tu situación.
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

      {pagado === "si" && (
        <div>
          <Label>¿Cuándo pagaste la tarifa AAF?</Label>
          <DateInput value={fechaPago} onChange={setFechaPago} />
        </div>
      )}

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
          <p className="font-bold text-lg">⏸️ Tu caso requiere revisión</p>
          <p className="text-sm mt-2">
            Si tu reloj de asilo está detenido, los días no cuentan hacia el
            período de espera. Necesitas resolver esta situación antes de
            continuar.
          </p>
          <p className="text-sm mt-2 font-medium">
            Habla con tu preparadora para entender cómo reactivar tu caso.
          </p>
          <NoteEstimacion />
        </ResultBox>
      );
    } else if (fechaDate && dias !== null) {
      const fechaPresentar = addDays(fechaDate, DIA_PRESENTAR);
      const fechaRecibir = addDays(fechaDate, DIA_RECIBIR);
      const puedePresent = dias >= DIA_PRESENTAR;
      const puedeRecibir = dias >= DIA_RECIBIR;

      result = (
        <ResultBox color={puedePresent ? "green" : "blue"}>
          <p className="font-bold text-lg mb-3">
            📋 Estado de tu Permiso de Trabajo
          </p>

          <div className="space-y-3">
            <div
              className={`p-3 rounded-lg border ${
                puedePresent
                  ? "bg-green-100 border-green-300"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-sm">
                    {puedePresent ? "✅" : "⏳"} Día 150 — Presentar solicitud
                  </p>
                  <p className="text-sm mt-0.5 text-gray-600">
                    {puedePresent
                      ? "Ya puedes preparar tu solicitud"
                      : "Aún debes esperar"}
                  </p>
                </div>
                <span className="text-xs font-medium whitespace-nowrap mt-0.5">
                  {puedePresent
                    ? `Hace ${dias - DIA_PRESENTAR}d`
                    : `Faltan ${DIA_PRESENTAR - dias}d`}
                </span>
              </div>
              {!puedePresent && (
                <p className="text-xs text-gray-500 mt-1">
                  Fecha estimada: {formatDate(fechaPresentar)}
                </p>
              )}
            </div>

            <div
              className={`p-3 rounded-lg border ${
                puedeRecibir
                  ? "bg-green-100 border-green-300"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-sm">
                    {puedeRecibir ? "✅" : "⏳"} Día 180 — Recibir tu EAD
                  </p>
                  <p className="text-sm mt-0.5 text-gray-600">
                    {puedeRecibir
                      ? "Ya deberías haber recibido aprobación"
                      : "Aún debes esperar"}
                  </p>
                </div>
                <span className="text-xs font-medium whitespace-nowrap mt-0.5">
                  {puedeRecibir
                    ? `Hace ${dias - DIA_RECIBIR}d`
                    : `Faltan ${DIA_RECIBIR - dias}d`}
                </span>
              </div>
              {!puedeRecibir && (
                <p className="text-xs text-gray-500 mt-1">
                  Fecha estimada: {formatDate(fechaRecibir)}
                </p>
              )}
            </div>
          </div>

          <p className="text-xs mt-3 text-gray-500">
            Llevas <strong>{dias} días</strong> desde la fecha de recibo de tu
            I-589.
          </p>
          <NoteEstimacion />
        </ResultBox>
      );
    }
  }

  return (
    <div className="space-y-4">
      <SectionTitle>Permiso de Trabajo (I-765)</SectionTitle>
      <p className="text-xs text-[#b8962e] font-medium mb-1">
        Calcula cuándo podrías presentar tu solicitud de permiso de trabajo basada en asilo.
      </p>
      <p className="text-sm text-gray-600">
        Después de presentar el formulario I-589 (solicitud de asilo), debes esperar{" "}
        <strong>150 días</strong> para solicitar tu permiso y{" "}
        <strong>180 días</strong> para recibirlo.
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
          <p className="font-bold text-lg">⏳ Todavía es temprano</p>
          <p className="text-sm mt-1">
            Han pasado <strong>{dias} días</strong> desde tu I-765. Necesitas
            esperar al menos <strong>60 días</strong> para enviar un E-Request.
          </p>
          <p className="text-sm mt-1">
            Faltan <strong>{60 - dias} días</strong> para el mínimo.
          </p>
          <NoteEstimacion />
        </ResultBox>
      );
    } else if (dias < 90) {
      result = (
        <>
          <ResultBox color="yellow">
            <p className="font-bold text-lg">📬 Puedes revisar el estado</p>
            <p className="text-sm mt-1">
              Han pasado <strong>{dias} días</strong>. Ya puedes enviar un
              E-Request estándar a USCIS para consultar el estado de tu caso.
            </p>
            <p className="text-sm mt-2">
              A los <strong>90 días</strong> puedes solicitar revisión expedita.
              Te faltan <strong>{90 - dias} días</strong>.
            </p>
            <NoteEstimacion />
          </ResultBox>
          <a
            href="https://egov.uscis.gov/e-request/Intro.do"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg hover:bg-[#2d5282] transition-colors"
          >
            Ir al portal E-Request de USCIS →
          </a>
        </>
      );
    } else {
      result = (
        <>
          <ResultBox color="red">
            <p className="font-bold text-lg">
              🚨 Podría ser momento de hacer seguimiento
            </p>
            <p className="text-sm mt-1">
              Han pasado <strong>{dias} días</strong>. Llevas más de 90 días sin
              recibir tu EAD. Esto es una demora significativa que vale la pena
              atender.
            </p>
            <p className="text-sm mt-2 font-medium">
              Considera enviar un E-Request urgente y hablar con tu preparadora
              sobre los pasos a seguir.
            </p>
            <NoteEstimacion />
          </ResultBox>
          <a
            href="https://egov.uscis.gov/e-request/Intro.do"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg hover:bg-[#2d5282] transition-colors"
          >
            Ir al portal E-Request de USCIS →
          </a>
        </>
      );
    }
  }

  return (
    <div className="space-y-4">
      <SectionTitle>Consultar Estado del Caso (E-Request)</SectionTitle>
      <p className="text-xs text-[#b8962e] font-medium mb-1">
        Te ayuda a saber si ya podrías hacer seguimiento a tu trámite mediante un E-Request.
      </p>
      <p className="text-sm text-gray-600">
        Si enviaste el formulario I-765 (permiso de trabajo) y no has recibido
        respuesta, puedes enviar un E-Request para preguntar el estado. A los{" "}
        <strong>60 días</strong> puedes solicitarlo; a los{" "}
        <strong>90 días</strong> se considera una demora importante.
      </p>

      <div>
        <Label>¿Cuándo enviaste tu I-765?</Label>
        <DateInput value={fecha} onChange={setFecha} />
      </div>

      {result}

      {fecha && dias !== null && (
        <p className="text-xs text-gray-500 mt-2">
          ¿No sabes qué hacer con el resultado?{" "}
          <a
            href={`https://wa.me/13123075331?text=${encodeURIComponent(
              "Hola Raimaris, usé la calculadora E-Request y tengo dudas sobre qué hacer."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#b8962e] font-medium underline"
          >
            Consultar con Raimaris
          </a>
        </p>
      )}
    </div>
  );
}

// ─── Sección Preparadora ──────────────────────────────────────────────────────

function SeccionPreparadora() {
  return (
    <div className="max-w-2xl mx-auto mt-5 px-4">
      <div className="bg-[#1a3558] rounded-2xl px-4 py-4 flex items-start gap-4 border border-[#b8962e] border-opacity-40">
        {/* Foto */}
        <div className="flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/raimaris-martinez.jpg"
            alt="Raimaris Martínez"
            className="rounded-full object-cover object-top border-2 border-[#b8962e] w-16 h-16 sm:w-[72px] sm:h-[72px]"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm sm:text-base leading-tight">
            Raimaris Martínez
          </p>
          <p className="text-[#fbbf24] text-xs font-semibold mt-0.5">
            Preparadora de Documentos Migratorios
          </p>
          <p className="text-white text-xs sm:text-sm mt-1.5 leading-snug opacity-90">
            ¿Tienes dudas sobre tu resultado?{" "}
            Recibe orientación personalizada para tu caso migratorio.
          </p>

          {/* Credenciales */}
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-0.5">
            {["Asilo", "Permiso de Trabajo", "Real ID", "Cambios de Corte"].map(
              (item) => (
                <span key={item} className="text-xs flex items-center gap-1">
                  <span className="text-[#fbbf24] font-bold">✓</span>
                  <span className="text-white opacity-90">{item}</span>
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "aaf", label: "Tarifa de Asilo (AAF)", emoji: "💰" },
  { id: "permiso", label: "Permiso de Trabajo (I-765)", emoji: "💼" },
  { id: "erequest", label: "Consultar Estado", emoji: "📨" },
];

const WHATSAPP_NUMBER = "13123075331";
const WHATSAPP_MSG = encodeURIComponent(
  "Hola Raimaris, usé la calculadora de asilo y tengo una pregunta sobre mi caso."
);

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("aaf");

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1e3a5f] to-[#2d5282]">
      {/* Hero */}
      <section className="text-white px-4 pt-10 pb-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block bg-white bg-opacity-15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Herramienta gratuita
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
            Calculadora de Fechas
            <br />
            <span className="text-[#d4a843]">para tu Caso de Asilo</span>
          </h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-lg mx-auto">
            Calcula tu tarifa AAF, cuándo puedes pedir tu permiso de trabajo y
            si calificas para un E-Request — en segundos, sin guardar tus datos.
          </p>
          {/* ¿Qué quieres calcular? */}
          <div className="mt-5 bg-[#1a3558] rounded-2xl px-4 py-4 text-left max-w-lg mx-auto border border-[#b8962e] border-opacity-30">
            <p className="text-white font-semibold text-sm text-center mb-3">
              ¿Qué quieres calcular hoy?
            </p>
            <div className="space-y-2.5">
              {[
                { emoji: "💰", text: "Saber si debo pagar la tarifa de asilo (AAF)" },
                { emoji: "💼", text: "Saber cuándo puedo solicitar mi permiso de trabajo" },
                { emoji: "📨", text: "Saber si ya puedo hacer seguimiento a mi trámite" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-white text-sm opacity-90">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-4">
            <p className="text-blue-200 text-xs">🔒 No guardamos ningún dato</p>
            <p className="text-blue-200 text-xs">📅 Actualización: mayo 2026</p>
            <p className="text-blue-200 text-xs">📌 Fuente: USCIS y EOIR</p>
          </div>
        </div>
      </section>

      {/* Card principal */}
      <section className="px-4 pb-4">
        {/* ¿Cómo funciona? */}
        <div className="max-w-2xl mx-auto mb-3 bg-[#1a3558] rounded-xl px-4 py-3 border border-[#b8962e] border-opacity-30">
          <p className="text-white text-xs font-semibold mb-2">¿Cómo funciona?</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { n: "1", t: "Selecciona lo que deseas calcular" },
              { n: "2", t: "Ingresa tu fecha del formulario" },
              { n: "3", t: "Obtén una orientación inmediata" },
              { n: "4", t: "Si tienes dudas, consulta con Raimaris" },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#b8962e] text-white text-xs font-bold flex items-center justify-center">
                  {s.n}
                </span>
                <span className="text-blue-100 text-xs leading-tight">{s.t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-2 text-xs sm:text-sm font-semibold transition-all flex flex-col items-center gap-0.5 sm:flex-row sm:justify-center sm:gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-[#1e3a5f] text-white border-b-2 border-[#b8962e]"
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

          {/* Tarjeta de confianza */}
          <div className="mx-5 mb-5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <span className="text-[#b8962e] text-lg mt-0.5">🛡️</span>
            <p className="text-xs text-gray-600 leading-relaxed">
              Herramienta informativa creada para orientar tu proceso
              migratorio. No reemplaza la asesoría de un profesional.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border-t border-amber-200 px-5 py-4">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>⚠️ Aviso legal:</strong> Esta herramienta es solo
              informativa y no constituye asesoría legal. Los cálculos son
              estimados y pueden no aplicar a tu caso específico. Siempre
              consulta con un abogado de inmigración o representante acreditado
              antes de tomar decisiones legales.
            </p>
          </div>
        </div>
      </section>

      {/* Sección preparadora */}
      <SeccionPreparadora />

      {/* CTA WhatsApp */}
      <div className="max-w-2xl mx-auto mt-8 px-4 text-center pb-12">
        {/* Pre-CTA */}
        <p className="text-white font-semibold text-base mb-4">
          ¿Necesitas ayuda con tu caso?
        </p>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-7 py-3.5 rounded-full shadow-lg transition-all text-sm"
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.504 3.935 1.389 5.612L0 24l6.545-1.371A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.012-1.378l-.36-.214-3.732.98.998-3.648-.235-.374A9.787 9.787 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182c5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z" />
          </svg>
          Consultar con Raimaris por WhatsApp
        </a>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-4">
          <p className="text-blue-200 text-xs">🇪🇸 Atención en español</p>
          <p className="text-blue-200 text-xs">⏱ Respuesta en menos de 24 horas</p>
        </div>

        {/* Footer legal */}
        <p className="text-blue-400 text-xs mt-10 leading-relaxed">
          Esta herramienta es proporcionada sin garantías. No somos abogados.
          Para asesoría legal, contacta a un profesional acreditado.
        </p>
      </div>
    </main>
  );
}
