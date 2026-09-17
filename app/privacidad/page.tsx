import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Política de privacidad",
  description: "Qué datos recopila Purple Cove Labs en este sitio, para qué los usa y cómo solicitar su eliminación.",
  path: "/privacidad",
});

const UPDATED = "16 de septiembre de 2026";

export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <main id="contenido" className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 md:pt-16">
        <h1 className="text-[2.35rem] font-semibold leading-[1.06] sm:text-5xl">Política de privacidad</h1>
        <p className="mt-3 text-sm text-muted">Última actualización: {UPDATED}</p>

        <div className="mt-10 space-y-10 text-[16px] leading-relaxed text-body [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          <section>
            <h2>Quiénes somos</h2>
            <p className="mt-3">
              {SITE.name} es responsable de los datos recopilados en {SITE.url.replace("https://", "")}. Puedes escribirnos a{" "}
              <a href={`mailto:${SITE.email}`} className="text-accent underline underline-offset-2">
                {SITE.email}
              </a>{" "}
              o al WhatsApp {SITE.phoneDisplay}.
            </p>
          </section>

          <section>
            <h2>Qué datos recopilamos</h2>
            <ul>
              <li>Los datos que escribes en el formulario: nombre, WhatsApp, correo, nombre del negocio, mensaje y el plan elegido.</li>
              <li>Si usaste la calculadora, el valor promedio de venta que escribiste.</li>
              <li>De dónde llegaste al sitio (por ejemplo, un enlace de Google) y la página por la que entraste.</li>
              <li>Datos de uso anónimos del sitio, como páginas visitadas y clics en botones.</li>
              <li>Si conversas con nuestro asistente de IA, el contenido de esa conversación.</li>
            </ul>
          </section>

          <section>
            <h2>Para qué los usamos</h2>
            <ul>
              <li>Contactarte sobre el plan o servicio que solicitaste.</li>
              <li>Preparar tu propuesta y dar seguimiento a tu solicitud.</li>
              <li>Entender qué partes del sitio funcionan y mejorarlo.</li>
            </ul>
            <p className="mt-3">No vendemos ni alquilamos tus datos.</p>
          </section>

          <section>
            <h2>Con quién se comparten</h2>
            <p className="mt-3">Usamos proveedores que procesan datos en nuestro nombre:</p>
            <ul>
              <li>Supabase, donde se guardan las solicitudes del formulario.</li>
              <li>Google Analytics y Google Tag Manager, para medir el uso del sitio.</li>
              <li>Vercel, que aloja el sitio y mide su rendimiento.</li>
              <li>Telegram, donde recibimos el aviso de cada solicitud nueva.</li>
              <li>Cal.com, si agendas una llamada.</li>
              <li>WhatsApp, si decides escribirnos por ahí.</li>
            </ul>
          </section>

          <section>
            <h2>Cookies</h2>
            <p className="mt-3">
              Google Analytics usa cookies para distinguir visitantes y sesiones. Puedes bloquearlas o borrarlas desde la configuración de tu
              navegador; el sitio sigue funcionando sin ellas.
            </p>
          </section>

          <section>
            <h2>Tus derechos</h2>
            <p className="mt-3">
              De acuerdo con la Ley 172-13 sobre protección de datos personales, puedes pedirnos acceder a tus datos, corregirlos o eliminarlos.
              Escríbenos a{" "}
              <a href={`mailto:${SITE.email}`} className="text-accent underline underline-offset-2">
                {SITE.email}
              </a>{" "}
              y respondemos tu solicitud.
            </p>
          </section>

          <section>
            <h2>Cambios</h2>
            <p className="mt-3">Si cambiamos esta política, actualizaremos la fecha de arriba.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
