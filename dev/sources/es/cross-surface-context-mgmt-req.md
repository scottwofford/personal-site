> Generado a partir de los documentos privados de Scott Wofford el 2026-10-31 mediante un script de exportación. No edites aquí; las ediciones se sobrescriben. Los agentes de Scott nunca leen esta copia. Fuente de verdad: https://github.com/scottwofford/sw-prv/blob/main/requirements/cross-surface-context-mgmt-req.md (privada). Esta copia es un espejo con partes omitidas y puede ir atrasada respecto a la fuente. Traducción al español del 2026-10-31; la versión en inglés es la fuente.

# Requisitos de gestión de contexto de Claude entre superficies

**Responsable:** Scott
**Última actualización:** 2026-09-14
**Método:** [formato canónico de luthien-org](https://github.com/LuthienResearch/luthien-org/blob/main/ui-fb-dev/2-versions-requirements/README.md).
**Fuente de retroalimentación:** el uso directo que hace Scott de Claude en distintas superficies. Registros primarios en [`../session-logs/`](../session-logs/).

---

## Épica

<u>Continuidad o ausencia honesta.</u> Cuando paso de una superficie de Claude a otra, quiero retomar donde lo dejé o que se me diga con claridad que la nueva superficie no tiene el contexto previo. "System asserts something stale or out-of-context with confidence" es peor que "system says it doesn't know."

---

## Requisitos (historias de usuario que se suman a la Épica)

| # | Requisito (solo el problema) | Estado actual | Evidencia clave |
|---|---|---|---|
| **R1** | <u>Continuidad entre superficies.</u> Cuando abro un chat de Claude en cualquier dispositivo, debería saber lo que hice en superficies anteriores. | Parcial. Claude Code ↔ Desktop continúa a través del MCP del sistema de archivos local. claude.ai web ↔ móvil a través de un backend compartido. Code → móvil en frío no tiene visibilidad de la memoria automática ni de los registros de sesión recientes. | [Evidencia de sesión móvil](../session-logs/2026-04-29_thread-prioritization-context-pull.csv): el móvil quedó bloqueado porque no se había hecho el push del registro de sesión. |
| **R2** | <u>Ausencia honesta y verificar antes de afirmar.</u> Cuando el sistema no sabe algo, debería decirlo. Cuando el sistema cree saber algo sensible al tiempo o específico (una fecha, un nombre, un estado), debería verificarlo antes de afirmarlo, no suponerlo a partir de contexto desactualizado. | No satisfecho. Claude ha mezclado contenido de otras líneas de trabajo en chats de trabajo; ha afirmado fechas desactualizadas con confianza; ha confundido entidades con nombres parecidos; ha inventado detalles de escenas que Scott no había descrito. | [Transcripción del 27 de abril](../session-logs/2026-04-29_thread-prioritization-context-pull.csv): contenido personal apareció en un chat de trabajo sin advertencia; Scott respondió con una grosería. [Daily State](../session-logs/2026-04-29_thread-prioritization-context-pull.csv): creado y eliminado en menos de 90 minutos después de presentar con confianza datos desactualizados. Hilo de claude.ai sobre prioridad de inversionistas: estampó una fecha de 8 días antes en una respuesta nueva. Otro hilo de claude.ai: confusión de zona horaria + mezcla de nombres + detalle de escena inventado. |
| **R3** | <u>Visibilidad del contexto cargado.</u> Debería poder preguntarle a cualquier chat de Claude "what context have you loaded?" y obtener una respuesta precisa. | No satisfecho. No hay una superficie de introspección de primera clase. Claude a menudo responde por inferencia, no por conocimiento real. | [Prueba de conectores](../session-logs/2026-04-29_thread-prioritization-context-pull.csv): el móvil no advirtió los conectores faltantes (Slack `not_installed`, Trello sin conector propio). |

---

---

## Formas de solución descartadas

Enfoques que se consideraron y se rechazaron. Las sesiones futuras no deberían volver a proponerlos sin abordar la refutación. Los titulares son lo esencial; las fuentes al final de cada entrada son principalmente para Claude.

### Carga de contexto por proyecto

No se puede probar como mecanismo para resolver la contaminación entre modos. La propuesta era que las Instrucciones por proyecto evitarían que el contenido personal apareciera en chats de trabajo, pero no existía una forma de validarlo; la propuesta pasó de requisito a principio de diseño y luego quedó refutada cuando la falla real de contaminación entre modos (27 de abril: contenido personal apareció sin advertencia en un chat de trabajo, lo que provocó una grosería de Scott) demostró que el aislamiento por proyecto no estaba garantizando lo que decía garantizar.

*Fuente: iteración de /devil que reveló la falta de una vía de refutación; [transcripción del 27 de abril en el registro de sesión](../session-logs/2026-04-29_thread-prioritization-context-pull.csv).*

### Aislamiento por proyecto como mecanismo de priorización

Priorizar de verdad requiere elegir ENTRE modos dentro de una misma ventana de atención. Los proyectos no pueden aislar lo que la atención tiene que priorizar. Refutación concreta: un mensaje de mi esposa que llega en la misma hora que un seguimiento de un inversionista; ambos compiten por el mismo presupuesto de atención sin importar en qué "proyecto" esté archivado cada uno. El aislamiento por proyecto solo funciona si el usuario tiene presupuestos de atención paralelos por proyecto, lo cual no ocurre en el flujo de trabajo de un fundador en solitario.

*Fuente: [`../claude-ai-project-knowledge/architecture.md`](../claude-ai-project-knowledge/architecture.md), nota sobre aislamiento por proyecto + refutación del 2026-05-01.*

### Documento de Drive Daily State como puente de contexto entre superficies

Se adoptó un documento de Drive actualizado a diario para tender un puente de contexto de Claude Code → claude.ai móvil, y luego se eliminó a unos ~90 minutos de su creación después de que presentara con confianza datos desactualizados en su primera lectura. Patrón de deterioro de instantáneas: cualquier documento derivado que duplica datos de origen empieza a deteriorarse en el momento en que cambian los datos de origen. El sustrato correcto para el contexto entre superficies son los propios sistemas de origen (documentos de referencia de Gmail / Slack / Trello / Drive) consultados en el momento del chat mediante conectores de claude.ai a nivel de cuenta, no instantáneas derivadas.

Este es el ejemplo canónico de por qué la primacía del sistema de origen ([`personal/scott-response-req.md`](personal/scott-response-req.md) Principio 4) se generaliza a datos, definiciones de reglas y datos de identidad: el mismo modo de falla en los tres.

*Fuente: [`../claude-ai-project-knowledge/architecture.md`](../claude-ai-project-knowledge/architecture.md), adopción + reversión de Daily State.*

---

## Criterios de aceptación

Por incidente, binario S/N:

- ¿Se satisface **R1**? ¿La nueva superficie sabía lo que hicieron las superficies anteriores, o lo obtuvo de una fuente accesible?
- ¿Se satisface **R2**? Cuando el sistema no tenía contexto, ¿lo dijo? Cuando el sistema afirmó un dato sensible al tiempo o específico (fecha, nombre, estado, monto en dólares), ¿lo verificó antes de afirmarlo?
- ¿Se satisface **R3**? ¿Pudo Scott preguntar "what do you know about my situation?" y obtener un inventario preciso de lo que está cargado frente a lo que falta?

Agregado = % satisfecho durante una ventana de medición. Se registra en los registros de sesión.

---

# Apéndice

## A. Matriz de capacidades por superficie

R1 + R2 están limitados por las herramientas y conectores que están conectados en la superficie actual. Donde faltan canales, R2 (ausencia honesta) es el requisito esencial: Claude debe enumerar qué canales puede ver y cuáles no antes de afirmar. Se actualiza empíricamente por superficie. Enfoque: herramienta/conector × superficie para cualquier comportamiento de respuesta de Claude.

Para la capacidad de lectura/escritura por canal de origen en la construcción de la base de datos de recaudación de fondos (otro enfoque: origen × lectura/escritura, limitado a ese pipeline), consulta [`luthien-org/fundraising/fundraising-db-requirements.md` § Límites de herramientas/MCP](https://github.com/LuthienResearch/luthien-org/blob/main/fundraising/fundraising-db-requirements.md#toolmcp-boundaries-as-of-2026-05-01). Consumidor distinto (fase de diseño de la base de datos de recaudación frente a comportamiento de Claude entre superficies); ambos son esenciales.

### Superficies monitoreadas

- **desktop-mac**: Claude Desktop en macOS con servidores MCP locales (Filesystem, iMessage, Office by Anthropic, Trello LOCAL DEV, control de Mac, puente de Chrome)
- **mobile-ios**: app de Claude para iOS
- **web-claudeai**: claude.ai en cualquier navegador, sin extensión
- **chrome-extension**: panel lateral de Claude in Chrome (extensión activa)
- **claude-code**: CLI de Claude Code (laptop)
- **codex-local**: Codex en la Mac configurada de Scott; el acceso a mensajes se cubre por separado más abajo.

### Matriz de capacidades

El acceso a mensajes se mantiene en [Acceso actual a mensajes](#acceso-actual-a-mensajes), incluido Codex. Las demás celdas se derivan de las pruebas fechadas que aparecen más abajo; vuelve a probar antes de confiar en ellas. La disponibilidad técnica nunca autoriza el envío de mensajes.

| Herramienta / conector | Categoría | desktop-mac | mobile-ios | web-claudeai | chrome-extension | claude-code |
|---|---|---|---|---|---|---|
| GitHub Integration | MCP en la nube | ✅ Conectado (aún no probado) | ❓ | ❓ | ❓ | n/a (usa git nativo vía Bash) |
| Gmail | MCP en la nube | ✅ ambas cuentas consultables | ⚠️ solo personal | ✅ verificado (alcance de cuenta no probado explícitamente) | ❌ verificado | ✅ servidores locales personal + Luthien + sw4 |
| Google Calendar | MCP en la nube | ✅ verificado | ✅ verificado (9 calendarios incl. ambas cuentas) | ✅ verificado (9 calendarios incl. ambas cuentas) | ❌ verificado | ✅ vía configuración MCP |
| Google Drive | MCP en la nube | ✅ verificado | ⚠️ solo personal | ✅ verificado | ❌ verificado | ✅ vía configuración MCP |
| Trello | LOCAL DEV (MCP personalizado, solo escritorio) | ✅ solo escritorio | ❌ verificado | ⚠️ disponible en el registro, no conectado | ❌ verificado | ✅ vía configuración MCP |
| Filesystem | MCP local (DESKTOP) | ✅ verificado | ❌ verificado | ❌ verificado (solo sandbox `/mnt/*`, no el sistema de archivos de la Mac) | ❌ verificado | ✅ nativo (Bash, Read, Edit, Write) |
| Read and Send iMessages | MCP local (DESKTOP) | ✅ disponible, no probado directamente | ❌ verificado | ❌ verificado | ❌ verificado | ✅ lectura vía Beeper (ver Acceso actual a mensajes) |
| Word/Excel/PowerPoint by Anthropic | MCP local (DESKTOP) | ✅ disponible, no probado directamente | ❌ verificado | ❌ verificado (reemplazado por `/mnt/skills` python-pptx/openpyxl/python-docx vía bash) | ❌ verificado | ❌ |
| Control your Mac (osascript) | MCP local (DESKTOP) | ✅ disponible, no probado | ❌ | ❌ | ❌ | ❌ (requeriría osascript vía Bash) |
| Control Chrome | MCP local (DESKTOP) | ✅ disponible, no probado | ❌ | ❌ verificado | ❌ verificado (la extensión tiene sus propias herramientas de navegador, NO el MCP Control Chrome) | ❌ |
| Claude in Chrome (extensión, herramientas nativas de navegador) | extensión | ✅ vía puente de escritorio | ❌ | ❌ verificado | ✅ nativo (read_page, find, computer, navigate, tabs_context, tabs_create, form_input, javascript_tool, read_console_messages, read_network_requests, gif_creator, etc.) | ❌ |
| web_search / web_fetch | creado por Anthropic | ✅ verificado | ✅ verificado (9 resultados) | ✅ verificado (9 resultados) | ❌ verificado | ✅ vía WebSearch / WebFetch |
| image_search | creado por Anthropic | ✅ probable | ✅ disponible (sin probar) | ✅ disponible (sin probar) | ❌ | ❌ |
| bash_tool / sandbox de computer-use | creado por Anthropic | ✅ verificado | ✅ verificado (VM Linux 6.18.5, Python 3.12.3, salida de red con lista de permitidos) | ✅ verificado (mismo sandbox Linux 6.18.5) | ❌ verificado | ✅ nativo (Bash) |
| conversation_search | creado por Anthropic | ✅ verificado | ✅ verificado | ✅ verificado | ❌ verificado | ❌ |
| recent_chats | creado por Anthropic | ✅ verificado | ✅ verificado | ✅ disponible | ❌ verificado | ❌ |
| memory_user_edits | creado por Anthropic | ✅ probable | ✅ disponible | ✅ disponible | ❌ | ❌ (Claude Code usa memoria automática + CLAUDE.md en su lugar) |
| event_* / reminder_* / calendar_search_v0 nativos de iOS | creado por Anthropic (iOS) | ❌ | ✅ verificado (en paralelo al MCP de Google Calendar) | ❌ | ❌ | ❌ |
| Control de navegador (read_page, find, computer-tab, javascript_tool, gif_creator, etc.) | nativo de la extensión | ✅ vía puente de escritorio | ❌ | ❌ | ✅ verificado | ❌ |

Leyenda: ✅ verificado que funciona · ❌ verificado que falta · ⚠️ parcial / limitado · ❓ aún no probado · "probable" = inferido de la arquitectura, no probado directamente.

**Alcance de cuentas de Gmail.** En Claude Code/Codex local, dirige las lecturas a los servidores específicos por cuenta configurados, `gmail-sw3`, `gmail-luthien` y `gmail-sw4`, y verifica la identidad. El punto ciego del conector personal de Gmail de claude.ai respecto al correo enviado desde Workspace no aplica a un servidor de Luthien autenticado por separado. En web/móvil, verifica la cobertura de cuentas del propio conector; una búsqueda negativa en el correo personal no establece ausencia en Enviados de Workspace. Consulta la [guía de búsqueda en Gmail](https://github.com/scottwofford/sw-prv/blob/main/skills/gmail-search-heuristics/SKILL.md).

**`create_event` de Calendar descarta `location` (verificado el 2026-06-22 en claude-code, eventos de Camp CRAZ).** El `create_event` del conector de Google Calendar ignora en silencio el campo `location`: la llamada tiene éxito y devuelve el evento, pero la ubicación nunca se establece y no se genera ningún error. Crea el evento y luego llama a `update_event` para establecer la ubicación (ese sí respeta el campo). Probablemente afecta también a otros campos opcionales; trata las omisiones silenciosas de campos como una clase. Lista más completa de peculiaridades (bytes de adjuntos de Gmail, límites de alcance/anexado de gdrive): [`connector-quirks.md`](../connector-quirks.md).

**Modo de escritura en Drive (capacidad asimétrica, verificado el 2026-05-09 en claude-code).** El ✅ de la matriz para Google Drive junta dos capacidades muy distintas. **La lectura** funciona en todos los tipos de archivo compatibles (`read_file_content`, `download_file_content`, `search_files`, `get_file_metadata`, `list_recent_files`). **La escritura** está muy limitada: anexar al final de un Google Doc nativo mediante `mcp__gdrive__append_to_document` es la única operación de edición directa; crear uno nuevo mediante `mcp__claude_ai_Google_Drive__create_file` funciona en carpetas donde el principal de OAuth tiene permiso de escritura (devolvió "User cannot add children to the specified folder" en la carpeta Prompt Eng); copiar mediante `mcp__claude_ai_Google_Drive__copy_file`. **No hay edición / reemplazo / inserción a mitad del documento. No hay eliminación ni envío a la papelera. No hay ninguna escritura en archivos .docx** (`append_to_document` los rechaza con "This operation is not supported for this document. The document must not be an Office file."). Implicación: el contenido escrito por Claude que necesita revisarse con el tiempo debe vivir en github, no en Drive. Las escrituras en Drive solo son apropiadas para anexar una sola vez a Google Docs nativos existentes, o para crear documentos nuevos en carpetas donde OAuth tiene permiso de escritura. La regla vinculante por defecto está en [scott-response-req.md R9](personal/scott-response-req.md).

**Corrección (verificado el 2026-06-14).** El límite de solo anexar / "sin inserción a mitad del documento" descrito arriba aplica únicamente a las **herramientas** MCP. Mediante python reutilizando el token OAuth del MCP de gdrive (`~/.config/mcp-gdrive/credentials.json`; alcances `spreadsheets documents drive.readonly`; identidad `scott@luthienresearch.org`), los **Docs** nativos de Google se editan por completo a través de la Docs API (`documents.batchUpdate`: insertar en un índice, eliminar un rango, reemplazar todo, formato) y las **Sheets** a través de gspread (`update_cell` / `batch_update`). Se demostró eliminando una línea a mitad de un documento mediante `replaceAllText` (`occurrencesChanged: 1`). Sigue sin haber escritura en archivos de Office (`.docx`/`.xlsx`); las APIs de Docs/Sheets solo editan tipos nativos de Google. Así que el contenido escrito por Claude que necesita revisarse con el tiempo SÍ PUEDE vivir en un Doc/Sheet nativo de Google, no solo en github; github sigue ganando cuando lo importante es el historial de diffs de git. Patrón para copiar la autenticación: [`luthien-org/fundraising/pipeline/auth.py`](https://github.com/LuthienResearch/luthien-org/blob/main/fundraising/pipeline/auth.py). Detalle completo en [`../claude-ai-project-knowledge/architecture.md`](../claude-ai-project-knowledge/architecture.md) (decisiones del 2026-06-14).

### Directorios permitidos verificados (desktop-mac, MCP Filesystem)

- `/Users/scottwofford/Library/CloudStorage/GoogleDrive-scottwofford3@gmail.com/.shortcut-targets-by-id/129u3BtHRFBeILTbIFf1N2X-NlyphvCoO/Luthien`
- `/Users/scottwofford/Dropbox`
- `/Users/scottwofford/build`
- `/Users/scottwofford/Downloads`
- `/Users/scottwofford/Desktop`

### Rutas canónicas de recursos locales (desktop-mac, claude-code)

Dentro de los directorios permitidos verificados de arriba, estas ubicaciones específicas guardan contenido duradero de recursos de Claude que aparece una y otra vez en las solicitudes de restauración de contexto. Trátalas como direcciones conocidas; no las descubras mediante búsqueda.

| Recurso | Ruta | Formato | Patrón de nombre de archivo |
|---|---|---|---|
| Registros de sesión de Claude Code (~330+ archivos, dic. 2025 a la fecha) | `~/build/luthien-private-session-logs/` | CSV con nombre | `YYYY-MM-DD_topic-slug.csv` |
| Respaldos de chats de claude.ai, índice legible por humanos | `~/build/claude-ai-sync/conversations/by-name/` | Markdown | `<chat title>.md` |
| Respaldos de chats de claude.ai, sin procesar | `~/build/claude-ai-sync/conversations/` | Markdown | `<uuid>.md` |
| Registro de sincronización del Drive de Luthien | `~/Library/CloudStorage/GoogleDrive-scottwofford3@gmail.com/.shortcut-targets-by-id/129u3BtHRFBeILTbIFf1N2X-NlyphvCoO/Luthien/sync.csv` | CSV | `sync.csv` |
| Documentos de requisitos + operaciones (este repo) | `~/build/private-claude-code-docs/` | repo de git | varios |

Mecanismos de sincronización: `~/build/claude-ai-sync/sync-claude-ai.sh` ejecuta el respaldo de chats de claude.ai; `~/build/luthien-private-session-logs/sessions_to_csv.py` produce los CSV de Claude Code.

### Procedimiento estándar de restauración de contexto

Cuando el usuario hace una solicitud de restauración de contexto (las frases incluyen "look at logs," "get context on X," "where were we," "review past chats about Y," "before I take this on the road"), ejecuta lo siguiente:

1. **Extrae el alcance.** Fecha (hoy / últimos N días / fecha específica) y tema (el tema del chat actual O un tema explícito de la solicitud).
2. **Filtra a nivel del sistema de archivos.** Usa `ls ~/build/luthien-private-session-logs/ | grep <date-or-topic>` (o el equivalente para las otras rutas canónicas) en lugar de listar el directorio completo. Según [`personal/scott-response-req.md`](personal/scott-response-req.md) R13 (filtrar la salida del chat para quedarse con lo relevante), no se vuelcan directorios completos en la salida del chat.
3. **Lee como máximo tres candidatos.** Si el filtro da más, nombra los candidatos en prosa y pregunta cuáles leer.
4. **Para el traspaso al móvil, materializa el contenido en línea como texto en el chat.** El MCP Filesystem es solo de escritorio según la matriz de arriba, así que las referencias a archivos no sobreviven el salto de superficie, incluso cuando el mismo chat se abre en el móvil. El resumen en línea es el puente; las rutas de archivo en la salida del chat no lo son.

Los primeros tres pasos aplican a cualquier solicitud de restauración de contexto. El paso 4 es específicamente cómo la disciplina de salida (según R13 en `scott-response-req.md`) se concreta para R1 cuando se señala un traspaso al móvil.

### Acceso actual a mensajes

| Fuente | Claude Code y Codex locales en la Mac configurada de Scott | Otras superficies |
|---|---|---|
| WhatsApp, Signal, iMessage, Facebook Messenger, Instagram, mensajes de LinkedIn, X, Beeper | Descubrimiento de muestras, lectura de mensajes y búsqueda literal verificados mediante Beeper el 14 de septiembre de 2026 | Sin acceso heredado a localhost; verifica una conexión aparte |
| Slack de Redwood Research | Dos identidades. Beeper tiene la cuenta de invitado de Scott en Redwood: canales internos (devops, linuxarena-devs) y mensajes directos, remitentes mostrados como IDs de Matrix, sin herramienta de hilos, sincronización inicial todavía cargando historial el 14 de septiembre de 2026. `slack-redwood` tiene su identidad de Seattle AI Safety y lee los canales de Redwood compartidos mediante Slack Connect (linuxarena-general, linuxarena-aio, linuxarena-lab-notes, redwood-0labs, ext-redwood-luthien, redwood-api-attack-collab, cmft_to_ctower) con nombres resueltos y lectura de hilos | Verifica el acceso específico por espacio de trabajo |
| Slack de Seattle AI Safety | servidores `slack` y `slack-redwood` (misma identidad) | Verifica el espacio de trabajo conectado en esa superficie |
| Slack de High Impact Professionals | `slack-hip`, registrado en ambos clientes locales. Las pruebas simultáneas de identidad, canales, historial y búsqueda de HIP/Seattle y de hilos de HIP pasaron el 22 de septiembre de 2026; [detalles de conexión](https://github.com/scottwofford/sw-prv/blob/main/setup.md#slack-lookup-preference). Las sesiones existentes pueden necesitar reconectarse/reiniciarse. | Sin conexión local heredada |
| Slack de Neolithic | `slack-neolithic`, registrado en ambos clientes locales. Seis pruebas simultáneas de identidad, canales, historial y búsqueda de Neolithic/HIP/Seattle, más lecturas de hilos de Neolithic, pasaron el 22 de septiembre de 2026; [detalles de conexión](https://github.com/scottwofford/sw-prv/blob/main/setup.md#slack-lookup-preference). Las sesiones existentes pueden necesitar reconectarse/reiniciarse. | Sin conexión local heredada |
| Otros espacios de trabajo de Slack | Verifica cada espacio de trabajo restante por separado. | Iniciar sesión en el navegador por sí solo no da acceso al agente |
| Registros de teléfono/FaceTime, Mail.app nativo | No establecido por la auditoría de Beeper | Verifica por separado |

**Antes de afirmar algo sobre respuestas/envíos/seguimientos**, consulta la fuente en vivo correspondiente, identifica la petición y lee los mensajes entrantes/salientes posteriores, las respuestas en hilos y suficientes páginas de historial para cubrir el intervalo. Si no se especifica el canal, revisa los canales plausibles según el historial de la relación. Cita la evidencia positiva; matiza cualquier afirmación de ausencia según las fuentes reales y el intervalo revisado. Resultados vacíos o acceso incompleto significan estado no verificado, no "no reply." La confirmación directa de Scott es más fuerte que un resultado nulo de una herramienta. Cuando se pregunte "did I send X?" o "have I followed up?", enumera explícitamente qué canales puedes ver y cuáles no, y afirma solo dentro de esa ventana de visibilidad; nunca hagas una afirmación de que algo no se envió sin mencionar la salvedad. Esto obliga a todos los agentes, incluidos los que no tienen Beeper.

`get_accounts` omite iMessage a pesar de que el descubrimiento y la lectura de chats funcionan, y los chats de iMessage no se pueden buscar por nombre: los participantes aparecen como hashes opacos y los títulos son números de teléfono, códigos cortos o nombres de grupo. Localízalos por número conocido, nombre de grupo o una búsqueda literal de palabras en los mensajes, y luego `list_messages`. Un historial vacío con `hasMore: true` y cursores nulos significa que el chat todavía no se sincroniza (Beeper limita la frecuencia de la carga inicial del historial; solución de problemas en setup.md), no que esté vacío. El acceso de lectura nunca autoriza el envío de mensajes.

Implementación, permisos, solución de problemas y la auditoría de nueve redes: [acceso a mensajes con Beeper](https://github.com/scottwofford/sw-prv/blob/main/setup.md#beeper-message-access). Evidencia primaria: [sesión de acceso del 14 de septiembre](https://github.com/scottwofford/sw-prv/blob/main/session-logs/2026-09-14_whatsapp-signal-access-codex.csv).

### Regla del punto ciego de `tool_search`

Que `tool_search` devuelva "no matching tools found" NO significa que la herramienta falte en la superficie actual. Caso de falla verificado (desktop-mac): `tool_search "filesystem"` no devolvió coincidencias, pero la llamada directa a `Filesystem:list_allowed_directories` funcionó y devolvió 5 rutas. O bien `tool_search` solo devuelve herramientas diferidas (aún no cargadas), o ciertos MCP locales se registran sin estar en el catálogo buscable.

**Regla:** antes de afirmar "la herramienta X no está disponible en esta superficie", intenta la llamada directa por espacio de nombres. Si el nombre de la llamada no existe o devuelve un error claro de "tool not found", la herramienta está ausente. Si `tool_search` no devuelve nada pero la llamada directa funciona, la herramienta está presente y `tool_search` no fue confiable.

### Evidencia histórica de pruebas por superficie

Estas observaciones fechadas explican fallas anteriores, no límites generales de acceso actuales. Usa la tabla de acceso actual a mensajes y las verificaciones en vivo para cualquier afirmación sobre el estado.

**desktop-mac** (Claude Desktop en macOS). Verificado mediante prueba directa: Google Calendar (5 herramientas cargadas), Gmail (`list_labels` devolvió 14 etiquetas; las consultas alcanzan tanto `scott@luthienresearch.org` como `scottwofford3@gmail.com` desde una sola llamada), Google Drive (`list_recent_files` devolvió 3 archivos, incluidas notas de reunión con Roberto Bandarra), Filesystem (devolvió 5 rutas de la Mac, NO descubribles mediante `tool_search`), web_search (9 resultados), bash_tool (`echo hello` con código de retorno 0), conversation_search ("luthien" devolvió 3 chats anteriores), recent_chats. El panel de conectores confirmó: GitHub Integration `Connected` (MCP en la nube); MCP en la nube de Gmail / Calendar / Drive; Trello `LOCAL DEV`; Filesystem / iMessage / Office / control de Mac / control de Chrome, todos `DESKTOP`; Claude in Chrome aparece dos veces (en la nube `INCLUDED Beta` + versión de 22 herramientas con puente de escritorio).

**mobile-ios.** Fuente: [`../session-logs/2026-05-04_surface-capability-probes.csv`](../session-logs/2026-05-04_surface-capability-probes.csv). `bash_tool` se ejecuta en una VM real Linux 6.18.5 x86_64 con salida de red con lista de permitidos (PyPI/npm/GitHub/Anthropic API/repos de Ubuntu), Python 3.12.3 invocable desde el teléfono; `web_search` + `conversation_search` + `recent_chats`, todos verificados funcionando; los MCP en la nube de Gmail / Calendar / Drive se cargaron todos mediante `tool_search` y se llamaron directamente; la autenticación de Drive se confirmó como personal (`scottwofford3@gmail.com`), no Workspace; `list_calendars` de Calendar devolvió 9 calendarios, incluidos `scott@luthienresearch.org` y `scottwofford3@gmail.com`. Herramientas nativas de iOS presentes en paralelo a los MCP en la nube: `event_create_v0/v1`, `event_search_v0`, `event_update_v0`, `event_delete_v0`, `calendar_search_v0`, la familia completa `reminder_*`, `places_search` + `places_map_display_v0`, `chart_display_v0`, `recipe_display_v0`, `message_compose_v1`, `ask_user_input_v0`. Verificado que faltan: Filesystem, iMessage, Trello, Chrome / navegador, MCP de Office, Slack/GitHub/Notion/Asana. Sorpresa: `tool_search` es difuso + sesgado hacia Gmail; una sola llamada no basta para confirmar ausencia (hubo que consultar "drive" con varias formulaciones para que aparecieran `list_recent_files` y `search_files`); refuerza la regla del punto ciego de `tool_search`. Confianza (autoevaluación de Claude): 80%.

El móvil también tiene un alcance OAuth de Gmail solo personal: la búsqueda devuelve solo `scottwofford3@gmail.com`, no `scott@luthienresearch.org`. La limitación a una sola cuenta también se observó en pruebas anteriores.

**web-claudeai** (Code Execution + File Creation habilitados). Fuente: [`../session-logs/2026-05-04_surface-capability-probes.csv`](../session-logs/2026-05-04_surface-capability-probes.csv). Huella de la superficie identificada por: `bash_tool` se ejecuta en un sandbox Linux 6.18.5 con `/mnt/user-data/uploads`, `/mnt/transcripts`, `/mnt/skills/{public,examples}` montados; salida de red con lista de permitidos (curl a `api.anthropic.com` funciona, dominios arbitrarios bloqueados); cero herramientas de control de navegador (descarta chrome-extension); sin MCP de Filesystem/iMessage (descarta desktop-mac); suite completa de consumidor presente + `bash_tool` descarta la hipótesis de móvil sin bash. Verificado que funcionan: `bash_tool` (Python 3.12.3 + Node v22.22.2 en el contenedor); `view`/`create_file`/`str_replace` (sistema de archivos del sandbox con raíz en `/mnt/`); `web_search` (9 resultados); `conversation_search` (devolvió 2 chats de luthien); `list_calendars` de Google Calendar (9 calendarios, incl. ambas cuentas de Scott + Ping-Scott-Alert + Pike13); `list_labels` de Gmail (INBOX, Banking, News, AMZN Consumer, etc.); `list_recent_files` de Google Drive; `search_mcp_registry` (devolvió Notion, Slack, Egnyte, Shopify, Uber Eats, Thumbtack, Three.js, todos con `installState: "not_installed"`). Skills disponibles en `/mnt/skills/public` para docx/pdf/pptx/xlsx + `frontend-design` (cubre la ausencia de los MCP de Office mediante Python en `bash_tool`). Anthropic API en Artifacts (Sonnet 4 invocable, puede adjuntar URLs de MCP de Calendar/Gmail/Drive). Verificado que faltan: Claude in Chrome / Control Chrome (MCP de navegador); MCP Filesystem (sistema de archivos local de la Mac; el sandbox `/mnt/*` es independiente); iMessage; MCP de Office (reemplazables mediante skills). Confianza (autoevaluación de Claude): 92%.

**chrome-extension** (extensión Claude for Chrome). Fuente: [`../session-logs/2026-05-04_surface-capability-probes.csv`](../session-logs/2026-05-04_surface-capability-probes.csv). Huella de la superficie: Chrome 147 real en macOS (agente de usuario verificado mediante `javascript_tool`); contexto de pestañas entregado mediante `<system-reminder>` con `availableTabs`/`initialTabId`; herramientas limitadas a una pestaña de Chrome que requieren el parámetro `tabId`. Verificado que funcionan: `read_page`, `find` (devolvió 3 referencias en la pestaña de claude.ai, incluidos los botones de entrada/detener/adjuntar), `computer` (clic/escritura/desplazamiento/captura de pantalla/tecla/hover/zoom limitados a la pestaña del navegador, NO a nivel del sistema operativo), `navigate`, `tabs_context`, `tabs_create`, `form_input`, `get_page_text`, `javascript_tool` (evaluó `document.title`/`location.href`/agente de usuario), `read_console_messages`, `read_network_requests`, `resize_window`, `upload_image`, `file_upload`, `gif_creator` (grabar→exportar una sesión del navegador), `update_plan`, `turn_answer_start`, `browser_batch` (encadena pasos en un solo viaje de ida y vuelta). Faltantes críticos verificados: **el propio `tool_search` está ausente** en esta superficie (así que la regla del punto ciego de `tool_search` no aplica aquí: no hay ninguna capa de descubrimiento); ningún MCP en la nube (ni Calendar, ni Gmail, ni Drive); sin `web_search`, `web_fetch`, `bash_tool`, `conversation_search`, `recent_chats`; sin Artifacts/REPL; sin computer use a nivel del sistema operativo. En resumen: **agente de automatización de navegador estrecho + profundo**, extremadamente capaz dentro de una pestaña de Chrome (DOM, JS, red, consola, capturas de pantalla, grabaciones, entradas de archivos) y prácticamente impotente fuera de ella. Fuerte encuadre de defensa contra inyecciones en el prompt de sistema, característico de una superficie de navegador agéntico donde hay contenido no confiable de las páginas en el circuito.

**claude-code, bloqueo por alcance del MCP de Gmail.** Fuente: [`../session-logs/2026-05-02_investor-database-sync-mcp-account-blocker.csv`](../session-logs/2026-05-02_investor-database-sync-mcp-account-blocker.csv). Modo de falla verificado mientras Scott intentaba sincronizar la base de datos de inversionistas a partir del correo enviado de Gmail: `from:scott@luthienresearch.org newer_than:3d` devolvió 0 resultados; `from:scottwofford3@gmail.com newer_than:3d` devolvió solo aceptaciones de calendario personales. Diagnóstico: el espacio de nombres `mcp__claude_ai_Gmail__*` en Claude Code está conectado por OAuth a `scottwofford3@gmail.com` (personal), NO a `scott@luthienresearch.org` (Workspace). El "Luthien MCP" que Scott configuró mediante Google Cloud Provider era el MCP de gdrive en `~/.config/mcp-gdrive/`, no Gmail. Los hilos entrantes de Luthien solo se pueden leer porque Scott tiene una regla de reenvío a la cuenta personal; el correo saliente de Workspace no pasa en absoluto por el buzón personal y es invisible desde claude-code. **Implicación para R2:** cuando se pregunte "did I send X from Luthien?", claude-code DEBE señalar este vacío: la vía de verificación no existe en esta superficie y ninguna espera por un "MCP indexer lag" lo resuelve. Alternativas: (a) agregar `scott@luthienresearch.org` al conector de Gmail de claude.ai y luego volver a probar; (b) hacer el barrido desde una superficie que tenga autenticación de Workspace (claude.ai móvil/escritorio) y dejar archivos JSON en el flujo de trabajo existente `pipeline/sweeps/row*.json`.

**claude-code, inventario de herramientas.** Herramientas disponibles: Bash, Read, Edit, Write, Glob, Grep, Agent, WebSearch, WebFetch, mcp__trello__*, mcp__claude_ai_Gmail__* (solo personal, ver arriba), mcp__claude_ai_Google_Drive__*, mcp__claude_ai_Google_Calendar__*, mcp__gdrive__*, mcp__otter__*, mcp__slack__* (vía configuración MCP). Acceso nativo al sistema de archivos mediante Bash + Read/Edit/Write. Sin `conversation_search` / `recent_chats`.

### Pruebas pendientes

| # | Prueba | Superficie | Prioridad | Protocolo |
|---|---|---|---|---|
| 1 | GitHub Integration | desktop-mac | alta | `tool_search "github"`, luego intentar llamadas directas (`list_repos`, `read_file` sobre `scottwofford/private-claude-code-docs/requirements/cross-surface-context-mgmt-req.md`) |
| 2 | Alcance de cuentas de Gmail en web-claudeai | web-claudeai | media | Ejecutar explícitamente `from:scott@luthienresearch.org newer_than:1d` y `from:scottwofford3@gmail.com newer_than:1d` para confirmar si web-claudeai ve una cuenta o ambas |
| 3 | Persistencia de autenticación de los MCP en la nube | entre superficies | baja | Determinar si los MCP en la nube de Calendar / Gmail / Drive persisten entre superficies con la misma autenticación, o si requieren volver a autenticarse en cada superficie |

Cuando se complete una prueba, actualiza la celda de la matriz con la fecha + agrégala a "Evidencia de pruebas por superficie" arriba.

## B. 5 porqués

1. **Problema superficial:** cuando abro un chat en el móvil, el asistente no sabe lo que pasó en mi sesión de Claude Code de esta mañana. Tengo que volver a explicar el contexto y a veces olvido lo que ya expliqué.
2. **¿Por qué?** Claude Code y claude.ai móvil no comparten almacenamiento. La memoria automática y los registros de sesión viven en la laptop; claude.ai solo ve su propio backend.
3. **¿Por qué importa más allá de la incomodidad?** Tres costos reales: (a) tiempo perdido y contexto olvidado, (b) el chat móvil puede tomar decisiones inconsistentes con lo que se decidió antes en la laptop, (c) al tender el puente con una instantánea derivada (el documento Daily State), la instantánea se deterioró en silencio y el chat móvil dijo con confianza cosas desactualizadas; peor que no tener ningún puente.
4. **¿Por qué falló el puente de instantánea?** Duplicaba datos de origen en un documento derivado que solo se actualizaba cuando se ejecutaba un trabajo explícito (deterioro de instantáneas). Más en el fondo: el sistema afirmaba cosas con confianza sin advertir que los datos de origen estaban desactualizados. Afirmar cosas incorrectas con confianza es la falla de raíz: el deterioro de instantáneas es una causa, la contaminación entre modos es otra, abrir el móvil desde cero sin contexto es una tercera.
5. **¿Por qué no nombramos el requisito correcto desde el principio?** No había requisitos escritos. Cada sesión nueva reinventaba "what does Scott need" y aterrizaba en una única solución propuesta. Raíz más profunda: Claude hace sugerencias con forma de solución con confianza sin validarlas contra la necesidad del usuario; Scott a menudo las acepta hasta que se ha construido lo suficiente como para que se sienta mal.

**Raíz:** la configuración de Claude entre superficies necesita que el sistema sea honesto sobre lo que sabe y lo que no sabe, en el momento de afirmar contexto, no después de que Scott descubra la mentira.

## C. Preguntas abiertas

1. **Frecuencia de móvil desde cero.** R2 es más esencial cuando Scott abre claude.ai móvil desde cero, sin contexto previo cargado desde otra superficie. R1 (continuidad) es más esencial cuando SÍ hay una sesión previa que continuar. La influencia relativa de R1 frente a R2 depende de qué patrón domina el uso real que Scott hace del móvil. **Instrumento:** Scott etiqueta cada sesión móvil durante una semana como "continuation" (retomando desde la laptop) o "fresh" (sin contexto previo) en el CSV del registro de sesión. **Regla de decisión:** si "fresh" es ≥10% de las sesiones móviles, R2 es el enfoque de mayor influencia. Si es <10%, gana R1 (continuidad mediante el puente desde Desktop).

2. **Verificación de completitud: ¿a R1-R3 les faltan modos de falla?** Hilos recientes de claude.ai + registros de sesión revelaron cuatro tipos de falla: estampar fechas desactualizadas, confusión de zona horaria UTC/PT, mezcla de entidades con nombres parecidos, detalles de escenas inventados. Los cuatro encajan en R2 (verificar antes de afirmar). **Instrumento:** Scott señala cualquier molestia futura que no encaje en R1, R2 o R3 como candidata a nuevo requisito; volver a analizar los hilos recientes en la próxima revisión importante del documento.

3. **Pruebas de capacidades por superficie pendientes.** Las pruebas de desktop-mac y mobile-ios están completas; las de web-claudeai, chrome-extension y GitHub Integration están pendientes. Aprendizaje de proceso surgido durante la prueba de escritorio: que `tool_search` devuelva "no matching tools found" NO significa que la herramienta falte en la superficie actual (punto ciego verificado mediante `Filesystem:list_allowed_directories` que funcionó a pesar de que `tool_search "filesystem"` no devolvió nada). **Instrumento:** Scott ejecuta los protocolos de prueba documentados en [`surface-capabilities.md`](surface-capabilities.md) en cada superficie pendiente, intentando tanto `tool_search` COMO llamadas directas por espacio de nombres. **Regla de decisión:** cualquier vacío nuevo que se encuentre actualiza la matriz; cualquier modo de falla de comportamiento nuevo se agrega a las columnas de evidencia de R1-R3 o plantea un candidato a nuevo requisito.

## D. Nota de método

Este documento fue redactado por Claude. Scott respaldó la dirección, la estructura y la forma de Épica + subhistorias, luego leyó R1, R2, R3 y los criterios de aceptación y confirmó que en general tienen sentido. La validación es que el usuario lea los requisitos; este es un repo de un solo usuario sin otros revisores.

## E. Recetas operativas de R2 (verificar antes de afirmar)

Trasladadas desde CLAUDE.md (2026-06-03) para mantener ligero el archivo que siempre se carga. Las reglas imperativas se quedan en CLAUDE.md; las recetas y la evidencia viven aquí y se cargan cuando se necesitan.

**Fecha y hora.** Ejecuta `date` antes de responder cualquier cosa sensible al tiempo. No te ancles en las marcas de tiempo del historial del chat ni en el campo `currentDate` del contexto del sistema (se fija al inicio de la sesión; se desactualiza al pasar la medianoche o en sesiones largas).

**Fechas derivadas en cualquier artefacto (día de la semana + duración + zona horaria).** Nunca escribas un día de la semana de memoria. Antes de escribir pares del estilo `Tue, May 8` en cualquier documento, calcúlalos con `date -j -f "%Y-%m-%d" "$D" "+%a, %b %-d"` (agrupa todas las fechas del documento en una sola llamada a Bash). Para marcas de tiempo de Slack en UTC entre 00:00-08:00 UTC (PDT) / 00:00-09:00 UTC (PST), la fecha en PT es el día ANTERIOR; siempre calcula, nunca supongas que es el mismo día. Las duraciones de reuniones citan el último encabezado de sección de la transcripción o se omiten. Antes de cualquier commit que agregue contenido con fechas: `grep -nE '(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (Jan|Feb|Mar) [0-9]+' <files>` y verifica cada coincidencia contra `date -j`. Establecido el 2026-05-20 después de que 7 errores de día de la semana + 1 de duración llegaran a [luthien-org PR #19](https://github.com/LuthienResearch/luthien-org/pull/19) (caso de estudio de Trajectory).

**Conciencia de fecha en subagentes.** Al despachar un Agent que pueda necesitar conocer la fecha, antepón la hora verificada al prompt del subagente:

```
CURRENT-TIME (verified by parent agent via `date` at dispatch): <output of `date '+%Y-%m-%d %H:%M:%S %Z'`>

<actual subagent prompt>
```

Evidencia empírica: 5/5 subagentes reportaron "Today is 2026-05-01" leyendo `currentDate` sin ejecutar `date`; con inyección en el prompt, 10/10 usaron la hora inyectada. El `additionalContext` de los hooks NO sustituye de forma confiable el contexto del sistema para los subagentes; la inyección en el prompt sí. Un hook `PreToolUse` sobre `Task|Agent` (`scripts/inject-date-into-agent-prompt.sh`) antepone automáticamente CURRENT-TIME a cada despacho de Agent mediante `updatedInput`; verificado 3/3 APROBADO en la inyección automática. Idempotente; se omite si el prompt ya empieza con CURRENT-TIME.

**Enrutamiento de datos a su fuente.** Mensaje reciente de X: busca en el canal correspondiente (Gmail / Slack directo / conversación de Beeper, incluidos iMessage y Signal; skill `gmail-search-heuristics` para el orden de búsqueda). Hora / agenda / asistentes de una reunión: Google Calendar `mcp__claude_ai_Google_Calendar__list_events` (prueba `scott@luthienresearch.org` para trabajo; el principal para lo personal). Estado de una tarjeta de Trello: `mcp__trello__get_card`. Cargo / empresa / afiliación a un fondo de una persona: firma de Gmail / WebFetch / documento de referencia conocido. Montos en dólares, conteos de LOI, estadísticas de tracción: cita la fuente canónica en línea. Si la verificación no está disponible en la superficie, di "I do not have that loaded right now"; una verificación fallida satisface R2, una verificación inventada lo viola.

## F. Higiene de la memoria guardada de claude.ai

La memoria guardada es una instantánea que se regenera cada noche, así que el Principio 4 (primacía del sistema de origen) rige lo que pertenece en ella. La memoria solo contiene: (1) datos de identidad duraderos que seguirán siendo ciertos dentro de 6+ meses (familia, trayectoria, hogar, patrones de salud, equipo de gimnasio, acuerdos predeterminados de cuidado infantil); (2) preferencias permanentes y notas sobre herramientas; (3) punteros a fuentes canónicas (rutas de archivo, IDs de documentos), nunca copias de su contenido.

La memoria NO debe contener:

- **Negociaciones, tratos o conversaciones de trabajo en curso.** Verificado el 2026-07-17: una conversación que evolucionaba rápidamente se guardó con una organización equivocada y una fecha de llamada equivocada en cuestión de días, además de una nota interpersonal sensible que nunca debió haberse guardado como instantánea.
- **Pendientes abiertos o confirmaciones por recibir.** Calendar / Trello / el correo son la fuente de verdad; las copias recordadas se quedaron desactualizadas durante semanas (los elementos de la reunión con Broerman y de la confirmación del seguro).
- **Problemas técnicos sin resolver.** Sobreviven a su solución; verificado el 2026-07-17: el elemento del conector de Drive siguió "activo" en la memoria después de haberse resuelto el 2026-07-16.
- **Duplicados de reglas que están en los documentos de requisitos que se consultan.** Las copias divergen de lo canónico; verificado el 2026-07-17: límites de calibración estáticos en la memoria contradecían R3, que los había reemplazado en mayo de 2026.

Prefiere datos fechados en tiempo pasado sobre afirmaciones de estado en tiempo presente. Prueba de almacenamiento: ¿seguirá siendo cierto, útil y seguro para actuar dentro de 6 meses sin ningún otro contexto? La guía permanente se le dio al sistema de memoria el 2026-07-17 mediante el cuadro de instrucciones de Manage-memory; vuelve a darla si la regeneración se desvía.

## G. Propagar las correcciones de estado a las fuentes canónicas

Cuando Scott corrige una sugerencia de tarea desactualizada ("I already pinged Sevan", "that's done", "that changed"), reconocerlo en el chat no basta: en el mismo turno, busca en las superficies canónicas que podrían regenerar la sugerencia (Plan of Attack, tarjetas de Trello, objective.md, otros documentos de planeación) las menciones de esa tarea, actualiza cada una en su lugar al estado actual e informa qué se actualizó y dónde. Una corrección que vive solo en el contexto de una sesión reaparece en cada sesión futura que vuelva a leer la fuente desactualizada. Esto es especialmente obligatorio cuando la corrección llega por una fuente no disponible en la superficie actual (incluidas capturas de pantalla): la actualización del documento es el único registro duradero. En una superficie que no puede escribir en la fuente desactualizada (por ejemplo, claude.ai sin el alcance de conector necesario), nombra qué fuente todavía tiene el estado desactualizado para que Scott o una sesión de Claude Code puedan corregirlo.

*Origen: 2026-07-24, "Request feedback from Sevan" se volvió a sugerir desde el Nivel 4 del Plan of Attack después de que Scott le había enviado el borrador a Sevan el 22 de julio y había corregido a una sesión anterior. La regla también está en [`../CLAUDE.md`](../CLAUDE.md) en las convenciones siempre activas; se reubicó aquí el 2026-08-16 para que aplique en claude.ai mediante la consulta que se hace en cada chat.*

## Documentos relacionados

- [`../claude-ai-project-knowledge/architecture.md`](../claude-ai-project-knowledge/architecture.md): arquitectura entre superficies + principios de diseño
- [`../CLAUDE.md`](../CLAUDE.md): identidad, flujo de trabajo y preferencias de Scott en Claude Code
- [`personal/scott-response-req.md`](personal/scott-response-req.md): requisitos personales de Scott para las respuestas de Claude (superficie Customize / claude.ai)
- [`personal/quentin-response-req.md`](personal/quentin-response-req.md): destilación de requisitos de Quentin Feuillade-Montixi
- [`personal/matt-mandzel-response-req.md`](personal/matt-mandzel-response-req.md): destilación de requisitos de Matt Mandzel
- [`design-principles.md`](design-principles.md): metadocumento sobre CÓMO vincular requisitos a superficies
- [formato canónico de luthien-org](https://github.com/LuthienResearch/luthien-org/blob/main/ui-fb-dev/2-versions-requirements/README.md)
- [Registros de sesión](../session-logs/): fuente primaria de evidencia
