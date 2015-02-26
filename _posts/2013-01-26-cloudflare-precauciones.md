---
layout: post
title: "Problemas comunes y precauciones con CloudFlare. "
date: 2013-04-26 00:00:00
categories: cloudflare
tags: cloudflare
shortUrl:
---

CloudFlare sin duda se ha vuelto popular. Sobre todo últimamente por su ayuda a [“parar” un ataque DDoS de 120Gbps](http://blog.cloudflare.com/the-ddos-that-almost-broke-the-internet).

**CloudFlare** en si, se hace llamar CDN. Es una red de entrega de contenidos, que cachea [ciertos recursos](https://support.cloudflare.com/entries/22037282-What-file-extensions-does-CloudFlare-cache-for-static-content-) en sus servidores (23 data centers) para responder en un menor tiempo al cliente. Tiene otras opciones como “restricción” de trafico (en donde literalmente puedes prohibir el trafico de un país hacia tu pagina web), optimización (minimify, compress etc..), Analitycs (se dice que: exageran..) y algunas apps (por ejemplo: mostrar un mensaje a visitantes con navegadores obsoletos).

Puesto que es gratis muchos ya se han unido a sus clientes.. sin embargo hay ciertas precauciones que hay que tomar y que curiosamente NO te indican así a la sencilla. Aquí resumo algunas de ellas..

REMOTE_ADDR y/o los logs server-side
---
Puesto que CloudFlare actúa como un proxy, en el momento en el que se active, habrá un cambio brusco a la hora de loguear direcciones IP. Dicho simple: **En vez de ver la dirección IP del visitante, veras la de CloudFlare.**

En lenguajes server-side esto se puede corregir de manera simple, puesto que CloudFlare, te envía un par de headers (cabeceras HTTP) que te ayudan. E aquí una muestra (print_r($_SERVER)):

    [HTTP_CF_CONNECTING_IP] => 123.456.789.000
    [HTTP_CF_IPCOUNTRY] => ES
    [HTTP_CF_RAY] => dasda2342adasd
    [HTTP_CF_CIP_TAG] => 0
    [HTTP_CF_VISITOR] => {"scheme":"http"}
    [HTTP_CF_WAN_ID] => 0
    [HTTP_CF_WAN_ENCODING] => 0

Como podéis observar las que mas nos interesan serian las dos primeras. La primera, retorna la IP del visitante mientras que la segunda, su país. Así por las buenas, su utilizamos CloudFlare, no tenemos que utilizar servicios (de pago) de terceros para detectar el país del visitante. Cabe destacar que para que CloudFlare envié la segunda variable haría falta activar dicha opción desde el panel de control.

*Nota: La cabecera X-Forwarded-From también retornara la IP del visitante sin embargo, no te la recomiendo puesto que se puede editar via cliente y puede suponer un riesgo de seguridad hacia tu sitio web.*

En base a esto, podemos construir una sencilla función que se encargue de detectar si utilizamos CloudFlare y en base a la respuesta, retornar una u otra.

{% highlight php %}
<?php
function RemoteAddr(){
    return (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])
        ? $_SERVER['HTTP_CF_CONNECTING_IP'] :
            $_SERVER['REMOTE_ADDR']);
}
?>
{% endhighlight %}

A parte de esto, hay una colección completa de plugins, mods y tutoriales para otras platformas y CMS (Apache, Lighttpd, IIS, vBulletin) [aquí](https://support.cloudflare.com/forums/21318827).

Adsense, Analitycs ... publicidad/visitas afectada
---

He leído muchas quejas sobre como CloudFlare “destruye” la publicidad (adsense y otros) y las visitas hacia la pagina bajan drásticamente. Bien, este tema da mucho de que hablar (según mi experiencia con CloudFlare) pero intentare resumirlo:

### Las visitas bajan drásticamente
Esto se puede deber principalmente a 3 cosas.

**1. Utilizas un script que mide las visitas server side** y/o utilizas servicios que se basan en logs server-side. Como he explicado mas arriba, CloudFlare actúa como proxy y por tanto, la IP cambiara por la suya. Puedes solucionar esto, con los mods/tutoriales/plugins que dejan en su pagina web (enlace mas arriba).

**2. Utilizas un javascript/script client-side** pero tienes activado **Auto Minify**, **Rocket Loader** y/o **Website Preload**. Estas “características” de CloudFlare, pueden corromper/modificar el comportamiento normal de scripts client-side. Puedes desactivar estas características desde *CloudFlare settings &#8594; Perfomace Settings* de tu dominio.

### Los scripts de publicidad desaparecen o no generan clicks