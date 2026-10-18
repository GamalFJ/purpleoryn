-- Portfolio snapshots (7 published projects) for /portafolio.
-- Run once in the SQL editor of the purpleoryn project ("Purple Cove Labs Website"), AFTER the deploy that adds
-- public/portafolio/*.webp. Safe to re-run (on conflict do nothing). Rows can then be edited or unpublished in the
-- admin panel (/admin/portafolio). Covers are 16:9 WebP files shipped with the site (relative URLs).
-- No results are claimed: `results` stays empty until the client authorizes verifiable numbers (the table rejects
-- published results without a source). `link` is left empty on purpose; add the live URL in the admin when the
-- client agrees to be linked.
insert into public.portfolio_items (slug, title, summary, description, results, results_source, link, cover_image_url, image_urls, published, sort_order)
values
  ('dynasty-tattoo-studios', 'Dynasty Tattoo Studios',
   'Sitio oscuro y elegante para un estudio de tatuajes y piercings en Santo Domingo, con galería filtrable por estilo y contacto a un toque.',
   'Sitio web para un estudio de tatuajes y piercings: galería de trabajos filtrable por estilo (blanco y negro, color, fine-line, piezas grandes), servicios, artistas y contacto directo por chat, WhatsApp y llamada.',
   '', '', null, '/portafolio/dynasty-tattoo-studios.webp', '{}', true, 1),
  ('mgc-asociados', 'MGC Asociados',
   'Sitio sobrio y claro para una firma de asesoría fiscal y financiera en Santo Domingo Este, con sus servicios y un formulario de contacto.',
   'Sitio web para una firma de asesoría fiscal y financiera: servicios (declaraciones juradas, formatos 606/607/608, TSS, constitución de empresas, estados financieros, notificaciones de la DGII), ubicación y un formulario para solicitar consulta.',
   '', '', null, '/portafolio/mgc-asociados.webp', '{}', true, 2),
  ('signaprint', 'SignaPrint',
   'Sitio y flujo paso a paso para un servicio de presentación documental: subir el PDF, elegir el plan, completar el formulario y confirmar el total.',
   'Sitio web y flujo de pedido para un servicio externo de presentación documental: el cliente sube su PDF, el sistema detecta el plan que le corresponde, completa un formulario y confirma su total.',
   '', '', null, '/portafolio/signaprint.webp', '{}', true, 3),
  ('signatura-creativa', 'House of Signatura Creativa',
   'Tienda en línea de papelería artesanal y planners, con catálogo, carrito y un panel para que la dueña administre todo sola.',
   'Tienda en línea para una marca de papelería artesanal: catálogo por categorías, fichas de producto, carrito y panel de administración para gestionar productos, fotos y pedidos.',
   '', '', null, '/portafolio/signatura-creativa.webp', '{}', true, 4),
  ('colmado-click', 'Colmado Click',
   'Sitio web y app de pedidos para colmados: el cliente arma su pedido desde el catálogo y llega completo a WhatsApp, con total, forma de pago y cambio.',
   'Sitio web que explica el servicio y una app de pedidos para colmados: catálogo con fotos, carrito, elección de forma de pago y de billetes, y envío del pedido listo por WhatsApp.',
   '', '', null, '/portafolio/colmado-click.webp', '{}', true, 5),
  ('expression', 'Expression',
   'Sitio-galería para una artista de arte digital llevado a impresión: tienda propia, ficha de cada obra, comisiones y pedido por WhatsApp.',
   'Sitio web a la medida del estilo de una artista: tienda con catálogo de obras, ficha de cada pieza (medio, tamaño, año), comisiones personalizadas y pedido directo por WhatsApp.',
   '', '', null, '/portafolio/expression.webp', '{}', true, 6),
  ('oregano', 'Orégano',
   'Tienda en línea para una maison del frozen de Santo Domingo: categorías, tamaños, fechas de entrega y pedido por WhatsApp.',
   'Tienda en línea para un negocio de comida congelada: catálogo por categorías (empanadas, pizzas, jugos y más), productos con tamaños y presentaciones, fechas de entrega visibles y pedido por WhatsApp.',
   '', '', null, '/portafolio/oregano.webp', '{}', true, 7)
on conflict (slug) do nothing;
