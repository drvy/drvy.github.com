---
layout: post
title: Detectar Adblock plus o NoScript. Fácil.
date: 2012-08-06 00:00:00
categories: adblock, js
tags: js, #adblock
shortUrl:
---

Seamos sinceros, a nadie que tenga un blog/pagina web y quiera sacarse el dinero suficiente para pagar el hosting o el dominio y aparte sacarse un poco de dinero para el, le gusta que sus visitantes vengan con Adblock plus o NoScript... generalmente son unos eurillos que te permiten pagar el hosting o tal pero es algo. Ahora os voy a mostrar una manera muy fácil con la que me tope el otro día para detectarlos.

Hace algunos años que herramientas como NoScript o AdBlock plus se han hecho populares para la publicidad y scripts que no hacen ni falta. Dado que la mayoría de la publicidad proviene de un archivo javascript externo y suelen llevar unas palabras clave como “ads”,“ad”,“adsense” etc.. es bastante fácil bloquearlos o lo que hacen otros “ocultarlos”.

Hay muchas técnicas para detectar Adblock.. pero la mayoría son inefectivas y entran en conflicto directo con los creadores de este que luchan por evitarlo. NoScript es un tanto diferente porque lo que hace es decir al navegador que no cargue dicho recurso externo/interno.

Uno de los posibles métodos es buscar y ver si las variables (si es que las hay) de un dicho script externo/interno estan declaradas y en caso de que no lo estén salte. Esto funcionaba con AdBlock hace unos meses pero ahora ya no. En cambio con NoScript funcionaria pero si el visitante decide dejarte sin javascript la pagina entera no funcionaria para nada.

La manera mas efectiva desde mi punto de vista es utilizar **javascript para ocultar** el mensaje que lanzaremos en caso de que dichos complementos bloqueen nuestra publicidad **y no al revés como lo hacen la mayoría**.

Así mismo para detectar cuando la publicidad no ha llegado a la vista del visitante es tan fácil como meterla en un div y luego comprobar si es lo suficientemente alto.. generalmente si no es definido en una regla css, un div vació permanecerá con un alto de 0px.

Si suponemos que tenemos 2 divs a los que llamaremos *miP* (publicidad) y *miD* (mensaje)...

{% highlight html %}
<div class="miP">
   <script type="text/javascript" src="publicidad.js"></script>
</div>
<div class="miD" style=" text-align:center;">
   <h3>Publicidad desactivada =(</h3>
</div>
{% endhighlight %}

Mediante javascript primero ocultaremos *miD* y luego comprobaremos el tamaño de altura de nuestro *miP* para por si es de 0 y tengamos que mostrar el mensaje.

De esta forma, el javascript que necesitaremos es fácil de implementar. Voy a utilizar jQuery para dar los ejemplos.

{% highlight js %}
$(document).ready(function() {
   $('.miD').hide();
   if ($('.miP').height() == 0){$('.miD').show();}
});
{% endhighlight %}


Saludos