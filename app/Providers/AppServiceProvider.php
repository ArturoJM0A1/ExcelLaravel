<?php

namespace App\Providers;

use Illuminate\Foundation\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->disableStaleViteHotFile();
    }

    /**
     * Ignore stale Vite hot files so the app can fall back to built assets.
     */
    private function disableStaleViteHotFile(): void
    {
        $hotFile = public_path('hot');

        if (! is_file($hotFile)) {
            return;
        }

        $viteUrl = trim((string) file_get_contents($hotFile));

        if ($viteUrl === '' || ! $this->isViteDevServerReachable($viteUrl)) {
            app(Vite::class)->useHotFile(storage_path('framework/vite.hot'));
        }
    }

    /**
     * Check whether the Vite dev server referenced by the hot file is reachable.
     */
    private function isViteDevServerReachable(string $viteUrl): bool
    {
        $parts = parse_url($viteUrl);

        if (! is_array($parts) || empty($parts['host'])) {
            return false;
        }

        $scheme = $parts['scheme'] ?? 'http';
        $host = $parts['host'];
        $port = $parts['port'] ?? ($scheme === 'https' ? 443 : 80);
        $target = ($scheme === 'https' ? 'ssl://' : '').$host.':'.$port;
        $connection = @stream_socket_client($target, $errorNumber, $errorMessage, 0.2);

        if ($connection === false) {
            return false;
        }

        fclose($connection);

        return true;
    }
}
