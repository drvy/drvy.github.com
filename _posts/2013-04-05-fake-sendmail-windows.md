---
layout: post
title: "Fake sendmail o como hacer que la función mail() funcione en Windows."
date: 2013-05-05 00:00:00
categories: php, sendmail
tags: mail,php,windows
shortUrl:
---

> **Este post es algo viejo.**
>
> El autor de este sendmail ha indicado en su propia pagina que **ya no tiene tiempo para mantener o actualizar la aplicación** así que es probable que quieras buscar otras alternativas.
>
> Por cuestiones de comodidad, he decidido subir la ultima versión a fecha de 25 Feb 2015 a [mi Dropbox](https://www.dropbox.com/s/6nevemx4w8kvtk7/sendmail.zip?dl=1) para evitar no poder descargarlo en el futuro.

Para los que usamos Windows, es algo difícil (por no decir imposible) encontrar un cliente SMTP que realmente funcione bien. O bien tienen limites, o en la mayoría de los casos no funcionan.. o algunos servidores de correo (como Gmail) acaban denegando la petición porque no proviene de una IP &ldquo;aceptada&#8221;.

Hace tiempo descubrí &ldquo;Fake sendmail&#8221;. Es un &ldquo;programa&#8221; que se encarga de hacerte la vida mas fácil. Es un cliente SMTP capaz de enviar correos desde tu cuenta de correo (Gmail, Hotmail etc). A mi personalmente me resulta bastante cómodo porque:

- No depende de servicios ni programas que tengan que estar ejecutados permanentemente.
- No dependo de mi IP.
- Realmente emula la función _sendmail -t_ y por tanto no dependo de librerías externas.
- Its FREE!

Para los que lo quieran probar os dejo el enlace hacia la pagina:
[Visitar pagina de sendmail.](http://glob.com.au/sendmail/)

Configurar fake-sendmail
---

Una vez descargado el archivo _(.zip)_, lo debemos descomprimir en la carpeta deseada. Preferiblemente debe ser una carpeta a nivel partición _(C:\sendmail)_. En mi caso, yo la descomprimo en _C:\SERVER\sendmail_ que es donde tengo instalado el servidor WAMP.

Ahora, nos toca editar el archivo `sendmail.ini`. Lo que mas nos interesa son las siguientes lineas:

    smtp_server=
    smtp_port=
    smtp_ssl=
    auth_username=
    auth_password=
    force_sender=

`smtp_server` es la dirección del servidor SMTP _(Para Gmail es `smtp.gmail.com`)_.

`smtp_port` es el puerto del servidor. _(Gmail usa `465`)_.

`smtp_ssl` Indicar si usar SSL o no. _(Para Gmail es obligatorio)_.

`auth_username` sera tu usuario _(En Gmail debe ser la dirección de correo completa)_.

`auth_password` seria la contraseña.

`force_sender` es para forzar el campo &ldquo;From&#8221;.


Configurar PHP
---

Bien, ahora toca editar el archivo **php.ini**. La razón es que debemos indicarle que utilizaremos una aplicación aparte y que no mande directamente el request hacia el puerto 25.

Así que buscamos `sendmail_path` en el `php.ini`, ponemos la ruta hacia el `sendmail.exe` que hemos descargado y agregamos el parámetro `-t`. En mi caso:

    sendmail_path = "C:\SERVER\sendmail\sendmail.exe -t"


Probando! Probando!
---

No hace falta mas que una simple linea en PHP para probar si todo va bien:

    <?php mail('tucorreo@ejemplo.com','Prueba','Prueba 1..2..3.'); ?>

Si algo no funciona (no te llega el correo), siempre puedes consultar el archivo **error.log** en la carpeta del _sendmail_.

