# Builds the updated "Cómo Trabajamos" client document (usted) as HTML, to be
# printed to PDF by headless Chrome. Content follows the original
# PCL-Como-Trabajamos.pdf, adapted to the road on purpleoryn.com/como-trabajamos
# and to the add-on payment rule (100% upfront, unlike plans).
#
# Regenerate after a policy change (keep the site road in lib/proceso.ts in step):
#   python build_doc.py
#   chrome --headless=new --no-pdf-header-footer --print-to-pdf=out.pdf file:///<abs>/como-trabajamos.html
# then set the PDF title metadata and replace public/docs/como-trabajamos.pdf
# and its cover, public/media/docs/como-trabajamos-cover.webp.
# Written in usted on purpose: it is the signed client document.
import html
import io
import os

HERE = os.path.dirname(os.path.abspath(__file__))
TOTAL = 4

STEPS = [
    ("01", "Presentación del Sistema",
     "Según lo que mejor se ajuste a su negocio, le mostramos purpleoryn.com funcionando en tiempo real, "
     "le preparamos una demostración rápida y específica, o le compartimos el documento de Oryn Presence "
     "(Presencia), descargable desde el sitio, para que vea el sistema completo antes de invertir."),
    ("02", "Propuesta",
     "Recibe por escrito el plan elegido (Presencia, Conversión o Autoridad), cualquier módulo adicional que "
     "decida incluir, la inversión total con su calendario de pago (50% inicial y 50% final para el plan; "
     "100% por adelantado para cualquier módulo adicional) y el plan de trabajo. Precio fijo según el plan, "
     "sin costos sorpresa."),
    ("03", "Aprobación Escrita",
     "Confirma por WhatsApp, correo, o llenando y enviando el formulario de selección de plan en "
     "purpleoryn.com. Un formulario completado y enviado constituye una orden formal, con el mismo peso que "
     "una confirmación por WhatsApp o correo, por eso es importante leer toda la información del sitio y "
     "consultar a Oryn AI o las preguntas frecuentes antes de enviarlo. Cualquiera de las dos vías reserva su "
     "cupo por 7 días calendario."),
    ("04", "Pago Inicial (50%)",
     "Con el 50% inicial confirmado, su proyecto queda activado y su cupo asegurado. Si su pedido incluye "
     "módulos adicionales, se pagan completos (100%) en este mismo momento. La mensualidad correspondiente a "
     "su plan es parte de esta misma inversión, no un paso aparte, y comienza a contar desde la salida en vivo "
     "de su sistema."),
    ("05", "Formulario de Configuración",
     "Nos envía logo, textos, fotos y datos del negocio en un solo formulario, completo. El formulario "
     "corresponde al plan elegido."),
    ("06", "Construcción y Revisión",
     "Construimos su sistema. Al terminar, usted recibe una ronda completa de revisión antes de la entrega, "
     "que cubre textos, colores, espaciado y detalles visuales."),
    ("07", "Aprobación, Entrega y Salida en Vivo",
     "Usted aprueba la versión final, se realiza el pago final del plan (50%) y su sistema sale en vivo. "
     "Desde ese día empieza a contar la mensualidad de su plan."),
]

MODULES = (
    "Además de los tres planes, Purple Cove Labs ofrece módulos adicionales (por ejemplo, el Agente de Voz IA) "
    "que se agregan por separado, incluso en el mismo formulario de selección de plan en purpleoryn.com. A "
    "diferencia de la mensualidad de su plan, cada módulo adicional es verdaderamente aparte: tiene su propia "
    "inversión (pago único y/o mensualidad, según corresponda), <b>se paga al 100% por adelantado</b>, a "
    "diferencia de los planes (50% inicial y 50% final), y puede agregarse desde el inicio del proyecto o en "
    "cualquier momento después de la salida en vivo de su sistema. Los módulos disponibles en el momento de su "
    "propuesta, y su inversión correspondiente, se indican ahí. Esta política aplica igual a cualquier módulo "
    "que se incorpore a la oferta de Purple Cove Labs en el futuro, sin necesidad de modificar este documento."
)

CRONOGRAMA = (
    "El tiempo de entrega comienza a contar únicamente cuando se cumplen dos condiciones a la vez: el pago "
    "inicial confirmado y el formulario de configuración recibido y completo. Mientras falte cualquiera de las "
    "dos, el reloj no inicia."
)

COMPROMISO = [
    "Precio fijo según el plan elegido, sin costos sorpresa.",
    "Respuesta a sus mensajes dentro de 24 horas hábiles.",
    "Una ronda completa de revisión incluida antes de la entrega.",
    "Confidencialidad total sobre la información de su negocio.",
    "Fechas de entrega establecidas por escrito antes de iniciar.",
    "Uso incluido claro por plan y por módulo, con tarifa de excedente publicada por adelantado.",
]
NECESITAMOS = [
    "Respuestas dentro de 48 horas hábiles.",
    "Materiales completos al enviar el formulario.",
    "Pagos según el calendario acordado en la propuesta (50% inicial y 50% final para el plan; 100% por "
    "adelantado para los módulos adicionales).",
    "Decisiones a través de una sola voz autorizada.",
    "Un contacto autorizado disponible durante todo el proyecto, con un suplente designado para cubrir "
    "cualquier ausencia o falta de disponibilidad del propietario.",
]
POLICIES = [
    ("Reserva de cupo: 7 días",
     "Su aprobación escrita (o el envío del formulario del sitio) reserva su cupo por 7 días calendario. Si el "
     "pago inicial no se recibe en ese plazo, la reserva vence y el cupo se libera automáticamente."),
    ("Contacto autorizado obligatorio",
     "Cada proyecto requiere una persona con autoridad para aprobar y responder. Si el propietario no está "
     "disponible de forma constante, debe designar un suplente."),
    ("Pausa por inactividad",
     "Sin respuesta durante 5 días hábiles, el proyecto entra en pausa y su cupo se libera. Pasados 10 días "
     "hábiles se archiva; reactivación sujeta a disponibilidad y una cuota de RD$3,000."),
    ("Los pagos son finales",
     "El calendario del plan es 50% inicial y 50% final; los módulos adicionales se pagan al 100% por "
     "adelantado. Los 7 días previos al primer pago existen para que usted decida con calma. Una vez ejecutado "
     "cada pago, es final y no reembolsable."),
    ("Precio fijo por plan y alcance definido",
     "El precio corresponde al plan y alcance acordados en la propuesta. Si el alcance cambia, o si agrega "
     "cualquier módulo adicional después de iniciado el proyecto, se emite una orden de cambio con su costo "
     "antes de ejecutar trabajo adicional."),
    ("Alcance de la revisión",
     "Cubre textos, colores, espaciado y detalles visuales. No incluye páginas nuevas, funciones nuevas ni "
     "cambios estructurales. Cambios después de la entrega se cotizan como proyecto nuevo."),
    ("Uso incluido y excedente",
     "Cada plan, y cada módulo adicional que incluya uso mensual (conversaciones, minutos u otra unidad), indica "
     "su cantidad incluida y su tarifa de excedente en la propuesta. El uso adicional se factura de forma clara, "
     "sin interrupción del servicio."),
    ("El formulario del sitio es una orden formal",
     "Elegir un plan (y, si lo desea, módulos adicionales) y enviar el formulario correspondiente en "
     "purpleoryn.com tiene el mismo peso que una aprobación por WhatsApp o correo: es una orden formal. El "
     "formulario incluye una casilla de confirmación que debe marcar antes de enviarlo. Lea toda la información "
     "del sitio y consulte a Oryn AI o las preguntas frecuentes antes de enviarlo, el envío del formulario es "
     "la confirmación."),
]

FOOT = ("Purple Cove Labs · Santo Domingo Este, República Dominicana · purpleoryn.com · "
        "WhatsApp +1 809 603 4113")


def e(s):
    return html.escape(s, quote=False)


def header(title, subtitle, n, oryn=False):
    right = '<img class="oryn" src="oryn.png" alt="">' if oryn else '<span class="oryn"></span>'
    sub = f'<p class="subtitle">{e(subtitle)}</p>' if subtitle else ""
    t = f'<h1>{e(title)}</h1>' if title else ""
    return f"""
    <header>
      <div class="logos"><img class="logo" src="pcl-logo.png" alt="">{right}</div>
      {t}{sub}
      <p class="meta">PURPLE COVE LABS · purpleoryn.com · Página {n} de {TOTAL}</p>
      <hr>
    </header>"""


def footer():
    return f'<footer>{e(FOOT)}<span>Actualizado: septiembre de 2026</span></footer>'


def road_row(num, title, text, bend):
    # One segment of the road per step. Each segment starts and ends on the
    # centre line with a vertical tangent, so consecutive rows join smoothly
    # and the road survives a page break.
    x = 22 if bend == "left" else 78
    d = f"M 50 0 C 50 30, {x} 30, {x} 50 C {x} 70, 50 70, 50 100"
    return f"""
    <div class="step">
      <div class="lane">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="{d}" class="asphalt"/><path d="{d}" class="centre"/>
        </svg>
        <span class="num">{num}</span>
      </div>
      <div class="body"><h3>{e(title)}</h3><p>{e(text)}</p></div>
    </div>"""


def branch_row():
    return f"""
    <div class="step branch">
      <div class="lane">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 50 0 L 50 7" class="asphalt"/>
          <path d="M 50 0 C 50 5, 62 8, 100 8.5" class="side"/>
        </svg>
      </div>
      <div class="body box dashed">
        <h3 class="amber">Módulos opcionales</h3>
        <p>{MODULES}</p>
      </div>
    </div>"""


def ul(items):
    return "<ul>" + "".join(f"<li>{e(i)}</li>" for i in items) + "</ul>"


CSS = """
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: Helvetica, Arial, sans-serif; color: #1a1a1a; font-size: 9.6pt; line-height: 1.42;
       -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 210mm; height: 297mm; padding: 13mm 17mm 12mm; position: relative; overflow: hidden;
        page-break-after: always; display: flex; flex-direction: column; }
.page:last-child { page-break-after: auto; }
header { text-align: center; }
.logos { display: flex; justify-content: space-between; align-items: flex-start; height: 18mm; }
.logo { width: 18mm; height: 18mm; }
.oryn { width: 14mm; height: 14mm; display: block; }
h1 { color: #4c1d95; font-size: 21pt; margin: -6mm 0 1.2mm; letter-spacing: -0.2pt; }
.subtitle { font-size: 12pt; margin: 0; }
.meta { font-size: 8.3pt; color: #6b7280; font-style: italic; margin: 1.2mm 0 0; }
hr { border: 0; border-top: 1.2pt solid #4c1d95; margin: 3.2mm 0 4mm; }
.intro { margin: 0 0 3.5mm; font-size: 10pt; }
h2 { color: #4c1d95; font-size: 12.5pt; margin: 0 0 2mm; }
h3 { color: #4c1d95; font-size: 11pt; margin: 0 0 0.8mm; }
h3.amber { color: #b45309; }
p { margin: 0; }
.road { display: flex; flex-direction: column; }
.step { display: grid; grid-template-columns: 17mm 1fr; column-gap: 4mm; min-height: 25mm; }
.lane { position: relative; }
.lane svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.asphalt { fill: none; stroke: #ede9fe; stroke-width: 15; vector-effect: non-scaling-stroke; stroke-linecap: round; }
.centre { fill: none; stroke: #7c3aed; stroke-width: 1.4; stroke-dasharray: 5 4; vector-effect: non-scaling-stroke; }
.side { fill: none; stroke: #f59e0b; stroke-width: 7; stroke-dasharray: 7 5; vector-effect: non-scaling-stroke;
        stroke-linecap: round; opacity: .75; }
.num { position: absolute; left: 50%; top: 0; transform: translateX(-50%); width: 10.5mm; height: 10.5mm;
       border-radius: 2.4mm; background: #4c1d95; color: #fff; font-weight: bold; font-size: 11pt;
       display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 1.2mm #fff; }
.body { padding: 0.6mm 0 4mm; }
.box { border: 1pt solid #ddd6fe; background: #f5f3ff; padding: 3.5mm 4.5mm; border-radius: 1.6mm; margin: 0 0 3.5mm; }
.box.dashed { border: 1.2pt dashed #f59e0b; background: #fffbeb; margin-top: 1mm; }
.box h3 { margin-bottom: 1.4mm; font-size: 10.5pt; }
.box.plain h3 { color: #1a1a1a; }
.cta { background: #4c1d95; color: #fff; text-align: center; font-weight: bold; font-size: 11.5pt;
       border-radius: 2.4mm; padding: 4mm; margin-top: 1mm; }
.cta small { display: block; font-weight: normal; font-size: 9pt; opacity: .85; margin-top: 1mm; }
.cols { display: grid; grid-template-columns: 1fr 1fr; column-gap: 8mm; row-gap: 3.2mm; }
.cols h2 { font-size: 13pt; margin-bottom: 1mm; }
ul { margin: 0; padding-left: 4mm; }
li { margin: 0 0 1mm; }
.divider { border-top: 0.8pt solid #e5e7eb; margin: 4mm 0; }
.policy h3 { font-size: 10pt; }
.policy p { font-size: 9.2pt; }
footer { margin-top: auto; border-top: 0.8pt solid #e5e7eb; padding-top: 2mm; font-size: 8pt; color: #6b7280;
         display: flex; flex-direction: column; gap: 0.6mm; }
footer span { font-size: 7.4pt; }
.sign p { font-size: 10pt; }
.line { display: grid; grid-template-columns: 38mm 1fr 20mm 30mm; align-items: end; gap: 3mm; margin: 9mm 0 0; font-weight: bold; }
.blank { border-bottom: 0.8pt solid #1a1a1a; height: 5mm; }
.signrow { display: grid; grid-template-columns: 14mm 1fr 34mm 1fr 14mm 26mm; align-items: end; gap: 2.5mm; margin-top: 12mm; font-weight: bold; }
"""


def build():
    steps_a = "".join(road_row(n, t, x, "left" if i % 2 == 0 else "right") for i, (n, t, x) in enumerate(STEPS[:5]))
    steps_b = "".join(road_row(n, t, x, "left" if (i + 5) % 2 == 0 else "right") for i, (n, t, x) in enumerate(STEPS[5:]))

    p1 = f"""
    <section class="page">
      {header("Cómo Trabajamos", "El proceso de un proyecto en Purple Cove Labs", 1, oryn=True)}
      <p class="intro">Todo inicia con una conversación de diagnóstico, sin costo y sin compromiso. Desde la
      presentación del sistema en adelante, este es el camino que recorremos juntos. Siete pasos, sin sorpresas.
      Puede recorrerlo también, paso a paso, en <b>purpleoryn.com/como-trabajamos</b>.</p>
      <div class="road">{steps_a}</div>
      {footer()}
    </section>"""

    p2 = f"""
    <section class="page">
      {header("Cómo Trabajamos", "El camino, continuación", 2)}
      <div class="road">{steps_b}{branch_row()}</div>
      <div class="box plain">
        <h3>Cuándo inicia el cronograma de entrega</h3>
        <p>{e(CRONOGRAMA)}</p>
      </div>
      <div class="cta">¿Listo para elegir su plan? Ver planes en purpleoryn.com/servicios
        <small>El documento de Oryn Presence (Presencia) está disponible para descargar en purpleoryn.com</small></div>
      {footer()}
    </section>"""

    pol = "".join(f'<div class="policy"><h3>{e(t)}</h3><p>{e(x)}</p></div>' for t, x in POLICIES)
    p3 = f"""
    <section class="page">
      {header("Compromisos y Políticas", "Las reglas del juego, claras desde el primer día", 3)}
      <div class="cols">
        <div><h2>Nuestro compromiso con usted</h2>{ul(COMPROMISO)}</div>
        <div><h2>Lo que necesitamos de usted</h2>{ul(NECESITAMOS)}</div>
      </div>
      <div class="divider"></div>
      <div class="cols">{pol}</div>
      {footer()}
    </section>"""

    p4 = f"""
    <section class="page sign">
      {header("", "", 4)}
      <h2>Contacto autorizado del proyecto</h2>
      <p>Persona con autoridad para aprobar, decidir y responder durante todo el proyecto. El suplente es obligatorio.</p>
      <div class="line"><span>Contacto principal:</span><span class="blank"></span><span>WhatsApp:</span><span class="blank"></span></div>
      <div class="line"><span>Contacto suplente:</span><span class="blank"></span><span>WhatsApp:</span><span class="blank"></span></div>
      <p style="margin-top:10mm">Con mi firma confirmo que he leído, entiendo y acepto el proceso y las políticas descritas en
      este documento, y que designo al contacto autorizado indicado arriba para representar a mi empresa durante
      todo el proyecto.</p>
      <div class="signrow"><span>Firma:</span><span class="blank"></span><span>Nombre y empresa:</span><span class="blank"></span><span>Fecha:</span><span class="blank"></span></div>
      {footer()}
    </section>"""

    doc = f"""<!doctype html><html lang="es-DO"><head><meta charset="utf-8">
<title>Cómo Trabajamos | Purple Cove Labs</title><style>{CSS}</style></head>
<body>{p1}{p2}{p3}{p4}</body></html>"""
    out = os.path.join(HERE, "como-trabajamos.html")
    io.open(out, "w", encoding="utf-8").write(doc)
    print(out)


build()
