<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#101312">
        <title>Mercury Ledger | Catalogo editable</title>
        <style>
            body {
                margin: 0;
                min-height: 100vh;
                font-family: "Segoe UI", sans-serif;
                background: #f5f9ff;
                color: #123457;
            }

            .boot-fallback {
                max-width: 52rem;
                margin: 3rem auto;
                padding: 1.5rem;
                border: 1px solid #d8e7fb;
                border-radius: 1rem;
                background: #ffffff;
                box-shadow: 0 12px 30px rgba(34, 82, 148, 0.08);
            }

            .boot-fallback h1 {
                margin: 0 0 0.75rem;
                font-size: 1.5rem;
            }

            .boot-fallback p {
                margin: 0.5rem 0;
                line-height: 1.6;
            }

            .boot-fallback code {
                padding: 0.15rem 0.4rem;
                border-radius: 0.4rem;
                background: #edf4ff;
            }
        </style>
        @vite('resources/js/app.jsx')
    </head>
    <body>
        <div id="app">
            <div class="boot-fallback">
                <h1>Cargando Mercury Ledger...</h1>
                <p>Si esta pantalla no cambia en unos segundos, abre la app en <code>http://127.0.0.1:8000</code>.</p>
                <p>Si sigues viendo esto, el frontend no termino de cargar y Laravel usara el build compilado cuando Vite no este disponible.</p>
                <noscript>
                    <p>Tu navegador tiene JavaScript desactivado, por eso la interfaz no puede renderizarse.</p>
                </noscript>
            </div>
        </div>
    </body>
</html>
