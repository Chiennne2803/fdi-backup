import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from 'environments/environment';
import { AppModule } from 'app/app.module';

if ( environment.production )
{
    enableProdMode();
}

window.addEventListener('storage', (event) => {
    if (event.key === 'logout-event') {
        localStorage.removeItem('logout-event');
        window.location.reload();
    }
})

platformBrowserDynamic().bootstrapModule(AppModule)
                        .catch(err => console.error(err));
